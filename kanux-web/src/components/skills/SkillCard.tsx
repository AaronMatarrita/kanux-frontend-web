"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillCardProps {
  category: string;
  skills: { name: string; progress: number }[];
}

export function SkillCard({ category, skills = [] }: SkillCardProps) {
  if (skills.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-foreground">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {skills.map((skill, index) => (
            <div key={`${skill.name}-${index}`} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {skill.name}
                </span>
                <span className="text-sm font-semibold text-muted-foreground ml-2">
                  {skill.progress}%
                </span>
              </div>

              <div className="w-full h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-1000 ease-out"
                  style={{
                    width: `${skill.progress}%`,
                    animation: `progressLoad 1.5s ease-out ${index * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
