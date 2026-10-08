import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  Clock3,
  Search,
  School,
  FileText,
  UserCheck
} from "lucide-react";
import {
  getTeams,
  updateAttendance,
  getRegistrationId,
  getTeamName,
  getTeamLead,
  getTeamLeadDetails,
  getTeamMembersDetails,
  getCollege,
  getProjectTitle,
  getAttendance,
  isTeamVerified,
  normalize
} from "./HackethonApi";
import "./Teams.css";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load teams from Google Sheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();

    const handleUpdate = () => {
      loadTeams();
    };

    window.addEventListener("registrationUpdated", handleUpdate);

    return () => {
      window.removeEventListener("registrationUpdated", handleUpdate);
    };
  }, []);

  const handleAttendance = async (team, status) => {
    const registrationId = getRegistrationId(team);

    if (!registrationId) {
      alert("Registration ID not found for this team.");
      return;
    }

    try {
      setSavingId(registrationId);
      setNotification("");

      const verified = status === "Present" ? "Yes" : "No";

      await updateAttendance(
        registrationId,
        status,
        verified
      );

      await loadTeams();

      window.dispatchEvent(
        new Event("attendanceUpdated")
      );

      setNotification(
        `Team ${registrationId} marked as ${status} successfully.`
      );

      setTimeout(() => {
        setNotification("");
      }, 4000);
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          `Unable to update attendance to ${status}.`
      );
    } finally {
      setSavingId("");
    }
  };

  const getLeadNameOnly = (team) => {
    const lead = getTeamLead(team);

    if (!lead) {
      return "—";
    }

    if (typeof lead === "object" && lead !== null) {
      return (
        lead.fullName ||
        lead.name ||
        lead.student_fullName ||
        "—"
      );
    }

    if (typeof lead === "string") {
      const text = lead.trim();

      try {
        const parsed = JSON.parse(text);

        return (
          parsed?.fullName ||
          parsed?.name ||
          parsed?.student_fullName ||
          "—"
        );
      } catch {
        const match = text.match(
          /["']?(?:name|fullName|student_fullName)["']?\s*:\s*["']?([^"|,\n}]+)["']?/i
        );

        return match?.[1]?.trim() || text;
      }
    }

    return "—";
  };

  const getMemberCount = (team) => {
    const members = getTeamMembersDetails(team);

    if (!members) {
      return 0;
    }

    if (Array.isArray(members)) {
      return members.length;
    }

    if (typeof members === "object") {
      if (Array.isArray(members.members)) {
        return members.members.length;
      }

      return Object.keys(members).length;
    }

    if (typeof members === "string") {
      const text = members.trim();

      if (!text) {
        return 0;
      }

      try {
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          return parsed.length;
        }

        if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.members)) {
            return parsed.members.length;
          }

          return Object.keys(parsed).length;
        }
      } catch {
        const nameMatches = text.match(
          /(?:name|fullName|student_fullName)\s*:/gi
        );

        if (nameMatches) {
          return nameMatches.length;
        }

        const lines = text
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length > 1) {
          return lines.length;
        }
      }
    }

    return 0;
  };

  const filteredTeams = teams.filter((team) => {
    const regId = getRegistrationId(team);
    const teamName = getTeamName(team);
    const lead = getLeadNameOnly(team);
    const college = getCollege(team);
    const attendance = getAttendance(team);

    if (
      filter === "present" &&
      attendance !== "Present"
    ) {
      return false;
    }

    if (
      filter === "absent" &&
      attendance !== "Absent"
    ) {
      return false;
    }

    if (
      filter === "pending" &&
      attendance !== "Pending"
    ) {
      return false;
    }

    if (!search.trim()) {
      return true;
    }

    const query = search.toLowerCase();

    return (
      String(regId || "")
        .toLowerCase()
        .includes(query) ||
      String(teamName || "")
        .toLowerCase()
        .includes(query) ||
      String(lead || "")
        .toLowerCase()
        .includes(query) ||
      String(college || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const totalCount = teams.length;

  const presentCount = teams.filter(
    (t) => getAttendance(t) === "Present"
  ).length;

  const absentCount = teams.filter(
    (t) => getAttendance(t) === "Absent"
  ).length;

  const pendingCount = teams.filter(
    (t) => getAttendance(t) === "Pending"
  ).length;

  if (loading) {
    return (
      <div className="teams-page">
        <div className="teams-loading">
          <RefreshCw
            className="teams-spin"
            size={32}
          />
          <h3>Loading Team Verification</h3>
          <p>
            Fetching registrations from Google Sheets...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teams-page">
        <div className="teams-error">
          <XCircle size={45} color="#dc2626" />
          <h2>Unable to load teams</h2>
          <p>{error}</p>

          <button onClick={loadTeams}>
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="teams-header">
        <div>
          <p
            style={{
              margin: "0 0 6px 10px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "1px"
            }}
          >
            COORDINATOR PORTAL
          </p>

          <h1>Team Verification & Attendance</h1>

          <p
            style={{
              margin: "4px 0 0 10px",
              fontSize: "14px",
              color: "#64748b"
            }}
          >
            Search teams and mark attendance. Marking
            Present qualifies the team for Round 1.
          </p>
        </div>

        <button
          className="export-btn"
          onClick={loadTeams}
          title="Refresh latest data"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {notification && (
        <div
          style={{
            margin: "0 10px 16px",
            padding: "10px 16px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "8px",
            color: "#065f46",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          ✓ {notification}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          margin: "0 10px 20px"
        }}
      >
        <div
          onClick={() => setFilter("all")}
          style={{
            padding: "16px",
            background:
              filter === "all" ? "#f1f5f9" : "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#2563eb"
            }}
          >
            <Users size={20} />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b"
              }}
            >
              Total Teams
            </span>
          </div>

          <strong
            style={{
              fontSize: "24px",
              color: "#1e293b",
              marginTop: "6px",
              display: "block"
            }}
          >
            {totalCount}
          </strong>
        </div>

        <div
          onClick={() => setFilter("present")}
          style={{
            padding: "16px",
            background:
              filter === "present" ? "#ecfdf5" : "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#16a34a"
            }}
          >
            <CheckCircle2 size={20} />

            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b"
              }}
            >
              Present
            </span>
          </div>

          <strong
            style={{
              fontSize: "24px",
              color: "#16a34a",
              marginTop: "6px",
              display: "block"
            }}
          >
            {presentCount}
          </strong>
        </div>

        <div
          onClick={() => setFilter("absent")}
          style={{
            padding: "16px",
            background:
              filter === "absent" ? "#fef2f2" : "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#dc2626"
            }}
          >
            <XCircle size={20} />

            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b"
              }}
            >
              Absent
            </span>
          </div>

          <strong
            style={{
              fontSize: "24px",
              color: "#dc2626",
              marginTop: "6px",
              display: "block"
            }}
          >
            {absentCount}
          </strong>
        </div>

        <div
          onClick={() => setFilter("pending")}
          style={{
            padding: "16px",
            background:
              filter === "pending" ? "#fffbeb" : "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#d97706"
            }}
          >
            <Clock3 size={20} />

            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b"
              }}
            >
              Pending Verification
            </span>
          </div>

          <strong
            style={{
              fontSize: "24px",
              color: "#d97706",
              marginTop: "6px",
              display: "block"
            }}
          >
            {pendingCount}
          </strong>
        </div>
      </div>

      <div
        style={{
          margin: "0 10px 20px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: "280px"
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8"
            }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by Registration ID, Team Name, Lead, or College..."
            style={{
              width: "100%",
              padding: "11px 14px 11px 40px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div
          className="teams-filters"
          style={{ margin: 0 }}
        >
          <button
            className={`teams-filter ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All ({totalCount})
          </button>

          <button
            className={`teams-filter ${
              filter === "present" ? "active" : ""
            }`}
            onClick={() => setFilter("present")}
          >
            Present ({presentCount})
          </button>

          <button
            className={`teams-filter ${
              filter === "absent" ? "active" : ""
            }`}
            onClick={() => setFilter("absent")}
          >
            Absent ({absentCount})
          </button>

          <button
            className={`teams-filter ${
              filter === "pending" ? "active" : ""
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="teams-empty">
          <Users size={50} />
          <h3>No teams found</h3>

          <p>
            {search
              ? "No registrations match your search filter."
              : "No registered teams found in Google Sheets."}
          </p>
        </div>
      ) : (
        <div className="teams-table-card">
          <div className="teams-table-wrapper">
            <table className="teams-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Registration ID</th>
                  <th>Team Lead Name</th>
                  <th>Team Members</th>
                  <th>College / Organization</th>
                  <th>Project Name</th>
                  <th>Attendance</th>
                  <th>Verified</th>
                  <th style={{ textAlign: "center" }}>
                    Mark Attendance
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTeams.map((team, index) => {
                  const regId =
                    getRegistrationId(team) ||
                    `REG-${index + 1}`;

                  const leadName =
                    getLeadNameOnly(team);

                  const memberCount =
                    getMemberCount(team);

                  const college =
                    getCollege(team);

                  const project =
                    getProjectTitle(team);

                  const attendance =
                    getAttendance(team);

                  const verified =
                    isTeamVerified(team);

                  const isSaving =
                    savingId === regId;

                  return (
                    <tr key={regId || index}>
                      <td>{index + 1}</td>

                      <td>
                        <span className="registration">
                          {regId}
                        </span>
                      </td>

                      <td>
                        <strong
                          style={{
                            color: "#1e293b",
                            fontSize: "13px"
                          }}
                        >
                          {leadName}
                        </strong>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#475569"
                          }}
                        >
                          {memberCount}{" "}
                          {memberCount === 1
                            ? "Member"
                            : "Members"}
                        </span>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <School
                            size={14}
                            color="#64748b"
                          />

                          <span>{college}</span>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            maxWidth: "200px"
                          }}
                        >
                          <FileText
                            size={14}
                            color="#64748b"
                          />

                          <span
                            style={{
                              fontSize: "13px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {project}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`team-status status-${normalize(
                            attendance
                          )}`}
                        >
                          {attendance ===
                            "Present" && (
                            <CheckCircle2 size={13} />
                          )}

                          {attendance ===
                            "Absent" && (
                            <XCircle size={13} />
                          )}

                          {attendance ===
                            "Pending" && (
                            <Clock3 size={13} />
                          )}

                          {attendance}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color:
                              verified === "Yes"
                                ? "#16a34a"
                                : "#94a3b8"
                          }}
                        >
                          {verified === "Yes"
                            ? "✓ Yes"
                            : "No"}
                        </span>
                      </td>

                      <td>
                        <div
                          className="attendance-actions"
                          style={{
                            justifyContent: "center"
                          }}
                        >
                          <button
                            className={`attendance-btn present-btn ${
                              attendance ===
                              "Present"
                                ? "selected"
                                : ""
                            }`}
                            disabled={isSaving}
                            onClick={() =>
                              handleAttendance(
                                team,
                                "Present"
                              )
                            }
                            style={{
                              background:
                                attendance ===
                                "Present"
                                  ? "#16a34a"
                                  : "#fff",
                              color:
                                attendance ===
                                "Present"
                                  ? "#fff"
                                  : "#16a34a",
                              borderColor: "#16a34a",
                              cursor: isSaving
                                ? "not-allowed"
                                : "pointer",
                              opacity: isSaving
                                ? 0.6
                                : 1
                            }}
                          >
                            <CheckCircle2
                              size={15}
                            />

                            {isSaving
                              ? "Saving..."
                              : "PRESENT"}
                          </button>

                          <button
                            className={`attendance-btn absent-btn ${
                              attendance ===
                              "Absent"
                                ? "selected"
                                : ""
                            }`}
                            disabled={isSaving}
                            onClick={() =>
                              handleAttendance(
                                team,
                                "Absent"
                              )
                            }
                            style={{
                              background:
                                attendance ===
                                "Absent"
                                  ? "#dc2626"
                                  : "#fff",
                              color:
                                attendance ===
                                "Absent"
                                  ? "#fff"
                                  : "#dc2626",
                              borderColor: "#dc2626",
                              cursor: isSaving
                                ? "not-allowed"
                                : "pointer",
                              opacity: isSaving
                                ? 0.6
                                : 1
                            }}
                          >
                            <XCircle size={15} />

                            {isSaving
                              ? "Saving..."
                              : "ABSENT"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTeam(team)
                            }
                            title="Verify Full Team Details"
                            style={{
                              padding: "6px 10px",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #cbd5e1",
                              borderRadius: "8px",
                              color: "#475569",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <UserCheck
                              size={14}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTeam && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={() =>
            setSelectedTeam(null)
          }
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                marginBottom: "20px"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#2563eb",
                    letterSpacing: "1px"
                  }}
                >
                  TEAM VERIFICATION
                </span>

                <h2
                  style={{
                    margin: "4px 0 0",
                    fontSize: "22px",
                    color: "#1e293b"
                  }}
                >
                  {getTeamName(
                    selectedTeam
                  )}
                </h2>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "14px"
                  }}
                >
                  Registration ID:{" "}
                  <strong>
                    {getRegistrationId(
                      selectedTeam
                    )}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTeam(null)
                }
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  lineHeight: 1,
                  color: "#94a3b8",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "24px"
              }}
            >
              <div
                style={{
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border:
                    "1px solid #e2e8f0"
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform:
                      "uppercase"
                  }}
                >
                  Team Lead Details
                </span>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    lineHeight: 1.5,
                    wordBreak: "break-word"
                  }}
                >
                  {getTeamLeadDetails(
                    selectedTeam
                  ) ||
                    getTeamLead(
                      selectedTeam
                    ) ||
                    "Not provided"}
                </div>
              </div>

              <div
                style={{
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border:
                    "1px solid #e2e8f0"
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform:
                      "uppercase"
                  }}
                >
                  Team Members Details
                </span>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    lineHeight: 1.5,
                    wordBreak: "break-word"
                  }}
                >
                  {getTeamMembersDetails(
                    selectedTeam
                  ) ||
                    "None registered"}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px"
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "10px",
                    border:
                      "1px solid #e2e8f0"
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform:
                        "uppercase"
                    }}
                  >
                    College /
                    Organization
                  </span>

                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      color: "#1e293b",
                      fontWeight: 600
                    }}
                  >
                    {getCollege(
                      selectedTeam
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "10px",
                    border:
                      "1px solid #e2e8f0"
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform:
                        "uppercase"
                    }}
                  >
                    Attendance Status
                  </span>

                  <div
                    style={{
                      marginTop: "4px"
                    }}
                  >
                    <span
                      className={`team-status status-${normalize(
                        getAttendance(
                          selectedTeam
                        )
                      )}`}
                    >
                      {getAttendance(
                        selectedTeam
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border:
                    "1px solid #e2e8f0"
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform:
                      "uppercase"
                  }}
                >
                  Project Title
                </span>

                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "13px",
                    color: "#1e293b"
                  }}
                >
                  {getProjectTitle(
                    selectedTeam
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end"
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleAttendance(
                    selectedTeam,
                    "Absent"
                  );
                  setSelectedTeam(null);
                }}
                style={{
                  padding: "10px 18px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  border:
                    "1px solid #fecaca",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Mark Absent
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAttendance(
                    selectedTeam,
                    "Present"
                  );
                  setSelectedTeam(null);
                }}
                style={{
                  padding: "10px 20px",
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                ✓ Verify & Mark Present
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;