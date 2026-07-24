/**
 * MongoDB access layer.
 *
 * If `MONGODB_URI` is set (production / Vercel with MongoDB Atlas), we use
 * the real driver. Otherwise we fall back to an in-memory + JSON-file store
 * that implements the same tiny interface so the app works locally and in
 * the sandbox without requiring a MongoDB instance.
 *
 * All application code should use `col("collection_name")` — never touch
 * the underlying implementation directly.
 */

import { MongoClient, ObjectId, type Db } from "mongodb";
import fs from "node:fs";
import path from "node:path";

/* ----------------------------- Shared types ----------------------------- */

export type Doc = { _id?: string };
export type Filter = Record<string, unknown>;
export type UpdateOps = { $set?: Record<string, unknown> };

export interface Collection<T extends { _id?: string } = Doc> {
  findOne(filter: Filter): Promise<T | null>;
  find(filter?: Filter): {
    sort(spec: Record<string, 1 | -1>): {
      limit(n: number): { toArray(): Promise<T[]> };
      toArray(): Promise<T[]>;
    };
    limit(n: number): { toArray(): Promise<T[]> };
    toArray(): Promise<T[]>;
  };
  insertOne(doc: T): Promise<{ insertedId: string }>;
  insertMany(docs: T[]): Promise<{ insertedIds: string[] }>;
  updateOne(filter: Filter, update: UpdateOps): Promise<{ matchedCount: number }>;
  deleteOne(filter: Filter): Promise<{ deletedCount: number }>;
  deleteMany(filter: Filter): Promise<{ deletedCount: number }>;
  countDocuments(filter?: Filter): Promise<number>;
}

/* ---------------------------- Real MongoDB ----------------------------- */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "jobtrail";

const globalForMongo = globalThis as typeof globalThis & {
  __jtMongoClient?: MongoClient;
  __jtMongoDb?: Db;
  __jtMongoPromise?: Promise<Db>;
};

async function getMongoDb(): Promise<Db> {
  if (globalForMongo.__jtMongoDb) return globalForMongo.__jtMongoDb;
  if (!globalForMongo.__jtMongoPromise) {
    const client = new MongoClient(uri!, { serverSelectionTimeoutMS: 3000 });
    globalForMongo.__jtMongoClient = client;
    globalForMongo.__jtMongoPromise = client.connect().then((c) => {
      const database = c.db(dbName);
      globalForMongo.__jtMongoDb = database;
      return database;
    });
  }
  return globalForMongo.__jtMongoPromise;
}

function matches(doc: Doc, filter: Filter): boolean {
  for (const [k, v] of Object.entries(filter)) {
    // simple equality + $in support
    const dv = (doc as Record<string, unknown>)[k];
    if (v && typeof v === "object" && "$in" in v) {
      const arr = (v as { $in: unknown[] }).$in;
      if (!arr.includes(dv)) return false;
    } else if (dv !== v) {
      return false;
    }
  }
  return true;
}

function wrapMongo<T extends Doc>(name: string): Collection<T> {
  return {
    async findOne(filter) {
      const db = await getMongoDb();
      const f = normalizeIdFilter(filter);
      const doc = await db.collection(name).findOne(f);
      return normalizeOut(doc) as T | null;
    },
    find(filter = {}) {
      const f = normalizeIdFilter(filter);
      const build = (opts: { sort?: Record<string, 1 | -1>; limit?: number }) => ({
        async toArray() {
          const db = await getMongoDb();
          let cursor = db.collection(name).find(f);
          if (opts.sort) cursor = cursor.sort(opts.sort);
          if (opts.limit) cursor = cursor.limit(opts.limit);
          const arr = await cursor.toArray();
          return arr.map((d) => normalizeOut(d)) as unknown as T[];
        },
      });
      return {
        sort(spec) {
          return {
            limit(n: number) {
              return build({ sort: spec, limit: n });
            },
            toArray() {
              return build({ sort: spec }).toArray();
            },
          };
        },
        limit(n) {
          return build({ limit: n });
        },
        toArray() {
          return build({}).toArray();
        },
      };
    },
    async insertOne(doc) {
      const db = await getMongoDb();
      const r = await db.collection(name).insertOne(doc as Record<string, unknown>);
      return { insertedId: r.insertedId.toString() };
    },
    async insertMany(docs) {
      const db = await getMongoDb();
      const r = await db.collection(name).insertMany(docs as Record<string, unknown>[]);
      return { insertedIds: Object.values(r.insertedIds).map((id) => id.toString()) };
    },
    async updateOne(filter, update) {
      const db = await getMongoDb();
      const r = await db.collection(name).updateOne(normalizeIdFilter(filter), update);
      return { matchedCount: r.matchedCount };
    },
    async deleteOne(filter) {
      const db = await getMongoDb();
      const r = await db.collection(name).deleteOne(normalizeIdFilter(filter));
      return { deletedCount: r.deletedCount };
    },
    async deleteMany(filter) {
      const db = await getMongoDb();
      const r = await db.collection(name).deleteMany(normalizeIdFilter(filter));
      return { deletedCount: r.deletedCount };
    },
    async countDocuments(filter = {}) {
      const db = await getMongoDb();
      return db.collection(name).countDocuments(normalizeIdFilter(filter));
    },
  };
}

