import React, { useState } from "react";
import FormCard from "./FormCard";
import { validateEmail, validateMobile } from "../validationHelpers";

export default function Institution({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!data.coordinatorName?.trim()) errs.coordinatorName = "Faculty Coordinator Name is required.";
    if (!data.designation?.trim()) errs.designation = "Designation is required.";
    if (!data.department?.trim()) errs.department = "Department is required.";
    
    const emailErr = validateEmail(data.officialEmail);
    if (emailErr) errs.officialEmail = emailErr;

    const mobileErr = validateMobile(data.contactNumber, "Contact number");
    if (mobileErr) errs.contactNumber = mobileErr;

    if (!data.approval) errs.approval = "Please select institutional approval option.";

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
    <FormCard title="Faculty / Institutional Information" description="Provide coordinator and approval details.">
      {hasErrors && (
        <div className="formErrorMessage">
          ⚠️ Please fill in all required institutional details.
        </div>
      )}

      <div className="formGrid">
        {[
          ["coordinatorName", "Faculty Coordinator Name *", "Coordinator name"],
          ["designation", "Designation *", "Designation"],
          ["department", "Department *", "Department"],
          ["officialEmail", "Official Email *", "official@college.edu"],
          ["contactNumber", "Contact Number *", "10-digit contact number"]
        ].map(([key, label, placeholder]) => {
          const fieldError = errors[key];
          return (
            <div className={`field ${fieldError ? "hasError" : ""}`} key={key}>
              <label>{label}</label>
              <input
                type={key.includes("Email") ? "email" : key.includes("Number") ? "tel" : "text"}
                value={data[key] || ""}
                placeholder={placeholder}
                onChange={e => handleChange(key, e.target.value)}
              />
              {fieldError && <span className="errorText">⚠️ {fieldError}</span>}
            </div>
          );
        })}
      </div>

      <div className={`notice ${errors.approval ? "warning" : ""}`}>
        <strong>Institutional Approval / Recommendation: *</strong>
        <div className="inlineOptions">
          {["Yes", "No", "Not Applicable"].map(option => (
            <label key={option}>
              <input
                type="radio"
                name="approval"
                checked={data.approval === option}
                onChange={() => handleChange("approval", option)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
        {errors.approval && <span className="errorText" style={{ display: "block", marginTop: "6px" }}>⚠️ {errors.approval}</span>}
      </div>

      <div className="formActions">
        <button className="button secondary" onClick={onBack}>← Back</button>
        <button className="button primary" onClick={handleNext}>Save & Continue →</button>
      </div>
    </FormCard>
  );
}
