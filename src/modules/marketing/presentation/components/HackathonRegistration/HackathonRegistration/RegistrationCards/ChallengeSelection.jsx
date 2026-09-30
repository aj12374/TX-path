import React from "react";
import FormCard from "./FormCard";

const categories = ["Industry", "Institutional", "Open Innovation"];

export default function ChallengeSelection({ data, update, onNext, onBack }) {
  return (
    <FormCard title="Challenge Selection" description="Select the challenge category and your preferred challenge.">
      <div className="choiceGrid">
        {categories.map(category => (
          <label className={`choiceCard ${data.category === category ? "selected" : ""}`} key={category}>
            <input type="radio" name="category" checked={data.category === category} onChange={() => update({ category })} />
            <div>
              <strong>{category}</strong>
              <p>{category === "Industry" ? "Industry-defined problem statements." : category === "Institutional" ? "Challenges from participating institutions." : "Original solution around an open problem."}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="formGrid topSpace">
        <div className="field">
          <label>Preferred Challenge ID</label>
          <input value={data.challengeId || ""} placeholder="e.g. CH-014" onChange={e => update({ challengeId: e.target.value })} />
        </div>
        <div className="field">
          <label>Preferred Challenge Title</label>
          <input value={data.challengeTitle || ""} placeholder="Challenge title" onChange={e => update({ challengeTitle: e.target.value })} />
        </div>
      </div>
      <div className="notice warning">Final allocation is subject to organizer guidelines, availability, screening and event requirements.</div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
