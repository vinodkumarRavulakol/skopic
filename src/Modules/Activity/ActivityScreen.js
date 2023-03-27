import React from "react";
import "../../Assets/css/Activity/ActivityScreen.css";
import Header from "../header/header";
import Profile from "./Profile/Profile";
import Community from "./Community/Community";
import Activites from "./Activites/Activites";

function ActivityScreen() {
  return (
    <>
      <Header />
      <Profile />
      <div className="divider">
        <Community />
        <Activites />
      </div>
    </>
  );
}

export default ActivityScreen;
