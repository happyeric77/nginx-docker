import type { NextPage } from "next";

import { request } from "graphql-request";
import { useState } from "react";

interface IUser {
  username: string;
  email: string;
}
const qlEndpoint = "http://168.138.200.230:3001/graphql";

const Home: NextPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [inputUsername, setInputUsername] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  async function fetchUsers() {
    const query = `
      query {
        Users {
          username
          email
        }
      }
    `;
    const res = await request(qlEndpoint, query);
    setUsers(res.Users);
  }
  async function updateUsername(inputUsername: string, newUsername: string) {
    const query = `
      mutation {
        UpdateUsername(username: "${inputUsername}", newUsername: "${newUsername}") {
          username
          email
        }
      }
    `;
    const tokenRes = await fetch("/api/create-jwt", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ pwd: pwd }),
    });
    const token = ((await tokenRes.json()) as any).Authorization;
    console.log(token);
    const res = await request(qlEndpoint, query, undefined, {
      Authorization: token,
    });
    console.log(res.UpdateUsername);
    setUsers(res.UpdateUsername);
  }
  return (
    <>
      <h1>Fetch user section</h1>
      <button onClick={() => fetchUsers()}>Fetch users</button>
      <div>
        {users.map((user, key) => (
          <div key={key}>
            {user.username} {user.email}
          </div>
        ))}
      </div>
      <hr></hr>
      <h1>Update username</h1>
      <input
        type="text"
        onChange={(evt) => setInputUsername(evt.target.value)}
        value={inputUsername}
        placeholder="current username"
      />
      <input
        type="text"
        onChange={(evt) => setNewUsername(evt.target.value)}
        placeholder="new username"
      />
      <input
        type="text"
        value={pwd}
        placeholder="Input credential"
        onChange={(evt) => setPwd(evt.target.value)}
      />
      <button onClick={() => updateUsername(inputUsername, newUsername)}>
        Submit
      </button>
    </>
  );
};

export default Home;
