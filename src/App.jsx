import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>🚀 User List</h1>
      <div className="text-4xl text-red-200 font-bold">
        Hello word!
      </div>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.age} years old
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    
  );
}

export default App;
