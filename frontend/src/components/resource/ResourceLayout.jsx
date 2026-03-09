import "./resource.css";



export default function ResourceLayout({ children, onLogout, user, onNavigate, currentPage }) {


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

          <div
            className={`navItem ${currentPage === 'Home' ? 'active' : ''}`}
            onClick={() => onNavigate('Home')}
            style={{ cursor: 'pointer' }}
          >
            Home
          </div>

          <div
            className={`navItem ${currentPage === 'Resources' ? 'active' : ''}`}
            onClick={() => onNavigate('Resources')}
            style={{ cursor: 'pointer' }}
          >
            Resources
          </div>

          {user?.role === 'ADMIN' && (
            <div
              className={`navItem ${currentPage === 'Admin' ? 'active' : ''}`}
              onClick={() => onNavigate('Admin')}
              style={{ cursor: 'pointer', color: '#14b8a6', fontWeight: '700' }}
            >
              Admin Panel
            </div>
          )}

          <div className="navItem">Bookings</div>
          <div className="navItem">Tickets</div>
          <div className="navItem">Notifications</div>

          <div
            className={`navItem ${currentPage === 'Settings' ? 'active' : ''}`}
            onClick={() => onNavigate('Settings')}
            style={{ cursor: 'pointer' }}
          >
            Settings
          </div>

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