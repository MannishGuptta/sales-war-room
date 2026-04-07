import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function MasterDataManagement() {
  const [rms, setRms] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchRMs();
  }, []);

  const fetchRMs = async () => {
    const { data, error } = await supabase.from("rms").select("*");

    console.log("RMS:", data, error);

    if (!error) setRms(data);
  };

  const addRM = async () => {
    if (!name) return alert("Enter name");

    const { error } = await supabase.from("rms").insert([{ name }]);

    if (error) {
      console.error(error);
      alert("Error adding RM");
    } else {
      setName("");
      fetchRMs();
    }
  };

  const deleteRM = async (id) => {
    await supabase.from("rms").delete().eq("id", id);
    fetchRMs();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Master Data - RMs</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter RM Name"
      />
      <button onClick={addRM}>Add RM</button>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rms.map((rm) => (
            <tr key={rm.id}>
              <td>{rm.name}</td>
              <td>
                <button onClick={() => deleteRM(rm.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}