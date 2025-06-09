import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BusinessViewProfile.css';
import { getAllBusinessPartners, updateBusinessDetailsAPI } from '../services/apiService';

function BusinessViewProfile({ isSidebarOpen }) {
  const { businessId } = useParams(); // Extracts ID from URL, e.g., "1", "12"
  const navigate = useNavigate();

  // State for the form data, initialized with a structure
  const [formData, setFormData] = useState({
    id: businessId, // Store the ID from params
    businessName: "",
    proprietorName: "",
    price: "",
    serviceProvided: "",
    location: "",
    state: "",
    district: "",
    pincode: "",
    phoneNumber: "",
    email: "",
    moreDetails: "", // This will hold the original string-based moreDetails if present
    isApproved: false,
    subCategories: [], // Ensure this is an array
    aproxLatitude: "", // Added from sample
    aproxLongitude: "", // Added from sample
  });
  const [initialFormData, setInitialFormData] = useState(null); // To store original fetched data for cancel
  const [customDetails, setCustomDetails] = useState([{ name: '', detail: '' }]); // For the new array format
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Validate businessId early
  if (!businessId || isNaN(parseInt(businessId))) {
    return (
      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="profile-view-header">
            <h1 className="header-main-title">Invalid Business ID</h1>
        </div>
        <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>
            No valid Business ID provided in the URL.
        </p>
        <p style={{ textAlign: 'center' }}>Please go back and select a valid business profile.</p>
        <button onClick={() => navigate(-1)} className="action-button error-back-button" style={{ display: 'block', margin: '20px auto' }}>
          Back
        </button>
      </div>
    );
  }

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');
      try {
        console.log(`BusinessViewProfile: Fetching details for business ID: ${businessId}`);
        const maindetails = await getAllBusinessPartners(); // This calls your apiService
        console.log('BusinessViewProfile: Fetched API Details:', maindetails); // Log the raw API response
        const details = maindetails.find(item => item.id === Number(businessId));

        let legacyMoreDetailsString = "";
        let newCustomDetailsArray = [{ name: '', detail: '' }];

        if (details && details.moreDetails) {
          if (typeof details.moreDetails === 'string') {
            legacyMoreDetailsString = details.moreDetails;
            // Optionally, you could try to parse this string if it has a known structure,
            // or initialize customDetails with one item based on it.
            // For now, we keep them separate.
          } else if (Array.isArray(details.moreDetails) && details.moreDetails.length > 0) {
            newCustomDetailsArray = details.moreDetails;
          } else if (Array.isArray(details.moreDetails) && details.moreDetails.length === 0) {
            newCustomDetailsArray = [{ name: '', detail: '' }]; // Ensure at least one empty for editing
          }
        }


        if (details && typeof details === 'object' && Object.keys(details).length > 0) {
          // Map API response to formData structure, handling potential key differences
          const mappedDetails = {
            id: details.id || businessId,
            businessName: details.businessName || details.BusinessName || details.business_name || "",
            proprietorName: details.proprietorName || details.ProprietorName || details.proprietor_name || "",
            price: details.price !== undefined ? String(details.price) : "", // Ensure price is a string for the form
            serviceProvided: details.serviceProvided || details.ServiceProvided || details.service_provided || "",
            location: details.location || details.Location || "",
            state: details.state || details.State || "",
            district: details.district || details.District || "",
            pincode: details.pincode || details.Pincode || "",
            phoneNumber: details.phoneNumber || details.PhoneNumber || details.phone_number || "",
            email: details.email || "",
            moreDetails: legacyMoreDetailsString, // Store the original string here
            // Ensure isApproved is explicitly a boolean
            isApproved: typeof details.isApproved === 'boolean' ? details.isApproved : (typeof details.IsApproved === 'boolean' ? details.IsApproved : (typeof details.is_approved === 'boolean' ? details.is_approved : false)),
            // Ensure subCategories is always an array
            subCategories: Array.isArray(details.subCategories) ? details.subCategories : (Array.isArray(details.SubCategories) ? details.SubCategories : (Array.isArray(details.sub_categories) ? details.sub_categories : [])),
            aproxLatitude: details.aproxLatitude !== undefined ? String(details.aproxLatitude) : "",
            aproxLongitude: details.aproxLongitude !== undefined ? String(details.aproxLongitude) : "",
          };
          setFormData(mappedDetails);
          setCustomDetails(newCustomDetailsArray);
          // For cancel, we need to store both formData and customDetails
          setInitialFormData({ ...mappedDetails, customDetails: newCustomDetailsArray });
        } else {
          console.warn("Business details not found or API returned empty/invalid data for ID:", businessId, "Received:", details);
          setError(`Business details not found for ID: ${businessId}.`);
          setFormData(prev => ({ ...prev, id: businessId })); // Keep ID but clear other fields if needed
          setInitialFormData(null);
        }
      } catch (err) {
        console.error(`API Error fetching details for ID ${businessId}:`, err);
        setError(err.message || "Failed to fetch business details.");
        setInitialFormData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [businessId]); // Re-fetch if businessId changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      // Prepare payload: API should expect 'moreDetails' as the array of custom fields
      const payload = {
        ...formData,
        moreDetails: customDetails.filter(cd => cd.name && cd.detail), // Send only filled custom details
      };
      await updateBusinessDetailsAPI(businessId, payload); // This calls your apiService
      setSuccessMessage("Business details updated successfully!");
      // After successful save, update initialFormData to reflect the new saved state
      setInitialFormData({ ...formData, customDetails: customDetails.filter(cd => cd.name && cd.detail) });
      setIsEditing(false);
    } catch (err) {
      console.error("API Update Error:", err);
      setError(err.message || "Failed to update business details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page in history
  };

  const handleEditToggle = () => {
    if (isEditing && initialFormData) {
      // Revert both formData and customDetails
      const { customDetails: initialCustom, ...initialForm } = initialFormData;
      setFormData(initialForm);
      setCustomDetails(initialCustom || [{ name: '', detail: '' }]);
    }
    setIsEditing(!isEditing);
    setError(null); // Clear any previous errors when toggling edit mode
    setSuccessMessage('');
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      const updatedData = { 
        ...formData, 
        isApproved: true,
        moreDetails: customDetails.filter(cd => cd.name && cd.detail) // Send current custom details
      };
      await updateBusinessDetailsAPI(businessId, updatedData); // This calls your apiService
      setFormData(prev => ({...prev, isApproved: true})); // Update local state to reflect approval
      setInitialFormData(prev => ({...prev, isApproved: true, customDetails: customDetails.filter(cd => cd.name && cd.detail)})); // Update initial data as well
      setSuccessMessage("Business approved successfully!");
    } catch (err) {
      console.error("API Approve Error:", err);
      setError(err.message || "Failed to approve business.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoreDetailChange = (index, event) => {
    const { name, value } = event.target;
    const updatedCustomDetails = customDetails.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setCustomDetails(updatedCustomDetails);
  };

  const handleAddMoreDetailField = () => {
    setCustomDetails(prevDetails => [
      ...prevDetails,
      { name: '', detail: '' },
    ]);
  };

  const handleRemoveMoreDetailField = (index) => {
    if (customDetails.length <= 1 && !customDetails[0]?.name && !customDetails[0]?.detail) {
        // If it's the last item and it's empty, don't "remove" to an empty array, just keep it empty.
        return; 
    }
    setCustomDetails(customDetails.filter((_, i) => i !== index));
  };

  // Define available sub-category options
  const subCategoryOptions = [
    "Venue", "Catering Service", "Decorator", 
    "Photographer",  "Music Band", "DJ", "Bridal Wear", 
    "Groom Wear", "Makeup Artist", "Hair Stylist", "Invitations", 
    "Wedding Cake", "Transportation", "Return Gifts", // Add more options as needed
  ];

  const serviceOptions = [
    "All", 
    "Wedding",
    "Reception",
    "Brithday",
    "Anniversary",
    "Corporate Event",
    "Puberty Function"
  ];
  // Define fields for rendering
  const editableFields = [
    { name: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Enter business name' },
    { name: 'proprietorName', label: 'Proprietor Name', type: 'text', placeholder: 'Enter proprietor name' },
    { name: 'serviceProvided', label: 'Service Provided', type: 'select', options: serviceOptions },
    { name: 'price', label: 'Approx. Price (INR)', type: 'number', placeholder: 'e.g., 10000' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter 10-digit phone number' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter contact email' },
    { name: 'location', label: 'Full Address', type: 'textarea', placeholder: 'Enter full street address' },
    { name: 'district', label: 'District', type: 'text', placeholder: 'e.g., Coimbatore' },
    { name: 'state', label: 'State', type: 'text', placeholder: 'e.g., Tamil Nadu' },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'e.g., 641004' },
    { name: 'aproxLatitude', label: 'Approx. Latitude', type: 'text', placeholder: 'e.g., 11.03' },
    { name: 'aproxLongitude', label: 'Approx. Longitude', type: 'text', placeholder: 'e.g., 76.98' },
  ];

  // Helper function to render form fields or display text
  function renderField(fieldName) {
    const field = editableFields.find(f => f.name === fieldName);
    if (!field) return null; // isApproved is handled directly in JSX

    const value = formData[field.name];

    return (
      <div className={`form-group ${field.type === 'textarea' ? 'textarea-full-width' : ''}`} key={field.name}>
        <label htmlFor={field.name}>{field.label}</label>
        {!isEditing ? (
          <span>
            {(value !== null && value !== undefined && value !== '' ? String(value) : 'N/A')}
          </span>
        ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={value || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.name === 'location' ? 3 : 4}
              disabled={isSubmitting}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={value || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              className="form-select"
            >
              <option value="" disabled>{`Select ${field.label}`}</option>
              {field.options && field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : ( // Catches 'text', 'number', 'tel', 'email'
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={value || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              disabled={isSubmitting}
            />
          )
        }
      </div>
    );
  }

  const handleSubCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      const currentSubCategories = prevData.subCategories || [];
      if (checked) {
        // Add to array if not already present
        return { ...prevData, subCategories: [...new Set([...currentSubCategories, value])] };
      } else {
        // Remove from array
        return { ...prevData, subCategories: currentSubCategories.filter(sc => sc !== value) };
      }
    });
  };




  if (isLoading) {
    return (
      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="profile-view-header">
          <h1 className="header-main-title">Loading Business Profile...</h1>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Fetching details, please wait...</p>
      </div>
    );
  }

  if (error && !initialFormData) {
    return (
      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="profile-view-header">
          <h1 className="header-main-title">Error</h1>
        </div>
        <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>{error}</p>
        <button onClick={handleBack} className="action-button error-back-button" style={{ display: 'block', margin: '20px auto' }}>
          Back
        </button>
      </div>
    );
  }


  return (
    <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="profile-view-header">
        <button type="button" className="header-action-button back-button-header" onClick={handleBack}>
          ← Back
        </button>
        <h1 className="header-main-title">Business Profile</h1>
        <button type="button" className="header-action-button edit-button-header" onClick={handleEditToggle} disabled={isLoading || isSubmitting || !initialFormData}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && (!isEditing || (isEditing && !initialFormData)) && <p className="error-message">{error}</p>}


      {initialFormData ? ( 
        <form onSubmit={handleSubmit} className="profile-form">
          <fieldset className="form-section">
            <legend>Basic Information</legend>
            <div className="form-row-grid">
              {renderField('businessName')}
              {renderField('proprietorName')}
              {renderField('serviceProvided')}
              {renderField('price')}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Contact Information</legend>
            <div className="form-row-grid">
              {renderField('phoneNumber')}
              {renderField('email')}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Location Information</legend>
            {renderField('location')}
            <div className="form-row-grid">
              {renderField('district')}
              {renderField('state')}
              {renderField('pincode')}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Additional Details</legend>
            {formData.moreDetails && (
              <div className="form-group legacy-more-details">
                <label>Legacy Additional Details (Read-only):</label>
                <p className="read-only-text">{formData.moreDetails}</p>
              </div>
            )}

            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Custom Details:</label>
            {!isEditing ? (
              Array.isArray(customDetails) && customDetails.some(item => item.name && item.detail) ? (
                customDetails.map((item, index) =>
                  item.name && item.detail ? (
                    <div key={index} className="form-group more-detail-item-view">
                      <strong className="custom-detail-name">{item.name}:</strong>
                      <span>{item.detail}</span>
                    </div>
                  ) : null
                )
              ) : (
                <div className="form-group"><span>N/A</span></div>
              )
            ) : (
              <>
                {customDetails.map((item, index) => (
                  <div key={index} className="custom-detail-editor-item">
                    <input
                      type="text"
                      name="name"
                      className="custom-detail-input-name"
                      placeholder="Detail Name (e.g., Seating)"
                      value={item.name}
                      onChange={(e) => handleMoreDetailChange(index, e)}
                      disabled={isSubmitting}
                    />
                    <input
                      type="text"
                      name="detail"
                      className="custom-detail-input-value"
                      placeholder="Detail Value (e.g., 500 guests)"
                      value={item.detail}
                      onChange={(e) => handleMoreDetailChange(index, e)}
                      disabled={isSubmitting}
                    />
                    {(customDetails.length > 1 || (customDetails.length === 1 && (item.name || item.detail))) && (
                    <button type="button" onClick={() => handleRemoveMoreDetailField(index)} className="remove-detail-button" disabled={isSubmitting}>
                      &times;
                    </button>
                    )}
                  </div>
                ))}
              </>
            )}
            {isEditing && (
              <button type="button" onClick={handleAddMoreDetailField} className="add-detail-button" disabled={isSubmitting}>
                + Add Custom Detail
              </button>
            )}
            <div className="form-group">
              <label>Sub-Categories:</label>
              {!isEditing ? (
                <span>
                  {Array.isArray(formData.subCategories) && formData.subCategories.length > 0
                    ? formData.subCategories.join(', ')
                    : 'N/A'}
                </span>
              ) : (
                <div className="subcategories-checkbox-group">
                  {subCategoryOptions.map(option => (
                    <div key={option} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`subcategory-${option.replace(/\s+/g, '-')}`} // Create a unique ID
                        name="subCategories"
                        value={option}
                        checked={(formData.subCategories || []).includes(option)}
                        onChange={handleSubCategoryChange}
                        disabled={isSubmitting}
                        className="form-checkbox"
                      />
                      <label htmlFor={`subcategory-${option.replace(/\s+/g, '-')}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Geographical Coordinates</legend>
            <div className="form-row-grid">
              {renderField('aproxLatitude')}
              {renderField('aproxLongitude')}
            </div>
          </fieldset>
          <fieldset className="form-section">
            <legend>Admin Controls</legend>
            <div className="form-group">
              <label htmlFor="isApproved">Approval Status</label>
              {!isEditing ? (
                <span>{formData.isApproved ? 'Yes' : 'No'}</span>
              ) : (
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="isApproved"
                    name="isApproved"
                    checked={Boolean(formData.isApproved)}
                    onChange={handleChange}
                    className="form-checkbox"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </fieldset>

          {!formData.isApproved && !isEditing && (
            <div className="form-actions centered-actions">
              <button
                type="button"
                onClick={handleApprove}
                className="action-button approve-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Approving...' : 'Approve Business'}
              </button>
            </div>
          )}
          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="action-button submit-button" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
          {error && isEditing && <p className="error-message" style={{ marginTop: '10px' }}>{error}</p>}
        </form>
      ) : (
        !isLoading && <p className="error-message">Could not load business details. Please try again or contact support.</p>
      )}
    </div>
  );
}

export default BusinessViewProfile;



// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import '../styles/BusinessViewProfile.css';
// import { getBusinessDetailsById, updateBusinessDetailsAPI } from '../services/apiService';


// function BusinessViewProfile({ isSidebarOpen }) {
//   const { businessId } = useParams();
//   const navigate = useNavigate();
//   const [initialFormData, setInitialFormData] = useState(null); // To store original fetched data for cancel

//   if (!businessId) {
//     return (
//       <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <h1>Error</h1>
//         <p>No Business ID provided in the URL.</p>
//         <p>Please go back and select a valid business profile.</p>
//         <button onClick={() => navigate(-1)} className="action-button error-back-button">
//           Back
//         </button>
//       </div>
//     );
//   }

//   // Initialize formData with a structure that matches your fields
//   const [formData, setFormData] = useState({
//     id: businessId, // Keep the ID from params
//     businessName: "",
//     proprietorName: "",
//     price: "",
//     serviceProvided: "",
//     location: "",
//     state: "", 
//     district: "",
//     pincode: "",
//     phoneNumber: "",
//     email: "",
//     moreDetails: "",
//     isApproved: false,
//     subCategories: [],
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     if (businessId) {
//       const fetchDetails = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//           // In a real app, you'd call your actual API service function here
//           const details = await getBusinessDetailsById(businessId);
//           if (details) {
//             setFormData(details);
//           } else {
//             setError("Business details not found or API returned no data.");
//           }
//           setInitialFormData(details); // Store for cancel functionality
//         } catch (err) {
//           setError(err.message || "Failed to fetch business details.");
//           console.error("API Error:", err);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchDetails();
//     }
//   }, [businessId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prevData => {
//       // Ensure subCategories remains an array if it's being directly edited (though not in this form setup)
//       const newValue = type === 'checkbox' ? checked : value;
//       return {
//         ...prevData,
//         [name]: newValue,
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);
//     setSuccessMessage('');
//     try {
//       // In a real app, call your update API service
//       await updateBusinessDetailsAPI(businessId, formData);
//       setSuccessMessage("Business details updated successfully!");
//       setInitialFormData(formData); // Update initial data to current after successful save
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.message || "Failed to update business details.");
//       console.error("API Update Error:", err);
//       // alert(`Error: ${err.message || "Failed to update business details."}`); // Avoid using alert for errors
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };
//   const handleEdit = () => {
//     if (isEditing && initialFormData) {
//       setFormData(initialFormData); // Revert to original data on cancel
//     }
//     setIsEditing(!isEditing);
//     setError(null); // Clear any previous errors when toggling edit mode
//     setSuccessMessage('');
//   };

//   const handleApprove = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     setSuccessMessage('');
//     try {
//       const updatedData = { ...formData, isApproved: true };
//       await updateBusinessDetailsAPI(businessId, updatedData);
//       setFormData(updatedData); // Update local state to reflect approval
//       setInitialFormData(updatedData); // Update initial data as well
//       setSuccessMessage("Business approved successfully!");
//       // Optionally, navigate away or disable the approve button
//       // navigate('/pending-approvals'); // Or to business management
//     } catch (err) {
//       setError(err.message || "Failed to approve business.");
//       console.error("API Approve Error:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const editableFields = [
//     { name: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Enter business name' },
//     { name: 'proprietorName', label: 'Proprietor Name', type: 'text', placeholder: 'Enter proprietor name' },
//     { name: 'serviceProvided', label: 'Service Provided', type: 'text', placeholder: 'e.g., Wedding, Catering' },
//     { name: 'price', label: 'Approx. Price (INR)', type: 'text', placeholder: 'e.g., 10000' },
//     { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter 10-digit phone number' },
//     { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter contact email' },
//     { name: 'location', label: 'Full Address', type: 'textarea', placeholder: 'Enter full street address' },
//     { name: 'district', label: 'District', type: 'text', placeholder: 'e.g., Coimbatore' },
//     { name: 'state', label: 'State', type: 'text', placeholder: 'e.g., Tamil Nadu' },
//     { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'e.g., 641004' },
//     { name: 'moreDetails', label: 'Additional Details & Features', type: 'textarea', placeholder: 'Enter seating capacity, AC/Non-AC, catering options, etc.' },
//     { name: 'isApproved', label: 'Approval Status', type: 'checkbox' },
//   ];

//   if (isLoading) {
//     return (
//       <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <div className="profile-view-header">
//           <h1 className="header-main-title">Loading Business Profile...</h1>
//         </div>
//         <p style={{ textAlign: 'center' }}>Fetching details, please wait...</p>
//       </div>
//     );
//   }

//   if (error && !isEditing) { // Show main error if not in editing mode (where field-specific errors might be shown)
//     return (
//       <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <div className="profile-view-header">
//           <h1 className="header-main-title">Error</h1>
//         </div>
//         <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
//         <button onClick={handleBack} className="action-button error-back-button">
//           Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       <div className="profile-view-header">
//         <button type="button" className="header-action-button back-button-header" onClick={handleBack}>
//           ← Back
//         </button>
//         <h1 className="header-main-title">Business Profile</h1>
//         <button type="button" className="header-action-button edit-button-header" onClick={handleEdit} disabled={isLoading || isSubmitting}>
//           {isEditing ? 'Cancel' : 'Edit'}
//         </button>
//       </div>

//       {successMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
//       {/* Error message display is already handled below if error and !isEditing */}

//       <form onSubmit={handleSubmit} className="profile-form">
//         {/* Basic Information */}
//         <fieldset className="form-section">
//           <legend>Basic Information</legend>
//           <div className="form-row-grid">
//             {renderField('businessName')}
//             {renderField('proprietorName')}
//             {renderField('serviceProvided')}
//             {renderField('price')}
//           </div>
//         </fieldset>

//         {/* Contact Information */}
//         <fieldset className="form-section">
//           <legend>Contact Information</legend>
//           <div className="form-row-grid">
//             {renderField('phoneNumber')}
//             {renderField('email')}
//           </div>
//         </fieldset>

//         {/* Location Information */}
//         <fieldset className="form-section">
//           <legend>Location Information</legend>
//           {renderField('location')}
//           <div className="form-row-grid">
//             {renderField('district')}
//             {renderField('state')}
//             {renderField('pincode')}
//           </div>
//         </fieldset>

//         {/* Additional Details */}
//         <fieldset className="form-section">
//           <legend>Additional Details</legend>
//           {renderField('moreDetails')}
//           <div className="form-group">
//             <label>Sub-Categories:</label>
//             {/* Display subCategories. If they need to be editable, this part would need a more complex input. */}
//             <span>
//               {Array.isArray(formData.subCategories) && formData.subCategories.length > 0
//                 ? formData.subCategories.join(', ')
//                 : 'N/A'}
//             </span>
//           </div>
//         </fieldset>

//         {/* Admin Controls */}
//         <fieldset className="form-section">
//           <legend>Admin Controls</legend>
//           {renderField('isApproved')}
//         </fieldset>

//         {!formData.isApproved && !isEditing && (
//           <div className="form-actions" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: '10px' }}>
//             <button
//               type="button"
//               onClick={handleApprove}
//               className="action-button submit-button" // You might want a different class for approve
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Approving...' : 'Approve Business'}
//             </button>
//           </div>
//         )}
//         {isEditing && (
//           <div className="form-actions">
//             <button type="submit" className="action-button submit-button" disabled={isSubmitting || isLoading}>
//               {isSubmitting ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         )}
//         {error && isEditing && ( // Show error message below save button if in edit mode
//           <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>Error: {error}</p>
//         )}
//       </form>
//     </div>
//   );

//   function renderField(fieldName) {
//     const field = editableFields.find(f => f.name === fieldName);
//     if (!field) return null;

//     return (
//       <div className={`form-group ${field.type === 'textarea' ? 'textarea-full-width' : ''}`} key={field.name}>
//         <label htmlFor={field.name}>{field.label}</label>
//         {!isEditing ? (
//           <span>
//             {field.type === 'checkbox'
//               ? (formData[field.name] ? 'Yes' : 'No')
//               : (formData[field.name] || 'N/A')}
//           </span>
//         ) : field.type === 'textarea' ? (
//             <textarea
//               id={field.name}
//               name={field.name}
//               value={formData[field.name] || ''}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               rows={field.name === 'location' ? 3 : (field.name === 'moreDetails' ? 5 : 4)}
//               disabled={isSubmitting}
//             />
//           ) : field.type === 'checkbox' ? (
//             <div className="checkbox-wrapper">
//               <input
//                 type="checkbox"
//                 id={field.name}
//                 name={field.name}
//                 checked={Boolean(formData[field.name])} // Ensure it's a boolean
//                 onChange={handleChange}
//                 className="form-checkbox"
//                 disabled={isSubmitting}
//               />
//             </div>
//           ) : (
//             <input
//               type={field.type}
//               id={field.name}
//               name={field.name}
//               value={formData[field.name] || ''}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               disabled={isSubmitting}
//             />
//           )
//         }
//       </div>
//     );
//   }
// }

// export default BusinessViewProfile;
