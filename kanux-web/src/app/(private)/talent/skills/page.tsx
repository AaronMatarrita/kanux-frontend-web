import  SkillsPage  from '@/components/skills/SkillPage'
export default function Page() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1f3a]">Skills</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and validate your technical and soft skills.
        </p>
      </div>
      <SkillsPage/>
    </div>
  );
}

