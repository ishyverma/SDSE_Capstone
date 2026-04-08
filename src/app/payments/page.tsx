"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Payment, User } from "@prisma/client";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [selectedUser, setSelectedUser] = useState("");

  const fetchData = async () => {
    const resPayments = await fetch("/api/payments");
    const dataPayments = await resPayments.json();
    setPayments(Array.isArray(dataPayments) ? dataPayments : []);

    const resUsers = await fetch("/api/users");
    const dataUsers = await resUsers.json();
    setUsers(Array.isArray(dataUsers) ? dataUsers : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, amount: Number(amount), method }),
    });
    setAmount("");
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
        <h1>Manage Payments (Strategy Pattern)</h1>
      </div>
      
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "3rem" }}>
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <h2>Process a Payment</h2>
          <form onSubmit={handlePay}>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
              <option value="" disabled>Select User...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
            
            <input placeholder="Amount ($)" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: 600, fontSize: "0.875rem" }}>Payment Strategy Method:</label>
              <select value={method} onChange={e => setMethod(e.target.value)}>
                <option value="UPI">UPI Payment</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CASH">Cash Payment</option>
              </select>
            </div>
            
            <button type="submit" style={{ marginTop: "0.5rem" }}>Execute Payment Strategy</button>
          </form>
        </div>

        <div style={{ flex: 2 }}>
          <h2>Payment History</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Payer Name</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.id.substring(0, 5)}...</td>
                  <td><strong>{getUserName(p.userId)}</strong></td>
                  <td>${p.amount.toFixed(2)}</td>
                  <td>{p.method}</td>
                  <td className="status-success">{p.status}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
