import { useState } from "react";
import axios from "axios";
import { tokenAtom } from "../App";
import { useAtom } from "jotai";
import { Button, Input, Typography } from "@mui/material";

export function NewUserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token] = useAtom(tokenAtom);

  const createUser = async () => {
    await axios.post(
      "http://localhost:4000/users",
      {
        username: username,
        password: password,
        roles: ["user"],
      },
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
  };

  return (
    <div>
      <Typography variant="h1">New User Form</Typography>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button onClick={createUser}>Create</Button>
    </div>
  );
}
