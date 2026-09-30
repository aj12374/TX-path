import React from "react";
import FormCard from "./FormCard";

export default function Declaration({ data, update, onNext, onBack }) {
  return (
    <FormCard title="Declaration & Consent" description="Confirm the participation commitments and event documentation preference.">
      <div className="notice">
        I/We confirm that the information provided is accurate and complete. I/We agree to follow the official Hackathon Rules & Regulations, participate professionally, develop original or appropriately licensed work, respect intellectual property, data protection and cybersecurity policies, comply with permitted AI tools, APIs, libraries and datasets, meet submission deadlines, participate in presentations, demonstrations, evaluations and mentoring, and accept the decisions of the designated evaluation and judging panel according to the published framework.
      </div>
      <div className="choiceGrid">
        <label className={`choiceCard ${data.rulesAccepted ? "selected" : ""}`}>
          <input type="checkbox" checked={!!data.rulesAccepted} onChange={e => update({ rulesAccepted: e.target.checked })} />
          <span>I agree to the declaration and event rules.</span>
        </label>
        <label className={`choiceCard ${data.infoConfirmed ? "selected" : ""}`}>
          <input type="checkbox" checked={!!data.infoConfirmed} onChange={e => update({ infoConfirmed: e.target.checked })} />
          <span>I confirm my academic and contact information is accurate.</span>
        </label>
      </div>
      <div className="notice">
        <strong>Photography, Video & Event Documentation Consent:</strong>
        <div className="inlineOptions">
          {["I Agree", "I Do Not Agree"].map(option => (
            <label key={option}><input type="radio" name="consent" checked={data.consent === option} onChange={() => update({ consent: option })} /> {option}</label>
          ))}
        </div>
      </div>
      <div className="formGrid">
        {[
          ["name", "Participant / Team Leader Name", "Name"],
          ["date", "Date", ""],
          ["place", "Place", "Place"],
          ["signature", "Signature", "Signature"]
        ].map(([key, label, placeholder]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input type={key === "date" ? "date" : "text"} value={data[key] || ""} placeholder={placeholder} onChange={e => update({ [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" disabled={!data.rulesAccepted || !data.infoConfirmed || !data.consent} onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
