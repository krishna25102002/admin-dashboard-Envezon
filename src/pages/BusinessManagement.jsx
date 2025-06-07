import { useState, useEffect } from 'react';
import '../styles/BusinessManagement.css';
// Assuming your API service functions are in a file like 'apiService.js'
// You might need to adjust the path based on your project structure.
import { getAllBusinessPartners, getBusinessPartnerCount } from '../services/apiService'; // Adjust path as needed
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate


function BusinessManagement({ isSidebarOpen }) {
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);

  const [approvedVendorCount, setApprovedVendorCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [errorCount, setErrorCount] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // State for the service type dropdown in the header
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('All Services');
  
  // Options for the dropdown
  const serviceFilterOptions = ['All Services', 'Wedding', 'Reception', 'Birthday', 'Anniversary', 'Corporate Event'];

  // Toggle dropdown visibility
  const toggleServiceDropdown = () => {
    setIsServiceDropdownOpen(!isServiceDropdownOpen);
  };

  // Handle selection of a service option
  const handleServiceSelect = (value) => {
    setSelectedService(value);
    setIsServiceDropdownOpen(false); // Close the dropdown after selection
  };

  // Effect to fetch all business partners list
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoadingList(true);
        setErrorList(null);
        const data = await getAllBusinessPartners();
        console.log("Fetched All Businesses (Raw from API in BusinessManagement):", JSON.stringify(data, null, 2));
        setAllBusinesses(data || []); // Ensure data is an array
        setFilteredBusinesses(data || []); // Initially show all
      } catch (err) {
        setErrorList(err);
        console.error("Failed to fetch business partners list:", err);
      } finally {
        setIsLoadingList(false);
      }
    };
    loadVendors();
  }, []);

  // Effect to fetch the count of approved business partners
  useEffect(() => {
    const loadApprovedCount = async () => {
      try {
        setIsLoadingCount(true);
        setErrorCount(null);
        const countData = await getBusinessPartnerCount();
        // The API might return { count: X } or just X. Adjust as per your getBusinessPartnerCount implementation.
        setApprovedVendorCount(countData !== undefined && countData.count !== undefined ? countData.count : (typeof countData === 'number' ? countData : 0));
      } catch (err) {
        setErrorCount(err);
        console.error("Failed to fetch approved business partner count:", err);
      } finally {
        setIsLoadingCount(false);
      }
    };
    loadApprovedCount();
  }, []);

  // Effect to filter businesses when selectedService or allBusinesses changes
  useEffect(() => {
    if (selectedService === 'All Services') {
      setFilteredBusinesses(allBusinesses);
    } else {
      setFilteredBusinesses(
        allBusinesses.filter(business => business.serviceProvided === selectedService)
      );
    }
  }, [selectedService, allBusinesses]);


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
            {isLoadingCount && <span>Loading count...</span>}
            {!isLoadingCount && errorCount && <span>Error loading count</span>}
            {!isLoadingCount && !errorCount && <span>Total Approved Vendors: {approvedVendorCount}</span>}
          </div>
        </div>
      </div>

      {isLoadingList && <p className="loading-message">Loading vendors list...</p>}
      {errorList && (
        <p className="error-message">
          Error fetching vendors list: {typeof errorList === 'string' ? errorList : errorList.message || 'Unknown error'}
        </p>
      )}


      {/* Table Section */}
      <div className="business-table-container">
        <table className="business-table">
          <thead>
            <tr>
              <th>Business ID</th>
              <th>Name</th>
              <th>
                <div className="custom-dropdown">
                  <div className="dropdown-header" onClick={toggleServiceDropdown}>
                    {selectedService} <span className="dropdown-arrow">▼</span>
                  </div>
                  {isServiceDropdownOpen && (
                    <ul className="dropdown-options">
                      {serviceFilterOptions.map((option) => (
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
              <th>Status</th>
              <th></th>

            </tr>
          </thead>
          <tbody>
            {!isLoadingList &&
              filteredBusinesses.length > 0 &&
              filteredBusinesses.map((business) => {
                // Log the specific business object and its isApproved status right before rendering
                console.log(
                  // `Rendering business in table: ID: ${business.id}, Name: ${business.businessName}, isApproved: ${business.isApproved}, typeof isApproved: ${typeof business.isApproved}`
                   `BusinessManagement - Rendering Row: ID=${business.id}, Name="${business.businessName}", isApproved=${business.isApproved} (Type: ${typeof business.isApproved})`
                );
                const isActive = !!business.isApproved; // Explicit boolean conversion
                return (
                  <tr key={business.id}>
                    <td>{business.id}</td>
                    <td>{business.businessName}</td>
                    <td>{business.serviceProvided}</td>
                    <td>{business.phoneNumber}</td>
                    <td>
                      <span className={`status ${isActive ? 'active' : 'inactive'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/business-profile/${business.id}`} className="view-profile">
                        view profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
            {!isLoadingList && filteredBusinesses.length === 0 && !errorList && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No vendors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessManagement;
