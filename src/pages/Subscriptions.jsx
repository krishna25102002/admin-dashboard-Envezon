import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Subscriptions.css';

function Subscriptions({ isSidebarOpen }) {
  // State for dropdowns in headers
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Catering');
  const [selectedStatus, setSelectedStatus] = useState('Paid');

  // Options for dropdowns
  const serviceOptions = ['All', 'Catering', 'Photography', 'Decoration'];
  const statusOptions = ['Paid', 'Unpaid', 'Pending'];

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

  // Static data for subscribed users (replace with API data)
  const subscribedUsers = [
    { id: 'IOHOO', name: 'John', service: 'Catering', phone: '9878987654', payment: 'PhonePe', plan: '3 Months', status: 'Paid' },
    { id: 'IOHO1', name: 'John Events', service: 'Catering', phone: '9878987654', payment: 'PhonePe', plan: '3 Months', status: 'Paid' },
    { id: 'IOHO2', name: 'John Events', service: 'Catering', phone: '9878987654', payment: 'PhonePe', plan: '3 Months', status: 'Paid' },
    { id: 'IOHO3', name: 'John Events', service: 'Catering', phone: '9878987654', payment: 'PhonePe', plan: '3 Months', status: 'Paid' },
    { id: 'IOHO4', name: 'John Events', service: 'Catering', phone: '9878987654', payment: 'PhonePe', plan: '3 Months', status: 'Paid' },
  ];

  return (
    <div className={`subscriptions ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header Section */}
      <div className="subscriptions-header">
        <div className="header-left">
          <span className="back-arrow">←</span>
          <h1>Subscriptions</h1>
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
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>ID NO</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Viewbill</th>
            </tr>
          </thead>
          <tbody>
            {subscribedUsers.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.payment}</td>
                <td>{user.status}</td>
                <td>
                  <Link
                    to="/view-bill"
                    state={{
                      billData: {
                        payment_id: `pay_${user.id}`,
                        amount: 2900, // Razorpay amount in paisa (replace with actual amount)
                        currency: 'INR',
                        status: user.status.toLowerCase(),
                        created_at: 1696118400, // Replace with actual timestamp
                        method: user.payment.toLowerCase(),
                        email: `${user.name.toLowerCase().replace(' ', '')}@gmail.com`,
                        contact: user.phone,
                        description: `Payment for ${user.plan} Plan`,
                      },
                    }}
                    className="viewbill-link"
                  >
                    Viewbill
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

export default Subscriptions;