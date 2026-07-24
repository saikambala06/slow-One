import { requireUser } from "@/lib/auth";
import { col } from "@/lib/db";
import type { ProfileDoc } from "@/lib/models";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = (await requireUser())!;
  const profile = await col<ProfileDoc>("profiles").findOne({ userId: user._id, isDefault: true });

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold">Profile builder</h1>
        <p className="text-slate-400 text-sm">
          The richer your profile, the higher the autofill confidence. Everything is encrypted at rest.
        </p>
      </div>
      <ProfileForm
        initial={{
          fullName: user.fullName,
          email: user.email,
          headline: profile?.headline ?? "",
          phone: profile?.phone ?? "",
          location: profile?.location ?? "",
          linkedin: profile?.linkedin ?? "",
          github: profile?.github ?? "",
          website: profile?.website ?? "",
          summary: profile?.summary ?? "",
          workAuth: profile?.workAuth ?? "",
          requiresSponsorship: !!profile?.requiresSponsorship,
          noticePeriod: profile?.noticePeriod ?? "",
          salaryExpectation: profile?.salaryExpectation ?? "",
          willingToRelocate: !!profile?.willingToRelocate,
          securityClearance: profile?.securityClearance ?? "",
          veteranStatus: profile?.veteranStatus ?? "",
          disabilityStatus: profile?.disabilityStatus ?? "",
          gender: profile?.gender ?? "",
          ethnicity: profile?.ethnicity ?? "",
          skills: profile?.skills ?? [],
          certifications: profile?.certifications ?? [],
          languages: profile?.languages ?? [],
          customAnswers: profile?.customAnswers ?? [],
        }}
      />
    </div>
  );
}
