import React from "react";
import XPBoard from "../components/XPBoard";
import Leaderboards from "../components/Leaderboards";
import Badges from "../components/Badges";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";

const Gamification = () => {
  return (
    <>
      <Navbar />
      <div className='p-6 space-y-6'>
        {/* XP Progress Board */}
        <XPBoard currentXP={2800} levelXP={5000} />

        {/* Leaderboards */}
        <Leaderboards />

        {/* Badges */}
        <Badges />
      </div>
      <Footer/>
    </>
  );
};

export default Gamification;
