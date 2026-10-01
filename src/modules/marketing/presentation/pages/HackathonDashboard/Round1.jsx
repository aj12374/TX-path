import React, { useEffect, useMemo, useState } from "react";
import { getTeams } from "./HackethonApi";
import "./Round1.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getField = (team, fields) => {
  for (const field of fields) {
    if (
      team?.[field] !== undefined &&
      team?.[field] !== null
    ) {
      return team[field];
    }
  }

  return "";
};

const getRegistration = (team) =>
  getField(team, [
    "Registration ID",
    "Registration Number",
    "Registration No",
    "Reg No",
    "Participant Reg"
  ]);

const getTeamName = (team) =>
  getField(team, [
    "Team Name",
    "Team",
    "Project Title"
  ]);

const getLead = (team) =>
  getField(team, [
    "Team Lead",
    "Team Leader",
    "Team Lead Name",
    "Team Leader Name",
    "Lead Name",
    "Leader Name",
    "Full Name",
    "Participant Name",
    "Lead / Student Full Name"
  ]);

const getTechnology = (team) =>
  getField(team, [
    "Technologies",
    "Technology",
    "Tech Stack",
    "Tech",
    "Technologies / Languages",
    "Selected Tech Domains"
  ]);

function Round1() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [innovation, setInnovation] = useState("");
  const [technical, setTechnical] = useState("");
  const [presentation, setPresentation] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeams();

      setTeams(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load registration data."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    For the first Round 1 test,
    display all registrations.

    Later we will change this to:
    only teams whose attendance is Present.
  */
  const presentTeams = useMemo(() => {
    return teams;
  }, [teams]);

  const getEvaluation = (team) => {
    return (
      team.__round1 || {
        innovation: "",
        technical: "",
        presentation: "",
        total: "",
        comments: "",
        status: "PRESENTED"
      }
    );
  };

  const openEvaluation = (team) => {
    const evaluation = getEvaluation(team);

    setSelectedTeam(team);

    setInnovation(evaluation.innovation);
    setTechnical(evaluation.technical);
    setPresentation(evaluation.presentation);
    setComments(evaluation.comments);
  };

  const closeEvaluation = () => {
    setSelectedTeam(null);

    setInnovation("");
    setTechnical("");
    setPresentation("");
    setComments("");
  };

  const total =
    Number(innovation || 0) +
    Number(technical || 0) +
    Number(presentation || 0);

  const saveEvaluation = (status) => {
    if (
      innovation === "" ||
      technical === "" ||
      presentation === ""
    ) {
      alert("Please enter all three scores.");
      return;
    }

    const registrationId =
      getRegistration(selectedTeam);

    setTeams((currentTeams) =>
      currentTeams.map((team) => {
        if (
          getRegistration(team) !== registrationId
        ) {
          return team;
        }

        return {
          ...team,

          __round1: {
            innovation: Number(innovation),
            technical: Number(technical),
            presentation: Number(presentation),
            total,
            comments,
            status
          }
        };
      })
    );

    closeEvaluation();
  };

  const getScoreText = (team) => {
    const evaluation = getEvaluation(team);

    if (evaluation.innovation === "") {
      return (
        <span className="round1-not-scored">
          Not scored
        </span>
      );
    }

    return (
      <span className="round1-score">
        {evaluation.innovation}/
        {evaluation.technical}/
        {evaluation.presentation}{" "}
        ={" "}
        <strong>
          {evaluation.total}
        </strong>
      </span>
    );
  };

  const getStatus = (team) => {
    return getEvaluation(team).status;
  };

  if (loading) {
    return (
      <div className="round1-page">
        <div className="round1-loading">
          Loading Round 1...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="round1-page">
        <div className="round1-error">

          <h3>
            Unable to load Round 1
          </h3>

          <p>
            {error}
          </p>

          <button onClick={loadTeams}>
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="round1-page">

      <div className="round1-card">

        <div className="round1-header">

          <div>
            TEAM
          </div>

          <div>
            TECH
          </div>

          <div>
            SCORES (I/T/P)
          </div>

          <div>
            STATUS
          </div>

          <div>
            SCREENING
          </div>

        </div>

        {presentTeams.length === 0 ? (

          <div className="round1-empty">
            No teams available for Round 1.
          </div>

        ) : (

          presentTeams.map((team, index) => {

            const registrationId =
              getRegistration(team);

            const teamName =
              getTeamName(team) ||
              "Unnamed Team";

            const lead =
              getLead(team) ||
              "No team lead";

            const technology =
              getTechnology(team) ||
              "Not specified";

            const status =
              getStatus(team);

            const evaluation =
              getEvaluation(team);

            const hasScore =
              evaluation.innovation !== "";

            return (
              <div
                className="round1-row"
                key={
                  registrationId ||
                  `round1-team-${index}`
                }
              >

                <div className="round1-team">

                  <strong>
                    {teamName}
                  </strong>

                  <span>
                    {registrationId ||
                      "No registration ID"}{" "}
                    •{" "}
                    {lead}
                  </span>

                </div>

                <div className="round1-tech">
                  {technology}
                </div>

                <div className="round1-score-cell">
                  {getScoreText(team)}
                </div>

                <div>

                  <span
                    className={`round1-status ${normalize(
                      status
                    ).replace(
                      /\s+/g,
                      "-"
                    )}`}
                  >
                    {status}
                  </span>

                </div>

                <div className="round1-action">

                  <button
                    onClick={() =>
                      openEvaluation(team)
                    }
                    className={
                      hasScore
                        ? "round1-edit-button"
                        : "round1-setup-button"
                    }
                  >

                    {hasScore
                      ? "Edit Screening"
                      : "Evaluation Setup"}

                  </button>

                </div>

              </div>
            );
          })
        )}

      </div>

      {selectedTeam && (

        <div
          className="round1-modal-overlay"
          onClick={closeEvaluation}
        >

          <div
            className="round1-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="round1-modal-header">

              <div>

                <h2>
                  Round 1 Screening
                </h2>

                <p>
                  Evaluate the team and enter screening marks.
                </p>

              </div>

              <button
                className="round1-close"
                onClick={closeEvaluation}
              >
                ×
              </button>

            </div>

            <div className="round1-team-info">

              <div>

                <span>
                  Team
                </span>

                <strong>
                  {getTeamName(selectedTeam)}
                </strong>

              </div>

              <div>

                <span>
                  Registration
                </span>

                <strong>
                  {getRegistration(
                    selectedTeam
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Technology
                </span>

                <strong>
                  {getTechnology(
                    selectedTeam
                  )}
                </strong>

              </div>

            </div>

            <div className="round1-score-grid">

              <div className="round1-input-group">

                <label>
                  Innovation
                </label>

                <input
                  type="number"
                  min="0"
                  value={innovation}
                  onChange={(event) =>
                    setInnovation(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="round1-input-group">

                <label>
                  Technical
                </label>

                <input
                  type="number"
                  min="0"
                  value={technical}
                  onChange={(event) =>
                    setTechnical(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="round1-input-group">

                <label>
                  Presentation
                </label>

                <input
                  type="number"
                  min="0"
                  value={presentation}
                  onChange={(event) =>
                    setPresentation(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="round1-total">

              <span>
                Total Score
              </span>

              <strong>
                {total}
              </strong>

            </div>

            <div className="round1-input-group round1-comments">

              <label>
                Comments
              </label>

              <textarea
                value={comments}
                onChange={(event) =>
                  setComments(
                    event.target.value
                  )
                }
                placeholder="Enter evaluator comments..."
              />

            </div>

            <div className="round1-modal-actions">

              <button
                className="round1-eliminate-button"
                onClick={() =>
                  saveEvaluation(
                    "ELIMINATED"
                  )
                }
              >
                Not Qualify
              </button>

              <button
                className="round1-qualify-button"
                onClick={() =>
                  saveEvaluation(
                    "R1 QUALIFIED"
                  )
                }
              >
                Qualify
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Round1;