import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function TLManagement() {
  const [tls, setTls] = useState([]);

  useEffect(() => {
    fetchTLs();
  }, []);

  const fetchTLs = async () => {
    const { data, error } = await supabase
      .from("team_leaders")
      .select("*");

    console.log("TL:", data, error);

    if (!error) setTls(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Team Leaders</h2>

      {tls.length === 0 ? (
        <p>No Team Leaders Found</p>
      ) : (
        <ul>
          {tls.map((tl) => (
            <li key={tl.id}>{tl.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}