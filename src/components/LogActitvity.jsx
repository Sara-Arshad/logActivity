import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";

import UseTimeTracking from "./UseTimeTracking";
import TodayLogCard from "./TodayLogCard";

const LogActivity = () => {
  const {
    checkInTime,
    breakInTime,
    breakOutTime,
    checkOutTime,
    checkIn,
    breakIn,
    breakOut,
    checkOut,
    reset,
  } = UseTimeTracking();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0); // Total break time in seconds
  const [log, setLog] = useState([]);
  const [overtime, setOvertime] = useState(0);

  useEffect(() => {
    let timer;

    if (checkInTime && !breakOutTime && !checkOutTime) {
      timer = setInterval(() => {
        const currentTime = moment();
        const elapsed =
          currentTime.diff(moment(checkInTime), "seconds") - breakTime;
        setElapsedTime(elapsed);

        if (elapsed > 28800) {
          // 8 hours in seconds
          setOvertime(elapsed - 28800);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [checkInTime, breakOutTime, checkOutTime, breakTime]);

  useEffect(() => {
    if (breakInTime && !breakOutTime) {
      const breakTimer = setInterval(() => {
        setBreakTime(moment().diff(moment(breakInTime), "seconds"));
      }, 1000);

      return () => clearInterval(breakTimer);
    }
  }, [breakInTime, breakOutTime]);

  const handleCheckIn = () => {
    if (!checkInTime) {
      checkIn();
    } else {
      checkOut();
      const checkOutMoment = moment();
      setLog([
        ...log,
        {
          checkIn: checkInTime,
          checkOut: checkOutMoment.format("YYYY-MM-DD HH:mm:ss"),
          breakStartTime: breakInTime || "N/A",
          breakEndTime: breakOutTime || "N/A",
          breakTime: breakTime, // Store as seconds
          totalWorkTime:
            moment
              .duration(checkOutMoment.diff(moment(checkInTime)))
              .asSeconds() - breakTime,
        },
      ]);
      reset();
    }
  };

  const handleTakeBreak = () => {
    if (!breakInTime && !breakOutTime) {
      breakIn(); // Set breakInTime
    } else if (breakInTime && !breakOutTime) {
      breakOut(); // Set breakOutTime

      const breakEndMoment = moment();
      const breakDuration = breakEndMoment.diff(moment(breakInTime), "seconds");

      setBreakTime((prevBreakTime) => prevBreakTime + breakDuration);

      const updatedLog = log.map((entry) => {
        if (entry.breakEndTime === "N/A") {
          return {
            ...entry,
            breakEndTime: breakEndMoment.format("YYYY-MM-DD HH:mm:ss"),
          };
        }
        return entry;
      });

      setLog(updatedLog);
    }
  };

  const percentage = (elapsedTime / 28800) * 100;

  useEffect(() => {
    const savedLog = localStorage.getItem("log");
    if (savedLog) {
      setLog(JSON.parse(savedLog));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("log", JSON.stringify(log));
  }, [log]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Timesheet</h1>
          <p style={styles.date}>{moment().format("DD MMMM YYYY")}</p>
          <p style={styles.shift}>Current Shift: 09:00 AM - 06:00 PM</p>
        </div>
        <div style={styles.circleContainer}>
          <div style={styles.circularProgressWrapper}>
            <CircularProgressbar
              value={percentage}
              text={`${Math.floor(elapsedTime / 3600)}:${Math.floor(
                (elapsedTime % 3600) / 60
              )}:${elapsedTime % 60}`}
              styles={buildStyles({
                textSize: "14px",
                pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                textColor: "#3E98C7",
                trailColor: "#d6d6d6",
                backgroundColor: "#f66c42",
              })}
            />
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={handleCheckIn} style={styles.buttonCheckIn}>
            {checkInTime ? "Check Out" : "Check In"}
          </button>
          <button
            onClick={handleTakeBreak}
            style={styles.buttonBreak}
            disabled={!checkInTime || (breakInTime && breakOutTime)}
          >
            {breakInTime ? "Break Out" : "Take Break"}
          </button>
        </div>
        <div style={styles.infoContainer}>
          <div style={styles.infoBox}>
            <p>Break</p>
            <span>{moment.utc(breakTime * 1000).format("HH:mm:ss")}</span>
          </div>
          <div style={styles.infoBox}>
            <p>Overtime</p>
            <span>{moment.utc(overtime * 1000).format("HH:mm:ss")}</span>
          </div>
        </div>
      </div>
      <div style={styles.logContainer}>
        <TodayLogCard log={log} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    width: "95vw",
    fontFamily: "'Arial', sans-serif",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    textAlign: "center",
    backgroundColor: "#fff",
    marginRight: "20px",
  },
  header: {
    marginBottom: "10px",
  },
  title: {
    fontSize: "24px",
    margin: "0",
  },
  date: {
    margin: "5px 0",
    color: "#888",
  },
  shift: {
    fontSize: "14px",
    color: "#555",
  },
  circleContainer: {
    marginBottom: "10px",
  },
  circularProgressWrapper: {
    width: "100px",
    height: "100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  buttonCheckIn: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#3445b4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    flex: "1",
    marginRight: "5px",
  },
  buttonBreak: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#f66c42",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    flex: "1",
    marginLeft: "5px",
  },
  infoContainer: {
    display: "flex",
    justifyContent: "space-between",
    ga: "20px",
    marginBottom: "10px",
  },
  infoBox: {
    width: "48%",
    padding: "10px",

    borderRadius: "4px",
    textAlign: "center",
  },
  logContainer: {
    flex: "1",
    maxWidth: "600px",
  },
};

export default LogActivity;
