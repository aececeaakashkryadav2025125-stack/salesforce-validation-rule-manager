import { useEffect, useState } from "react";

function App() {

  const CLIENT_ID = "3MVG9GCMQoQ6rpzTLkWHoUmit7a_YlmyhBQ4HWSVl3tBGs9xD0fLaF3x0n3WTpLxX3TpGdiI06Vw647EspBJM";
  const REDIRECT_URI = "http://localhost:5173";

  const [data, setData] = useState([]);

  // 🔐 LOGIN
  const login = () => {
    localStorage.clear();

    window.location.href =
      `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  // 📡 GET RULES
  const getValidationRules = async () => {
    const token = localStorage.getItem("token");
    const instance = localStorage.getItem("instance_url");

    if (!token || !instance) {
      alert("Login first");
      return;
    }

    const res = await fetch("http://localhost:5000/get-rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, instance })
    });

    const result = await res.json();

    if (!result.success) {
      alert(result.error);
      return;
    }

    setData(result.data);
  };

  // 🔁 TOGGLE RULE
  const toggleRule = async (id, active) => {
    const token = localStorage.getItem("token");
    const instance = localStorage.getItem("instance_url");

    const res = await fetch("http://localhost:5000/toggle-rule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, instance, id, active })
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Updated");
      getValidationRules(); // refresh
    } else {
      alert("❌ Failed");
    }
  };

  // 📥 GET TOKEN FROM URL
  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));

      const token = decodeURIComponent(params.get("access_token"));
      const instance = decodeURIComponent(params.get("instance_url"));

      if (token && instance) {
        localStorage.setItem("token", token);
        localStorage.setItem("instance_url", instance);

        window.location.hash = "";
        alert("✅ Login success");
      }
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Salesforce Integration</h2>

      <button onClick={login}>Login</button>
      <br /><br />

      <button onClick={getValidationRules}>Get Validation Rules</button>

      <br /><br />

      {data.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Id</th>
              <th>Validation Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.Id}>
                <td>{item.Id}</td>
                <td>{item.ValidationName}</td>
                <td>{item.Active ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => toggleRule(item.Id, item.Active)}>
                    {item.Active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
