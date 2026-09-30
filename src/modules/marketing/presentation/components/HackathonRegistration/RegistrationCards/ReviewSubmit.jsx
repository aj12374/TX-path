import FormCard from "./FormCard";

function value(value) {
  if (value === undefined || value === null || value === "") return "Not provided";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function Row({ label, value: item }) {
  return <div className="reviewRow"><span>{label}</span><strong>{value(item)}</strong></div>;
}

export default function ReviewSubmit({ data, sectionIndexes, onBack, onSubmit, onEdit, isSubmitting, submitError }) {
  return (
    <FormCard title="Review & Submit" description="Every section below shows the information currently entered in the form.">
      <div className="reviewSection">
        <div className="reviewHeading"><h3>Registration Type</h3><button className="linkButton" onClick={() => onEdit(sectionIndexes.type)}>Edit</button></div>
        <Row label="Participant Type" value={data.participantType === "team" ? "Team Registration" : "Individual Participant"} />
      </div>

      {data.participantType === "team" && (
        <>
          <div className="reviewSection">
            <div className="reviewHeading"><h3>Team Lead Details</h3><button className="linkButton" onClick={() => onEdit(sectionIndexes.lead)}>Edit</button></div>
            <Row label="Full Name" value={data.lead.fullName} />
            <Row label="Gender" value={data.lead.gender} />
            <Row label="Date of Birth" value={data.lead.dateOfBirth} />
            <Row label="Mobile Number" value={data.lead.mobile} />
            <Row label="Emergency / Alternate Contact" value={data.lead.alternateContact} />
            <Row label="Email" value={data.lead.email} />
            <Row label="College / University" value={data.lead.college} />
            <Row label="Department" value={data.lead.department} />
            <Row label="Course / Program" value={data.lead.course} />
            <Row label="Year" value={data.lead.year} />
            <Row label="Student ID" value={data.lead.studentId} />
          </div>
          <div className="reviewSection">
            <div className="reviewHeading"><h3>Team Members</h3><button className="linkButton" onClick={() => onEdit(sectionIndexes.members)}>Edit</button></div>
            {(data.members || []).map((member, index) => (
              <div className="memberReview" key={index}>
                <strong>Member {index + 1}</strong>
                <Row label="Name" value={member.name} />
                <Row label="Email" value={member.email} />
                <Row label="Mobile" value={member.mobile} />
                <Row label="Emergency / Alternate Contact" value={member.alternateContact} />
                <Row label="College" value={member.college} />
                <Row label="Department" value={member.department} />
                <Row label="Year" value={member.year} />
                <Row label="Student ID" value={member.studentId} />
                <Row label="Primary Skills" value={member.skills} />
              </div>
            ))}
          </div>
        </>
      )}

      {data.participantType === "individual" && (
        <div className="reviewSection">
          <div className="reviewHeading"><h3>Student Details</h3><button className="linkButton" onClick={() => onEdit(sectionIndexes.lead)}>Edit</button></div>
          <Row label="Full Name" value={data.student.fullName} />
          <Row label="Gender" value={data.student.gender} />
          <Row label="Date of Birth" value={data.student.dateOfBirth} />
          <Row label="Mobile Number" value={data.student.mobile} />
          <Row label="Emergency / Alternate Contact" value={data.student.alternateContact} />
          <Row label="Email" value={data.student.email} />
          <Row label="College / University" value={data.student.college} />
          <Row label="Department" value={data.student.department} />
          <Row label="Course / Program" value={data.student.course} />
          <Row label="Year" value={data.student.year} />
          <Row label="Student ID" value={data.student.studentId} />
        </div>
      )}

      {[
        ["Technology & Skills", data.technology, sectionIndexes.technology],
        ["Challenge Selection", data.challenge, sectionIndexes.challenge],
        ["Project Idea", data.idea, sectionIndexes.idea],
        ["Previous Experience", data.experience, sectionIndexes.experience],
        ["Institution", data.institution, sectionIndexes.institution],
        ["Declaration & Consent", data.declaration, sectionIndexes.declaration]
      ].map(([title, section, index]) => (
        <div className="reviewSection" key={title}>
          <div className="reviewHeading"><h3>{title}</h3><button className="linkButton" onClick={() => onEdit(index)}>Edit</button></div>
          {Object.entries(section || {}).map(([key, item]) => (
            <Row key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())} value={item} />
          ))}
        </div>
      ))}

      <div className="notice">Please verify all entered information before submitting. After submission, the registration is ready for organizer verification and eligibility review.</div>
      {submitError && <div className="formErrorMessage" role="alert">{submitError}</div>}
      <div className="formActions">
        <button className="button secondary" onClick={onBack} disabled={isSubmitting}>← Back</button>
        <button className="button primary" onClick={onSubmit} disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Registration ✓"}
        </button>
      </div>
    </FormCard>
  );
}
