import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PendingApprovals.css';

function PendingApprovals({ isSidebarOpen }) {
  // State for dropdowns in headers
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Service');
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  // Options for dropdowns
  const serviceOptions = ['All', 'Catering', 'Photography', 'Decoration'];
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

  // Static data for pending users (replace with API data)
  const pendingBusinesses = [
    { name: 'Jane Events', service: 'Catering', phone: '9876543210', plan: '1 Month', status: 'Pending' },
    { name: 'Doe Catering', service: 'Catering', phone: '9876543211', plan: '3 Months', status: 'Pending' },
    { name: 'Smith Decor', service: 'Decoration', phone: '9876543212', plan: '6 Months', status: 'Pending' },
  ];

  return (
    <div className={`pending-approvals ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header Section */}
      <div className="pending-approvals-header">
        <div className="header-left">
          <span className="back-arrow">←</span>
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
            {pendingBusinesses.map((business, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{business.name}</td>
                <td>{business.service}</td>
                <td>{business.phone}</td>
                <td>{business.plan}</td>
                <td>{business.status}</td>
                <td>
                  <Link
                    to="/view-details"
                    state={{
                      data: {
                        proprietorName: business.name.split(' ')[0],
                        email: `${business.name.split(' ')[0].toLowerCase()}@gmail.com`,
                        businessName: business.name,
                        service: business.service,
                        phoneNumber: business.phone,
                        state: 'Tamilnadu',
                        district: 'Coimbatore',
                        location: '12/1 Avinashi Road, Coimbatore',
                        plan: business.plan,
                        paymentStatus: 'Pending',
                        paymentMode: 'N/A',
                      },
                    }}
                    className="view-link"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingApprovals;