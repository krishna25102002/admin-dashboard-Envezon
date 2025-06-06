import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PendingApprovals.css';
import { getAllBusinessPartners } from '../services/apiService'; // Import the API function

function PendingApprovals({ isSidebarOpen }) {
  // State for dropdowns in headers
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    if (selectedService !== 'All' && selectedService !== 'Service') {
      currentBusinesses = currentBusinesses.filter(business => business.service === selectedService);
    }

    // The selectedStatus is always 'Pending' for this page, so no explicit filter needed for it here
    // if you were to allow other statuses like 'Rejected', you'd filter by selectedStatus here.
    return currentBusinesses;
  }, [allBusinesses, selectedService, selectedStatus]);

  return (
    <div className={`pending-approvals ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header Section */}
      <div className="pending-approvals-header">
        <div className="header-left">
          {/* Consider making this a Link to navigate back if needed */}
          <span className="back-arrow" onClick={() => window.history.back()} style={{cursor: 'pointer'}}>←</span>
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
                <td>{business.businessName}</td>
                <td>{business.service}</td>
                <td>{business.phoneNumber}</td>
                <td>{business.plan}</td>
                <td>Pending</td> {/* Since we filter for !isApproved, status is implicitly Pending */}
                <td>
                  <Link
                    to="/view-details"
                    state={{
                      data: {
                        ...business, // Pass the whole business object
                        // Ensure all necessary fields are present in the business object from API
                        // Or map them explicitly if names differ
                        // proprietorName: business.proprietorName || business.businessName?.split(' ')[0],
                        // email: business.email || `${business.businessName?.split(' ')[0].toLowerCase()}@example.com`,
                        // state: business.state || 'N/A',
                        // district: business.district || 'N/A',
                        // location: business.location || 'N/A',
                        // paymentStatus: business.paymentStatus || 'Pending',
                        // paymentMode: business.paymentMode || 'N/A',
                        status: 'Pending' // Explicitly set status for ViewDetails if needed
                      },
                    }}
                    className="view-link"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && !error && filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No pending approvals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingApprovals;