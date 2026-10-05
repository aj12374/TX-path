import React, {
  useEffect,
  useState
} from "react";

import {
  getTeams,
  saveAttendance
} from "./HackethonApi";


function Round1() {

  const [teams, setTeams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [savingId, setSavingId] =
    useState(null);

  const [attendance, setAttendance] =
    useState({});


  useEffect(() => {

    loadRound1();

  }, []);


  async function loadRound1() {

    try {

      setLoading(true);
      setError("");

      /*
       * We load all teams from
       * the main Sheet.
       */

      const data =
        await getTeams();

      setTeams(data);

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Failed to load teams."
      );

    } finally {

      setLoading(false);

    }
  }


  async function handleAttendance(
    team,
    value
  ) {

    const registrationId =
      team.registrationId;


    if (!registrationId) {

      alert(
        "Registration ID not found."
      );

      return;
    }


    setSavingId(
      registrationId
    );


    try {

      const result =
        await saveAttendance(
          registrationId,
          value
        );


      setAttendance(
        previous => ({
          ...previous,
          [registrationId]:
            value
        })
      );


      if (value === "Present") {

        alert(
          result.message ||
          "Team added to Round1."
        );

      } else {

        alert(
          "Team marked Absent."
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to save attendance."
      );

    } finally {

      setSavingId(null);

    }
  }


  function getTeamName(team) {

    return (
      team.Team_Name ||
      team.TeamName ||
      team.teamName ||
      team["Team Name"] ||
      "Team"
    );
  }


  function getLeaderName(team) {

    return (
      team.Leader ||
      team.Leader_Name ||
      team.LeaderName ||
      team["Leader Name"] ||
      "-"
    );
  }


  function getCollege(team) {

    return (
      team.College ||
      team.College_Name ||
      team["College Name"] ||
      "-"
    );
  }


  if (loading) {

    return (
      <div className="round-loading">
        Loading Round 1 teams...
      </div>
    );

  }


  if (error) {

    return (
      <div className="round-error">

        <p>{error}</p>

        <button
          onClick={loadRound1}
        >
          Retry
        </button>

      </div>
    );

  }


  return (

    <div className="round1-page">

      <div className="round1-header">

        <div>

          <h1>
            Round 1
          </h1>

          <p>
            Check team attendance
            before evaluation.
          </p>

        </div>


        <div className="round1-count">

          <span>
            Total Teams
          </span>

          <strong>
            {teams.length}
          </strong>

        </div>

      </div>


      <div className="round1-table-wrapper">

        <table className="round1-table">

          <thead>

            <tr>

              <th>#</th>

              <th>
                Registration ID
              </th>

              <th>
                Team
              </th>

              <th>
                Leader
              </th>

              <th>
                College
              </th>

              <th>
                Attendance
              </th>

            </tr>

          </thead>


          <tbody>

            {teams.map(
              (team, index) => {

                const id =
                  team.registrationId;

                const currentAttendance =
                  attendance[id];


                return (

                  <tr key={id || index}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {id}
                    </td>

                    <td>
                      <strong>
                        {getTeamName(team)}
                      </strong>
                    </td>

                    <td>
                      {getLeaderName(team)}
                    </td>

                    <td>
                      {getCollege(team)}
                    </td>

                    <td>

                      <div className="attendance-buttons">

                        <button
                          className={
                            currentAttendance ===
                            "Present"
                              ? "present active"
                              : "present"
                          }
                          disabled={
                            savingId === id
                          }
                          onClick={() =>
                            handleAttendance(
                              team,
                              "Present"
                            )
                          }
                        >
                          {savingId === id
                            ? "Saving..."
                            : "Present"}
                        </button>


                        <button
                          className={
                            currentAttendance ===
                            "Absent"
                              ? "absent active"
                              : "absent"
                          }
                          disabled={
                            savingId === id
                          }
                          onClick={() =>
                            handleAttendance(
                              team,
                              "Absent"
                            )
                          }
                        >
                          Absent
                        </button>

                      </div>

                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}


export default Round1;