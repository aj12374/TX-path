import React from "react";
import FormCard from "./FormCard";

export default function Experience({ data, update, onNext, onBack }) {
  return (
    <FormCard title="Previous Experience" description="Tell us about previous hackathons and projects.">
      <div className="formGrid">
        <div className="field"><label>Participated in a Hackathon Before?</label><input value={data.hackathonBefore || ""} placeholder="Yes / No" onChange={e => update({ hackathonBefore: e.target.value })} /></div>
        <div className="field"><label>Number of Hackathons Participated</label><input type="number" value={data.hackathonCount || ""} placeholder="0" onChange={e => update({ hackathonCount: e.target.value })} /></div>
        <div className="field full"><label>Previous Hackathon / Project Experience</label><textarea value={data.previousExperience || ""} placeholder="Brief experience" onChange={e => update({ previousExperience: e.target.value })} /></div>
        <div className="field"><label>Have you Developed Projects Previously?</label><input value={data.developedProjects || ""} placeholder="Yes / No" onChange={e => update({ developedProjects: e.target.value })} /></div>
        <div className="field"><label>Portfolio / GitHub / LinkedIn / Project URL</label><input type="url" value={data.portfolio || ""} placeholder="https://..." onChange={e => update({ portfolio: e.target.value })} /></div>
        <div className="field full"><label>If Yes, Briefly Describe</label><textarea value={data.projectDescription || ""} placeholder="Project description" onChange={e => update({ projectDescription: e.target.value })} /></div>
      </div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
