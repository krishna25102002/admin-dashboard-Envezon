import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard({ isSidebarOpen }) {
  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>Home</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Users</p>
          <h2>4000</h2>
        </div>
        <div className="stat-card">
          <p>Vendors</p>
          <h2>1700</h2>
        </div>
        <div className="stat-card">
          <p>Subscription</p>
          <h2>$508300</h2>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-grid">
        <div className="action-card">
          <Link to="/events" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h3>Events</h3>
            <span>→</span>
          </Link>
        </div>
        <div className="action-card">
          <Link to="/promotions" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h3>Promotions</h3>
            <span>→</span>
          </Link>
        </div>
        <div className="action-card">
          <Link to="/pending-approvals" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h3>Pending Approvals</h3>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;