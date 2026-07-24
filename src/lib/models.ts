/** MongoDB document models used across the app. */

export type Role = "user" | "recruiter" | "admin";
export type Plan = "free" | "pro" | "team" | "enterprise";
export type AppStatus =
  | "saved"
  | "applied"
  | "interview"
  | "assessment"
  | "offer"
  | "rejected";

export interface UserDoc {
  _id?: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
  plan: Plan;
  emailVerified: boolean;
  mfaEnabled: boolean;
  apiKey: string;
  createdAt: string;
}

export interface CustomAnswer {
  q: string;
  a: string;
}

export interface ProfileDoc {
  _id?: string;
  userId: string;
  label: string;
  isDefault: boolean;
  headline?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  summary?: string | null;
  workAuth?: string | null;
  requiresSponsorship?: boolean | null;
  noticePeriod?: string | null;
  salaryExpectation?: string | null;
  willingToRelocate?: boolean | null;
  securityClearance?: string | null;
  veteranStatus?: string | null;
  disabilityStatus?: string | null;
  gender?: string | null;
  ethnicity?: string | null;
  experience?: Array<Record<string, unknown>>;
  education?: Array<Record<string, unknown>>;
  skills?: string[];
  certifications?: string[];
  languages?: string[];
  customAnswers?: CustomAnswer[];
  createdAt: string;
}

export interface ResumeDoc {
  _id?: string;
  userId: string;
  name: string;
  content: string;
  atsScore: number;
  keywords: string[];
  isDefault: boolean;
  createdAt: string;
}

export interface CoverLetterDoc {
  _id?: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface ApplicationDoc {
  _id?: string;
  userId: string;
  company: string;
  position: string;
  location?: string | null;
  url?: string | null;
  status: AppStatus;
  notes?: string | null;
  salary?: string | null;
  matchScore: number;
  createdAt: string;
}

export interface SavedAnswerDoc {
  _id?: string;
  userId: string;
  question: string;
  answer: string;
  fieldType?: string | null;
  domain?: string | null;
  confidence: number;
  createdAt: string;
}

export interface NotificationDoc {
  _id?: string;
  userId: string;
  title: string;
  body?: string | null;
  read: boolean;
  createdAt: string;
}

export interface AuditLogDoc {
  _id?: string;
  userId?: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}
