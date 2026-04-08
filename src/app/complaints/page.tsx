"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Complaint, User } from "@prisma/client";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const fetchData = async () => {
    const resComplaints = await fetch("/api/complaints");
    const dataComplaints = await resComplaints.json();
    setComplaints(Array.isArray(dataComplaints) ? dataComplaints : []);

    const resUsers = await fetch("/api/users");
    const dataUsers = await resUsers.json();
    setUsers(Array.isArray(dataUsers) ? dataUsers : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRaise = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, title, description }),
    });
    setTitle("");
    setDescription("");
    fetchData();
  };

  const handleResolve = async (complaintId: string) => {
    await fetch("/api/complaints", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaintId }),
    });
    fetchData();
  };

  const getUserName = (id: string) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/">&larr; Back to Home</Link>
        <h1>Manage Complaints</h1>
      </div>
      
      <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <h2>Raise a Complaint</h2>
          <form onSubmit={handleRaise}>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
              <option value="" disabled>Select Student Raising Complaint...</option>
              {users.filter(u => u.role === "STUDENT").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            
            <input placeholder="Complaint Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Detailed Description..." value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
            
            <button type="submit">Submit Complaint</button>
          </form>
        </div>

        <div style={{ flex: 2 }}>
          <h2>All Complaints</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Raiser</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td>{c.id.substring(0, 5)}...</td>
                  <td><strong>{getUserName(c.userId)}</strong></td>
                  <td>{c.title}</td>
                  <td>{c.description}</td>
                  <td className={c.status === "OPEN" ? "status-danger" : "status-success"}>
                    {c.status}
                  </td>
                  <td>
                    {c.status === "OPEN" ? (
                      <button onClick={() => handleResolve(c.id)} style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}>Resolve</button>
                    ) : (
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
