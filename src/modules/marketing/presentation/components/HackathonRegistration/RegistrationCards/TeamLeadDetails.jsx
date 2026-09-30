import React, { useState } from "react";
import FormCard from "./FormCard";
import { validateEmail, validateMobile, validateOptionalMobile, validateRequired } from "../validationHelpers";

const fields = [
  ["fullName", "Full Name", "text", "Team lead name"],
  ["gender", "Gender", "select", "Select gender", ["Male", "Female", "Other", "Prefer not to say"]],
  ["dateOfBirth", "Date of Birth", "date", ""],
  ["mobile", "Mobile Number", "tel", "10-digit mobile"],
  ["alternateContact", "Emergency / Alternate Contact Number", "tel", "Alternate contact number"],
  ["email", "Email Address", "email", "name@example.com"],
  ["college", "College / University", "text", "Institution"],
  ["department", "Department", "text", "Department"],
  ["course", "Course / Program", "text", "Program"],
  ["year", "Year of Study", "select", "Select year of study", ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate (PG)"]],
  ["studentId", "Student ID / Roll Number", "text", "Student ID"]
];

export default function TeamLeadDetails({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!data.fullName?.trim()) errs.fullName = "Full name is required";
    if (!data.gender?.trim()) errs.gender = "Please select gender";
    if (!data.dateOfBirth?.trim()) errs.dateOfBirth = "Date of birth is required";
    
    const mobileErr = validateMobile(data.mobile, "Mobile number");
    if (mobileErr) errs.mobile = mobileErr;

    const altErr = validateOptionalMobile(data.alternateContact, "Alternate contact");
    if (altErr) errs.alternateContact = altErr;

    const emailErr = validateEmail(data.email);
    if (emailErr) errs.email = emailErr;

    if (!data.college?.trim()) errs.college = "College / University is required";
    if (!data.department?.trim()) errs.department = "Department is required";
    if (!data.course?.trim()) errs.course = "Course / Program is required";
    if (!data.year?.trim()) errs.year = "Please select year of study";
    if (!data.studentId?.trim()) errs.studentId = "Student ID / Roll Number is required";

    return errs;
  };

  const handleChange = (key, value) => {
    update({ [key]: value });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleNext = () => {
    setAttempted(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const hasErrors = attempted && Object.keys(errors).some(k => errors[k]);

  return (
    <FormCard title="Team Lead Details" description="Enter the primary participant responsible for the team registration.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please correct the highlighted fields before proceeding.
        </div>
      )}

      <div className="formGrid">
        {fields.map(([key, label, type, placeholder, options]) => {
          const fieldError = errors[key];
          return (
            <div className={`field ${fieldError ? "hasError" : ""}`} key={key}>
              <label>{label} *</label>
              {type === "select" ? (
                <select
                  value={data[key] || ""}
                  onChange={e => handleChange(key, e.target.value)}
                >
                  <option value="">{placeholder}</option>
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={data[key] || ""}
                  placeholder={placeholder}
                  onChange={e => handleChange(key, e.target.value)}
                />
              )}
              {fieldError && <span className="errorText">⚠️ {fieldError}</span>}
            </div>
          );
        })}
      </div>

      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
