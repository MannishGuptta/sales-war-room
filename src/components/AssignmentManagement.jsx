import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AssignmentManagement() {
  const [rms, setRms] = useState([]);
  const [tls, setTls] = useState([]);
  const [selectedRM, setSelectedRM] = useState("");
  const [selectedTL, setSelectedTL] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: rmData } = await supabase.from("rms").select("*");
    const { data: tlData } = await supabase.from("team_leaders").select("*");

    setRms(rmData || []);
    setTls(tlData || []);
  };

  const assign = async () => {
    const { error } = await supabase.from("rm_tl_assignments").insert([
      {
        rm_id: selectedRM,
        tl_id: selectedTL,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error assigning");
    } else {
      alert("Assigned!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Assign RM to TL</h2>

      <select onChange={(e) => setSelectedRM(e.target.value)}>
        <option>Select RM</option>
        {rms.map((rm) => (
          <option key={rm.id} value={rm.id}>
            {rm.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setSelectedTL(e.target.value)}>
        <option>Select TL</option>
        {tls.map((tl) => (
          <option key={tl.id} value={tl.id}>
            {tl.name}
          </option>
        ))}
      </select>

      <button onClick={assign}>Assign</button>
    </div>
  );
}