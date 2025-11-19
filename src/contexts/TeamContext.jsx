// src/contexts/TeamContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TeamContext = createContext();
export const useTeam = () => useContext(TeamContext);

const TEAM_KEY = "td_team_v1";

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(TEAM_KEY);
    if (raw) setTeam(JSON.parse(raw));
    else {
      const initial = [
        { id: uuidv4(), name: "Alice", role: "Designer", email: "alice@example.com" },
        { id: uuidv4(), name: "Bob", role: "Developer", email: "bob@example.com" }
      ];
      localStorage.setItem(TEAM_KEY, JSON.stringify(initial));
      setTeam(initial);
    }
  }, []);

  const addMember = (member) => {
    const next = [...team, { id: uuidv4(), ...member }];
    setTeam(next);
    localStorage.setItem(TEAM_KEY, JSON.stringify(next));
  };

  const removeMember = (id) => {
    const next = team.filter(m => m.id !== id);
    setTeam(next);
    localStorage.setItem(TEAM_KEY, JSON.stringify(next));
  };

  return <TeamContext.Provider value={{ team, addMember, removeMember }}>{children}</TeamContext.Provider>;
}
