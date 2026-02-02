import React, { useContext, useEffect } from "react";
import LoginContext from "../../contexts/loginContext";
import { useNavigate } from "react-router-dom";

function Events() {
  const { currentUser, loading, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  // Protect route
  useEffect(() => {
    if (!loading && !currentUser?.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  return <div className="">Events for tech</div>;
}

export default Events;

// show list of events assigned to the technician
// each event should display event name, date, time, location, and status
// allow technicians to update the status of an event (e.g., completed, in progress)
// provide a search functionality to filter events by name or date
// implement pagination if there are many events
// also finished events should be archived and not shown in the main list
// allow technicians to view details of each event by clicking on it
// allow technicians to add notes or comments to each event
