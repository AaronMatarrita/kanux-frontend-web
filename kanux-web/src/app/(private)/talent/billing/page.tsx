import TalentBilling from '@/components/billing/talentBilling'

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1f3a]">Plans & Subscription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose the plan that fits your career goals.
        </p>
      </div>
      <TalentBilling />
    </div>
  );
}
