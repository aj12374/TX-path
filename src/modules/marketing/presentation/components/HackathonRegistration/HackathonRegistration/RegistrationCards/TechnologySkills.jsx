import React from "react";
import { useState } from "react";
import FormCard from "./FormCard";

const skills = [
  "AI / GenAI", "Machine Learning", "Data Science / Analytics", "Web Development",
  "Mobile Development", "Cloud", "DevOps", "Cybersecurity", "IoT",
  "Blockchain / Web3", "Software Engineering", "UI / UX", "Robotics / Automation", "Other"
];

export default function TechnologySkills({ data, update, onNext, onBack }) {
  const selected = data.skills || [];
  const [showOther, setShowOther] = useState(selected.includes("Other"));

  const toggle = skill => {
    const next = selected.includes(skill) ? selected.filter(item => item !== skill) : [...selected, skill];
    update({ skills: next });
    setShowOther(next.includes("Other"));
  };

  return (
    <FormCard title="Technology & Skills" description="Select the domains and technologies you or your team can work with.">
      <div className="field">
        <label>Technology / Skill Domains</label>
        <div className="choiceGrid">
          {skills.map(skill => (
            <label className={`choiceCard compact ${selected.includes(skill) ? "selected" : ""}`} key={skill}>
              <input type="checkbox" checked={selected.includes(skill)} onChange={() => toggle(skill)} />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>
      {showOther && (
        <div className="field otherField">
          <label>Enter Other Technology / Skill</label>
          <input value={data.otherSkill || ""} placeholder="Enter technology or skill manually" onChange={e => update({ otherSkill: e.target.value })} />
        </div>
      )}
      <div className="formGrid topSpace">
        <div className="field">
          <label>Technologies / Programming Languages</label>
          <input value={data.technologies || ""} placeholder="Java, Python, React, SQL..." onChange={e => update({ technologies: e.target.value })} />
        </div>
        <div className="field">
          <label>Frameworks / Tools</label>
          <input value={data.frameworks || ""} placeholder="Spring Boot, React, Docker..." onChange={e => update({ frameworks: e.target.value })} />
        </div>
      </div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
