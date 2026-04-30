import { useEffect, useState } from "react";

function App() {

  const CLIENT_ID = "3MVG9GCMQoQ6rpzTLkWHoUmit7a_YlmyhBQ4HWSVl3tBGs9xD0fLaF3x0n3WTpLxX3TpGdiI06Vw647EspBJM";

  // ✅ FIXED: dynamic redirect (works on Netlify)
  const REDIRECT_URI = window.location.origin;

  // ✅ FIXED: production backend URL
  const BASE_URL = "https://salesforce-validation-rule-manager-7c9d.onrender.com";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const login = () => {
    localStorage.clear();

    window.location.href =
      `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  // 📡 GET VALIDATION RULES
  const getValidationRules = async () => {
    const token = localStorage.getItem("token");
    const instance = localStorage.getItem("instance_url");

    if (!token || !instance) {
      alert("⚠️ Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/get-rules`, {
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

    } catch (err) {
      console.error(err);
      alert("❌ Request failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 TOGGLE RULE
  const toggleRule = async (id, active) => {
    const token = localStorage.getItem("token");
    const instance = localStorage.getItem("instance_url");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/toggle-rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, instance, id, active })
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Rule Updated in Salesforce");
        getValidationRules();
      } else {
        alert(result.error || "❌ Failed");
      }

    } catch (err) {
      console.error(err);
      alert("❌ Toggle failed");
    } finally {
      setLoading(false);
    }
  };

  // 📥 HANDLE LOGIN REDIRECT
  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));

      const token = params.get("access_token");
      const instance = params.get("instance_url");

      if (token && instance) {
        localStorage.setItem("token", token);
        localStorage.setItem("instance_url", instance);

        window.location.hash = "";
        alert("✅ Login successful");

        setTimeout(() => {
          getValidationRules();
        }, 500);
      }
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>🚀 Salesforce Validation Rule Manager</h2>

      <button onClick={login}>Login</button>
      <br /><br />

      <button onClick={getValidationRules}>
        {loading ? "Loading..." : "Get Validation Rules"}
      </button>

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
                <td>{item.ValidationName || item.Name}</td>
                <td>{item.Active ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    disabled={loading}
                    onClick={() => toggleRule(item.Id, item.Active)}
                  >
                    {item.Active ? "Deactivate & Deploy" : "Activate & Deploy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && data.length === 0 && (
        <p>No validation rules loaded</p>
      )}
    </div>
  );
}

export default App;
