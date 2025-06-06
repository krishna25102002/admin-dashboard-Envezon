import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { getUserCount, getBusinessPartnerCount } from '../services/apiService'; // Import API functions

function Dashboard({ isSidebarOpen }) {
  const [userCount, setUserCount] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch User Count
        const uCount = await getUserCount();
        setUserCount(uCount);

        // Fetch Business Partner Count
        const bCount = await getBusinessPartnerCount();
        setBusinessCount(bCount);

      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount.
          // If your token could change and you wanted to refetch, you'd need a way
          // to signal that change here (e.g., from an Auth Context).

  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>Home</h1>
      {error && <p className="error-message">Error fetching data: {error}</p>}
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Users</p>
          <h2>{loading ? 'Loading...' : userCount}</h2>
        </div>
        <div className="stat-card">
          <p>Vendors</p>
          <h2>{loading ? 'Loading...' : businessCount}</h2>
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