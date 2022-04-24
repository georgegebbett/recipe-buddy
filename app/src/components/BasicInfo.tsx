import { Button, Input, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { Atom } from "jotai";
import { useAtom } from "jotai";
import { useNavigate } from 'react-router-dom';

interface InfoPropTypes {
  tokenAtom: Atom<any>;
}

export function BasicInfo({ tokenAtom }: InfoPropTypes) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useAtom(tokenAtom);

  const navigate = useNavigate();

  const login = async () => {
    const response = await axios.post("http://localhost:4000/auth/login", {
      username: username,
      password: password,
    });
    if (response.status === 201) {
      const { data } = response;
      // @ts-ignore
      setToken({
        ...token,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        username: username,
        roles: data.roles,
      });
      setUsername("");
      setPassword("");
      navigate('/recipes')
    }
  };

  const logout = async () => {
    await axios.delete("http://localhost:4000/auth/login", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    // @ts-ignore
    setToken({});
  };

  const profile = async () => {
    const { data } = await axios.get("http://localhost:4000/profile", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    console.log(data);
  };

  const refreshToken = async () => {
    const { data } = await axios.post(
      "http://localhost:4000/auth/token",
      {
        refresh_token: token.refresh_token,
      },
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    );
    console.log(data);
    // @ts-ignore
    setToken({
      ...token,
      refresh_token: data.refresh_token,
      access_token: data.access_token,
    });
  };

  const getUsers = async () => {
    const { data } = await axios.get("http://localhost:4000/users", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    console.log(data);
  };
  return (
    <div>
      <Typography variant="h3">Logged in user: {token.username}</Typography>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={login}>Login</Button>
      <Button onClick={logout}>Logout</Button>
      <Button onClick={profile}>Profile</Button>
      <Button onClick={refreshToken}>Token Refresh</Button>
      <Button onClick={getUsers}>Get Users</Button>
    </div>
  );
}
