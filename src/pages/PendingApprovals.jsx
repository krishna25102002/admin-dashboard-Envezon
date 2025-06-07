import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PendingApprovals.css';
import { getAllBusinessPartners } from '../services/apiService'; // Import the API function

function PendingApprovals({ isSidebarOpen }) {
  // State for dropdowns in headers
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Service');
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  // Options for dropdowns
  const serviceOptions = ['All', 'Catering', 'Photography', 'Decoration'];
  // For this page, we are only interested in 'Pending' status.
  // If you had other statuses for pending items, you could add them here.
  const statusOptions = ['Pending']; 

  // Toggle dropdown visibility
  const toggleServiceDropdown = () => setIsServiceDropdownOpen(!isServiceDropdownOpen);
  const toggleStatusDropdown = () => setIsStatusDropdownOpen(!isStatusDropdownOpen);

  // Handle selection of options
  const handleServiceSelect = (value) => {
    setSelectedService(value);
    setIsServiceDropdownOpen(false);
  };
  const handleStatusSelect = (value) => {
    setSelectedStatus(value);
    setIsStatusDropdownOpen(false);
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBusinessPartners();
        setAllBusinesses(data || []); // Ensure data is an array
      } catch (err) {
        console.error("Failed to fetch business partners:", err);
        setError(err.message);
        setAllBusinesses([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    // Filter businesses based on approval status and selected service
    let currentBusinesses = allBusinesses.filter(business => !business.isApproved); // Show only not approved

    if (selectedService !== 'All' && selectedService !== 'Service') { // Assuming 'Service' is the default unselected text
      currentBusinesses = currentBusinesses.filter(business => business.serviceProvided === selectedService);
    }

    // The selectedStatus is 'Pending' by default, which aligns with !business.isApproved
    // if you were to allow other statuses like 'Rejected', you'd filter by selectedStatus here.
    return currentBusinesses;
  }, [allBusinesses, selectedService, selectedStatus]);

  return (
    <div className={`pending-approvals ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header Section */}
      <div className="pending-approvals-header">
        <div className="header-left">
          {/* Consider making this a Link to navigate back if needed */}
          <span className="back-arrow" onClick={() => navigate(-1)} style={{cursor: 'pointer'}}>←</span>
          <h1>Pending Approvals</h1>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <span className="search-icon">🔍</span>
          </div>
          <div className="date-dropdown">
            <span onClick={() => {}} className="date-text">Today</span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </div>

      {loading && <p className="loading-message">Loading pending approvals...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {/* Table Section */}
      <div className="table-container">
        <table className="pending-approvals-table">
          <thead>
            <tr>
              <th>Business ID</th>
              <th>Business Name</th>
              <th>
                <div className="custom-dropdown">
                  <div className="dropdown-header" onClick={toggleServiceDropdown}>
                    {selectedService} <span className="dropdown-arrow">▼</span>
                  </div>
                  {isServiceDropdownOpen && (
                    <ul className="dropdown-options">
                      {serviceOptions.map((option) => (
                        <li
                          key={option}
                          className="dropdown-option"
                          onClick={() => handleServiceSelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </th>
              <th>Phone Number</th>
              <th>Plan</th>
              <th>
                <div className="custom-dropdown">
                  <div className="dropdown-header" onClick={toggleStatusDropdown}>
                    {selectedStatus} <span className="dropdown-arrow">▼</span>
                  </div>
                  {isStatusDropdownOpen && (
                    <ul className="dropdown-options">
                      {statusOptions.map((option) => (
                        <li
                          key={option}
                          className="dropdown-option"
                          onClick={() => handleStatusSelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && filteredBusinesses.map((business, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{business.id || 'N/A'}</td>
                <td>{business.businessName || 'N/A'}</td>
                <td>{business.serviceProvided || 'N/A'}</td>
                <td>{business.phoneNumber || 'N/A'}</td>
                <td>{business.plan || 'N/A'}</td> {/* Assuming 'plan' is a field */}
                <td>Pending</td> {/* Since we filter for !isApproved, status is implicitly Pending */}
                <td>
                  <Link to={`/business-profile/${(business.id)}`} className="view-link">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && !error && filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No pending approvals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingApprovals;