import "./resource.css";

export default function ResourceLayout({ children }) {
  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar" />
          <div>
            <div className="name">CampusNexus</div>
            <div className="email">resources@campus</div>
          </div>
        </div>

        <nav className="nav">

          {/* NEW Home button */}
          <div className="navItem">Home</div>

          <div className="navItem active">Resources</div>
          <div className="navItem">Bookings</div>
          <div className="navItem">Tickets</div>
          <div className="navItem">Notifications</div>
          <div className="navItem">Settings</div>

        </nav>

        <div className="logout">Logout</div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}