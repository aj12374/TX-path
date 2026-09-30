import React from "react";
import FormCard from "./FormCard";

export default function ProjectIdea({ data, update, onNext, onBack }) {
  const fields = [
    ["title", "Project / Solution Title", "Project title"],
    ["beneficiaries", "Target Users / Beneficiaries", "Who will use it?"],
    ["problem", "Problem You Intend to Solve", "Problem statement"],
    ["solution", "Proposed Solution – Brief Description", "Brief solution"],
    ["outcome", "Expected Outcome", "Expected result"],
    ["stack", "Proposed Technology Stack", "Technology stack"]
  ];
  return (
    <FormCard title="Project Idea" description="Capture the initial solution concept. It can be refined during the hackathon.">
      <div className="formGrid">
        {fields.map(([key, label, placeholder]) => (
          <div className="field full" key={key}>
            <label>{label}</label>
            <textarea value={data[key] || ""} placeholder={placeholder} onChange={e => update({ [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
