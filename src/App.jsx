import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SidebarComponent from './components/SidebarComponent';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import BusinessManagement from './pages/BusinessManagement';
import Approvals from './pages/Approvals';
import ViewDetails from './components/ViewDetails';
import ViewBill from './components/ViewBill';
import Events from './pages/Events';
import Promotions from './pages/Promotions';
import PendingApprovals from './pages/PendingApprovals';
import Subscriptions from './pages/Subscriptions';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggedIn(false);
      window.location.href = '/login.html';
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <button className="toggle-button" onClick={toggleSidebar}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            <h1 className="company-name">Evnazon</h1>
          </div>
          <div className="header-right">
            <div className="profile-container">
              <div className="profile-icon"></div>
              <span className="admin-name">Admin</span>
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="#" className="dropdown-item" onClick={handleLogout}>Logout</Link>
              </div>
            </div>
          </div>
        </header>
        <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
          <SidebarComponent handleLogout={handleLogout} />
        </div>
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard isSidebarOpen={isSidebarOpen} />} />
            <Route path="/user-management" element={<UserManagement isSidebarOpen={isSidebarOpen} />} />
            <Route path="/business" element={<BusinessManagement isSidebarOpen={isSidebarOpen} />} />
            <Route path="/content" element={<Approvals isSidebarOpen={isSidebarOpen} />} />
            <Route path="/view-details" element={<ViewDetails />} />
            <Route path="/view-bill" element={<ViewBill />} />
            <Route path="/events" element={<Events isSidebarOpen={isSidebarOpen} />} />
            <Route path="/promotions" element={<Promotions isSidebarOpen={isSidebarOpen} />} />
            <Route path="/pending-approvals" element={<PendingApprovals isSidebarOpen={isSidebarOpen} />} />
            <Route path="/subscriptions" element={<Subscriptions isSidebarOpen={isSidebarOpen} />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;