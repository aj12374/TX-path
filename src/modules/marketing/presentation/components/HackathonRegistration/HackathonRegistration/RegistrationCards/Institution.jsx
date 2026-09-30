import React from "react";
import FormCard from "./FormCard";

export default function Institution({ data, update, onNext, onBack }) {
  return (
    <FormCard title="Faculty / Institutional Information" description="Provide coordinator and approval details.">
      <div className="formGrid">
        {[
          ["coordinatorName", "Faculty Coordinator Name", "Coordinator name"],
          ["designation", "Designation", "Designation"],
          ["department", "Department", "Department"],
          ["officialEmail", "Official Email", "official@college.edu"],
          ["contactNumber", "Contact Number", "Contact number"]
        ].map(([key, label, placeholder]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input value={data[key] || ""} placeholder={placeholder} onChange={e => update({ [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="notice">
        <strong>Institutional Approval / Recommendation:</strong>
        <div className="inlineOptions">
          {["Yes", "No", "Not Applicable"].map(option => (
            <label key={option}><input type="radio" name="approval" checked={data.approval === option} onChange={() => update({ approval: option })} /> {option}</label>
          ))}
        </div>
      </div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
