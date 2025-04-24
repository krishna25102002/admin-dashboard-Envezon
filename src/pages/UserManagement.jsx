import { useState } from 'react';
import '../styles/UserManagement.css';

function UserManagement({ isSidebarOpen }) {
  // Static data for the table (can be replaced with API data)
  const initialUsers = [
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Suspend' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Suspend' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Suspend' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
    { name: 'Anand', phone: '7898764523', email: 'abc@gmail.com', location: 'Madurai', status: 'Approved' },
  ];

  // State to manage the users and dropdown visibility for each row
  const [users, setUsers] = useState(initialUsers);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  // Options for the dropdown
  const statusOptions = ['Approved', 'Suspend'];

  // Toggle dropdown visibility for a specific row
  const toggleDropdown = (index) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle selection of a status option
  const handleStatusSelect = (index, value) => {
    const updatedUsers = [...users];
    updatedUsers[index].status = value;
    setUsers(updatedUsers);
    toggleDropdown(index); // Close the dropdown after selection
  };

  return (
    <div className={`user-management ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header Section */}
      <div className="user-management-header">
        <div className="header-left">
          <span className="back-arrow">←</span>
          <h1>User Management</h1>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <span className="search-icon">🔍</span>
          </div>
          <div className="total-users">
            <span>Total Users: 4000</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.location}</td>
                <td>
                  <div className="custom-dropdown">
                    <div className="dropdown-header" onClick={() => toggleDropdown(index)}>
                      {user.status} <span className="dropdown-arrow">▼</span>
                    </div>
                    {isDropdownOpen[index] && (
                      <ul className="dropdown-options">
                        {statusOptions.map((option) => (
                          <li
                            key={option}
                            className="dropdown-option"
                            onClick={() => handleStatusSelect(index, option)}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;