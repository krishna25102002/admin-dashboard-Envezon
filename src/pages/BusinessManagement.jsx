import { useState } from 'react';
import '../styles/BusinessManagement.css';

function BusinessManagement({ isSidebarOpen }) {
  // Static data for the table (can be replaced with API data)
  const businesses = [
    { name: 'John Events', catering: 'Catering', phone: '9878987654', subscription: '3 Months', status: 'Active' },
    { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
    { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
    { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
    { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
    { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
  ];

  // State for the catering dropdown in the header
  const [isCateringDropdownOpen, setIsCateringDropdownOpen] = useState(false);
  const [selectedCatering, setSelectedCatering] = useState('Catering');

  // Options for the dropdown
  const cateringOptions = Array.from({ length: 10 }, (_, i) => `Option ${i + 1}`);

  // Toggle dropdown visibility
  const toggleCateringDropdown = () => {
    setIsCateringDropdownOpen(!isCateringDropdownOpen);
  };

  // Handle selection of a catering option
  const handleCateringSelect = (value) => {
    setSelectedCatering(value);
    setIsCateringDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className={`business-management ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header Section */}
      <div className="business-management-header">
        <div className="header-left">
          <span className="back-arrow">←</span>
          <h1>Business Management</h1>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <span className="search-icon">🔍</span>
          </div>
          <div className="total-vendors">
            <span>Total Vendors: 4000</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="business-table-container">
        <table className="business-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>
                <div className="custom-dropdown">
                  <div className="dropdown-header" onClick={toggleCateringDropdown}>
                    {selectedCatering} <span className="dropdown-arrow">▼</span>
                  </div>
                  {isCateringDropdownOpen && (
                    <ul className="dropdown-options">
                      {cateringOptions.map((option) => (
                        <li
                          key={option}
                          className="dropdown-option"
                          onClick={() => handleCateringSelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </th>
              <th>Phone Number</th>
              <th>Subscription</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => (
              <tr key={index}>
                <td>{business.name}</td>
                <td>{business.catering}</td>
                <td>{business.phone}</td>
                <td>{business.subscription}</td>
                <td>
                  <span className={`status ${business.status.toLowerCase()}`}>
                    {business.status} <span className="dropdown-arrow">▼</span>
                  </span>
                </td>
                <td>
                  <a href="#" className="view-profile">view profile</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessManagement;


// import './BusinessManagement.css';

// function BusinessManagement({ isSidebarOpen }) {
//   // Static data for the table (can be replaced with API data)
//   const businesses = [
//     { name: 'John Events', catering: 'Catering', phone: '9878987654', subscription: '3 Months', status: 'Active' },
//     { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
//     { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
//     { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
//     { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
//     { name: 'AM events', catering: 'Catering', phone: '9877787654', subscription: '3 Months', status: 'Active' },
//   ];

//   return (
//     <div className={`business-management ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       {/* Header Section */}
//       <div className="business-management-header">
//         <div className="header-left">
//           <span className="back-arrow">←</span>
//           <h1>Business Management</h1>
//         </div>
//         <div className="header-right">
//           <div className="search-bar">
//             <input type="text" placeholder="Search" />
//             <span className="search-icon">🔍</span>
//           </div>
//           <div className="total-vendors">
//             <span>Total Vendors: 4000</span>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="business-table-container">
//         <table className="business-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Catering</th>
//               <th>Phone Number</th>
//               <th>Subscription</th>
//               <th>Status</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {businesses.map((business, index) => (
//               <tr key={index}>
//                 <td>{business.name}</td>
//                 <td>{business.catering}</td>
//                 <td>{business.phone}</td>
//                 <td>{business.subscription}</td>
//                 <td>
//                   <span className={`status ${business.status.toLowerCase()}`}>
//                     {business.status} <span className="dropdown-arrow">▼</span>
//                   </span>
//                 </td>
//                 <td>
//                   <a href="#" className="view-profile">view profile</a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default BusinessManagement;