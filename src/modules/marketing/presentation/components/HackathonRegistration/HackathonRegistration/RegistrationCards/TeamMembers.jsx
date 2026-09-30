import React from "react";
import FormCard from "./FormCard";

const blankMember = () => ({
  name: "",
  email: "",
  mobile: "",
  alternateContact: "",
  college: "",
  department: "",
  year: "",
  studentId: "",
  skills: ""
});

export default function TeamMembers({ data, update, onNext, onBack }) {
  const members = data.members || [blankMember()];
  const setMembers = next => update({ members: next });

  const updateMember = (index, key, value) => {
    const next = members.map((member, i) => i === index ? { ...member, [key]: value } : member);
    setMembers(next);
  };

  return (
    <FormCard title="Team Members Details" description="Add the participating members. The first member is the team leader.">
      {members.map((member, index) => (
        <div className="memberCard" key={index}>
          <div className="memberHeader">
            <div>
              <strong>Team Member {index + 1}</strong>
              {index === 0 && <span className="pill">Team Leader</span>}
            </div>
            {index > 0 && (
              <button
                type="button"
                className="removeButton"
                onClick={() => setMembers(members.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            )}
          </div>
          <div className="formGrid">
            {[
              ["name", "Name", "text", "Full name"],
              ["email", "Email", "email", "Email"],
              ["mobile", "Mobile Number", "tel", "Mobile"],
              ["alternateContact", "Emergency / Alternate Contact Number", "tel", "Alternate contact number"],
              ["college", "College / University", "text", "College / University"],
              ["department", "Department", "text", "Department"],
              ["year", "Year", "text", "Year"],
              ["studentId", "Student ID / Roll Number", "text", "Student ID"],
              ["skills", "Primary Skills", "text", "Java, React, AI..."]
            ].map(([key, label, type, placeholder]) => (
              <div className="field" key={key}>
                <label>{label}</label>
                <input type={type} value={member[key] || ""} placeholder={placeholder} onChange={e => updateMember(index, key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="button secondary addMember"
        disabled={members.length >= 6}
        onClick={() => setMembers([...members, blankMember()])}
      >
        + Add Team Member
      </button>
      <div className="notice">Up to 6 participants can be represented. Team members include emergency / alternate contact details.</div>
      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={onNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
