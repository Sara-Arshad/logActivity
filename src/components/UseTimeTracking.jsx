import { useState, useEffect } from "react";
import moment from "moment";

const UseTimeTracking = () => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakInTime, setBreakInTime] = useState(null);
  const [breakOutTime, setBreakOutTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  const checkIn = () => {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    setCheckInTime(time);
    setBreakInTime(null);
    setBreakOutTime(null);
    setCheckOutTime(null);
  };

  const breakIn = () => {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    setBreakInTime(time);
  };

  const breakOut = () => {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("Break out time:", time); // Verify if this log appears
    setBreakOutTime(time);
  };

  const checkOut = () => {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    setCheckOutTime(time);
  };

  const reset = () => {
    setCheckInTime(null);
    setBreakInTime(null);
    setBreakOutTime(null);
    setCheckOutTime(null);
  };

  return {
    checkInTime,
    breakInTime,
    breakOutTime,
    checkOutTime,
    checkIn,
    breakIn,
    breakOut,
    checkOut,
    reset,
  };
};

export default UseTimeTracking;
