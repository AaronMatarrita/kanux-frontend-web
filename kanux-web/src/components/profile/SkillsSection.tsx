import { SkillBadge } from "./SkillBadge";

export function SkillsSection({ title, skills }: { 
  title: string; 
  skills: string[] 
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillBadge key={index} skill={skill} />
        ))}
      </div>
    </div>
  );
}