function normalizeIdFilter(filter: Filter): Filter {
  const out: Filter = { ...filter };
  if (typeof out._id === "string" && ObjectId.isValid(out._id)) {
    out._id = new ObjectId(out._id);
  }
  return out;
}
function normalizeOut<T>(doc: T | null): T | null {
  if (!doc) return null;
  const d = doc as unknown as { _id?: unknown };
  if (d._id && typeof d._id !== "string") {
    d._id = d._id.toString();
  }
  return doc;
}

/* ------------------- File-backed in-memory fallback -------------------- */

type Store = Record<string, Doc[]>;
const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "db.json");

let mem: Store | null = null;

function loadMem(): Store {
  if (mem) return mem;
  try {
    if (fs.existsSync(dataFile)) {
      mem = JSON.parse(fs.readFileSync(dataFile, "utf8")) as Store;
      return mem;
    }
  } catch {
    /* ignore */
  }
  mem = {};
  return mem;
}
function persist() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(mem ?? {}), "utf8");
  } catch {
    /* ignore in serverless read-only fs */
  }
}
function genId() {
  return (
    Date.now().toString(16) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 6)
  ).padEnd(24, "0").slice(0, 24);
}
function wrapMem<T extends Doc>(name: string): Collection<T> {
  const list = () => (loadMem()[name] ??= []) as T[];
  const applySort = (arr: T[], sort?: Record<string, 1 | -1>) => {
    if (!sort) return arr;
    const [k, dir] = Object.entries(sort)[0];
    return [...arr].sort((a, b) => {
      const av = (a as Record<string, unknown>)[k];
      const bv = (b as Record<string, unknown>)[k];
      if (av === bv) return 0;
      if (av === undefined || av === null) return 1;
      if (bv === undefined || bv === null) return -1;
      return (av < bv ? -1 : 1) * dir;
    });
  };
  return {
    async findOne(filter) {
      return list().find((d) => matches(d, filter)) ?? null;
    },
    find(filter = {}) {
      const build = (opts: { sort?: Record<string, 1 | -1>; limit?: number }) => ({
        async toArray() {
          let arr = list().filter((d) => matches(d, filter));
          arr = applySort(arr, opts.sort);
          if (opts.limit) arr = arr.slice(0, opts.limit);
          return arr;
        },
      });
      return {
        sort(spec) {
          return {
            limit(n: number) {
              return build({ sort: spec, limit: n });
            },
            toArray() {
              return build({ sort: spec }).toArray();
            },
          };
        },
        limit(n) {
          return build({ limit: n });
        },
        toArray() {
          return build({}).toArray();
        },
      };
    },
    async insertOne(doc) {
      const id = (doc._id as string | undefined) ?? genId();
      const stored = { ...doc, _id: id } as T;
      list().push(stored);
      persist();
      return { insertedId: id };
    },
    async insertMany(docs) {
      const ids: string[] = [];
      const l = list();
      for (const d of docs) {
        const id = (d._id as string | undefined) ?? genId();
        l.push({ ...d, _id: id } as T);
        ids.push(id);
      }
      persist();
      return { insertedIds: ids };
    },
    async updateOne(filter, update) {
      const l = list();
      const idx = l.findIndex((d) => matches(d, filter));
      if (idx === -1) return { matchedCount: 0 };
      l[idx] = { ...l[idx], ...(update.$set ?? {}) } as T;
      persist();
      return { matchedCount: 1 };
    },
    async deleteOne(filter) {
      const l = list();
      const idx = l.findIndex((d) => matches(d, filter));
      if (idx === -1) return { deletedCount: 0 };
      l.splice(idx, 1);
      persist();
      return { deletedCount: 1 };
    },
    async deleteMany(filter) {
      const l = list();
      const before = l.length;
      const kept = l.filter((d) => !matches(d, filter));
      loadMem()[name] = kept;
      persist();
      return { deletedCount: before - kept.length };
    },
    async countDocuments(filter = {}) {
      return list().filter((d) => matches(d, filter)).length;
    },
  };
}

/* ------------------------------ Public API ----------------------------- */

/** Returns whether the app is using real MongoDB (Atlas) or the fallback. */
export const usingMongo = Boolean(uri);

/** Get a typed collection handle. Works for both MongoDB and fallback. */
export function col<T extends Doc = Doc>(name: string): Collection<T> {
  return usingMongo ? wrapMongo<T>(name) : wrapMem<T>(name);
}

/** Ping the underlying store. Used by /api/health. */
export async function pingDb(): Promise<boolean> {
  try {
    if (usingMongo) {
      const db = await getMongoDb();
      await db.command({ ping: 1 });
    } else {
      loadMem();
    }
    return true;
  } catch {
    return false;
  }
}

export { ObjectId };
