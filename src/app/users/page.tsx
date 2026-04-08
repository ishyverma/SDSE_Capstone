"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { User } from "@prisma/client";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: role, name, email }),
    });
    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/">&larr; Back to Home</Link>
        <h1>Manage Users (Factory Pattern)</h1>
      </div>
      
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <h2>Create New User</h2>
          <form onSubmit={handleCreateUser}>
            <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            <input placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Create User</button>
          </form>
        </div>

        <div style={{ flex: 2 }}>
          <h2>Registered Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id.substring(0, 5)}...</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="status-success">{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
