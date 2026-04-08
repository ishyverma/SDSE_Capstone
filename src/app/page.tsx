import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <h1>SmartStay - Hostel Management System</h1>
      <p>This project uses clean architecture (layered), SOLID principles, and OOP Design Patterns (Factory, Strategy, Singleton).</p>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Modules</h2>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <Link href="/users">Manage Users (Register & List)</Link>
          <Link href="/rooms">Manage Rooms (Add & Assign)</Link>
          <Link href="/payments">Manage Payments (Strategy Pattern)</Link>
          <Link href="/complaints">Manage Complaints (Raise & Resolve)</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Architecture Note:</h2>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Singleton:</strong> Used for the Prisma DB client (<code>src/lib/prisma.ts</code>).</li>
          <li><strong>Factory Method:</strong> Used for creating different types of Users (<code>src/factories/user.factory.ts</code>).</li>
          <li><strong>Strategy:</strong> Used for dynamically tracking payment methods (<code>src/strategies/payment.strategy.ts</code>).</li>
          <li><strong>SOLID & OOP:</strong> Dependency inversion and single responsibility via distinct Repository and Service layers.</li>
        </ul>
      </div>
    </div>
  );
}
