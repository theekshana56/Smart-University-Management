import "./resource.css";



export default function ResourceLayout({ children, onLogout, user }) {


  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">
            {user?.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt="profile"
                className="avatarImg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="avatarPlaceholder" style={{ display: user?.pictureUrl ? 'none' : 'flex' }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="name">{user?.name || "Campus User"}</div>
            <div className="email">{user?.email || "user@campus.net"}</div>
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

        <div className="logout">
          <button onClick={onLogout}>
            Logout</button></div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}