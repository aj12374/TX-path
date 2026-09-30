import React from "react";
import FormCard from "./FormCard";

const fields = [
  ["fullName", "Full Name", "text", "Team lead name"],
  ["gender", "Gender", "text", "Male / Female / Other / Prefer not to say"],
  ["dateOfBirth", "Date of Birth", "date", ""],
  ["mobile", "Mobile Number", "tel", "10-digit mobile"],
  ["alternateContact", "Emergency / Alternate Contact Number", "tel", "Alternate contact number"],
  ["email", "Email Address", "email", "name@example.com"],
  ["college", "College / University", "text", "Institution"],
  ["department", "Department", "text", "Department"],
  ["course", "Course / Program", "text", "Program"],
  ["year", "Year of Study", "text", "1st / 2nd / 3rd / 4th / PG"],
  ["studentId", "Student ID / Roll Number", "text", "Student ID"]
];

export default function TeamLeadDetails({ data, update, onNext, onBack }) {
  return (
    <FormCard title="Team Lead Details" description="Enter the primary participant responsible for the team registration.">
      <div className="formGrid">
        {fields.map(([key, label, type, placeholder]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input type={type} value={data[key] || ""} placeholder={placeholder} onChange={e => update({ [key]: e.target.value })} />
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
