import React from "react";
import FormCard from "./FormCard";

const fields = [
  ["fullName", "Full Name", "text", "Full name"],
  ["gender", "Gender", "text", "Gender"],
  ["dateOfBirth", "Date of Birth", "date", ""],
  ["mobile", "Mobile Number", "tel", "Mobile"],
  ["alternateContact", "Emergency / Alternate Contact Number", "tel", "Alternate contact number"],
  ["email", "Email Address", "email", "Email"],
  ["college", "College / University", "text", "College / University"],
  ["department", "Department", "text", "Department"],
  ["course", "Course / Program", "text", "Course / Program"],
  ["year", "Year of Study", "text", "1st / 2nd / 3rd / 4th / PG"],
  ["studentId", "Student ID / Roll Number", "text", "Student ID"]
];

export default function StudentDetails({ data, update, onNext, onBack }) {
  return (
    <FormCard title="Student Details" description="Enter your individual participant information.">
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
