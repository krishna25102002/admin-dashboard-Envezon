import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Profile.css';

function Profile({ isSidebarOpen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    address: '123 Main St, City',
  });
  const [editedData, setEditedData] = useState({ ...userData });

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setUserData({ ...editedData });
    setIsEditing(false);
  };
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`profile ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="profile-header">
        <div className="header-left">
          <span className="back-arrow">←</span>
          <h1>Profile</h1>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <h2>User Information</h2>
            <div className="info-row">
              <span>Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.name}</span>
              )}
            </div>
            <div className="info-row">
              <span>Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>
            <div className="info-row">
              <span>Phone:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.phone}</span>
              )}
            </div>
            <div className="info-row">
              <span>Address:</span>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editedData.address}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.address}</span>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            ) : (
              <button onClick={handleEdit} className="edit-button">
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;