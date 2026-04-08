"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Room, User } from "@prisma/client";

// Define a type that includes the occupants relation for Rooms
type RoomWithOccupants = Room & { occupants: User[] };

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomWithOccupants[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Room form states
  const [roomNo, setRoomNo] = useState("");
  const [capacity, setCapacity] = useState("");

  // Assign form states
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const fetchData = async () => {
    const resRooms = await fetch("/api/rooms");
    const dataRooms = await resRooms.json();
    setRooms(Array.isArray(dataRooms) ? dataRooms : []);

    const resUsers = await fetch("/api/users");
    const dataUsers = await resUsers.json();
    setUsers(Array.isArray(dataUsers) ? dataUsers : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomNo, capacity }),
    });
    setRoomNo("");
    setCapacity("");
    fetchData();
  };

  const handleAssignRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/rooms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: selectedRoom, userId: selectedUser, action: "ASSIGN" }),
    });
    setSelectedRoom("");
    setSelectedUser("");
    fetchData();
  };

  const handleVacate = async (userId: string) => {
    await fetch("/api/rooms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "VACATE" }),
    });
    fetchData();
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/">&larr; Back to Home</Link>
        <h1>Manage Rooms</h1>
      </div>
      
      <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <h2>Add New Room</h2>
          <form onSubmit={handleAddRoom}>
            <input placeholder="Room Number (e.g. 101)" value={roomNo} onChange={e => setRoomNo(e.target.value)} required />
            <input placeholder="Capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required />
            <button type="submit">Add Room</button>
          </form>
        </div>

        <div style={{ flex: 1, maxWidth: "400px" }}>
          <h2>Assign Room</h2>
          <form onSubmit={handleAssignRoom}>
            <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} required>
              <option value="" disabled>Select Room...</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNo} (Cap: {r.capacity})</option>)}
            </select>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
              <option value="" disabled>Select Student...</option>
              {users.filter(u => u.role === "STUDENT").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <button type="submit">Assign to Room</button>
          </form>
        </div>
      </div>

      <h2>All Rooms Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Room No</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Occupants</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(r => (
            <tr key={r.id}>
              <td><strong>{r.roomNo}</strong></td>
              <td>{r.capacity}</td>
              <td className="status-success">{r.status}</td>
              <td>
                {r.occupants && r.occupants.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                    {r.occupants.map(user => (
                      <li key={user.id} style={{ marginBottom: "0.5rem" }}>
                        {user.name} <button onClick={() => handleVacate(user.id)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", marginLeft: "1rem", backgroundColor: "var(--danger)" }}>Vacate</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Empty</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
