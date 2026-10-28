import { plans } from "../utils/data";
import { requireAccountSession } from "../utils/accountSession";
import { Avatar } from "@mantine/core";
import { green } from "@/theme/colors";

export default function ProfilePage() {
  const profile = requireAccountSession();
  const currentPlan =
    plans.find((plan) => plan.id === profile.plan) ?? plans[0];

  return (
    <section aria-labelledby="profile-title" className="space-y-2">
      <div className="border-b border-line py-5">
        <h1 id="profile-title" className="text-xl font-semibold">
          个人资料
        </h1>
      </div>
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-6">
          <Avatar src={null} color={green.middleLight} size="lg">
            {profile.userName.slice(0, 1)}
          </Avatar>
          <h2 className="text-lg font-semibold">{profile.userName}</h2>
        </div>
        <dl className="space-y-1">
          <ProfileField label="姓名">{profile.name}</ProfileField>
          <ProfileField label="邮箱">{profile.email}</ProfileField>
          <ProfileField label="手机">{profile.phone}</ProfileField>
          <ProfileField label="当前套餐">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sage" />
              {currentPlan.name}
            </span>
          </ProfileField>
        </dl>
      </div>
    </section>
  );
}

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_minmax(0,5fr)] items-center gap-3 border-b border-line py-4 last:border-b-0">
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="max-w-xl truncate text-sm">{children}</dd>
    </div>
  );
}
