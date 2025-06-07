import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BusinessViewProfile.css';
import { getBusinessDetailsById, updateBusinessDetailsAPI } from '../services/apiService';


function BusinessViewProfile({ isSidebarOpen }) {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState(null); // To store original fetched data for cancel

  if (!businessId) {
    return (
      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <h1>Error</h1>
        <p>No Business ID provided in the URL.</p>
        <p>Please go back and select a valid business profile.</p>
        <button onClick={() => navigate(-1)} className="action-button error-back-button">
          Back
        </button>
      </div>
    );
  }

  // Initialize formData with a structure that matches your fields
  const [formData, setFormData] = useState({
    id: businessId, // Keep the ID from params
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
    moreDetails: "",
    isApproved: false,
    subCategories: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (businessId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // In a real app, you'd call your actual API service function here
          const details = await getBusinessDetailsById(businessId);
          if (details) {
            setFormData(details);
          } else {
            setError("Business details not found or API returned no data.");
          }
          setInitialFormData(details); // Store for cancel functionality
        } catch (err) {
          setError(err.message || "Failed to fetch business details.");
          console.error("API Error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [businessId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => {
      // Ensure subCategories remains an array if it's being directly edited (though not in this form setup)
      const newValue = type === 'checkbox' ? checked : value;
      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      // In a real app, call your update API service
      await updateBusinessDetailsAPI(businessId, formData);
      setSuccessMessage("Business details updated successfully!");
      setInitialFormData(formData); // Update initial data to current after successful save
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update business details.");
      console.error("API Update Error:", err);
      // alert(`Error: ${err.message || "Failed to update business details."}`); // Avoid using alert for errors
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleEdit = () => {
    if (isEditing && initialFormData) {
      setFormData(initialFormData); // Revert to original data on cancel
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
      const updatedData = { ...formData, isApproved: true };
      await updateBusinessDetailsAPI(businessId, updatedData);
      setFormData(updatedData); // Update local state to reflect approval
      setInitialFormData(updatedData); // Update initial data as well
      setSuccessMessage("Business approved successfully!");
      // Optionally, navigate away or disable the approve button
      // navigate('/pending-approvals'); // Or to business management
    } catch (err) {
      setError(err.message || "Failed to approve business.");
      console.error("API Approve Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editableFields = [
    { name: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Enter business name' },
    { name: 'proprietorName', label: 'Proprietor Name', type: 'text', placeholder: 'Enter proprietor name' },
    { name: 'serviceProvided', label: 'Service Provided', type: 'text', placeholder: 'e.g., Wedding, Catering' },
    { name: 'price', label: 'Approx. Price (INR)', type: 'text', placeholder: 'e.g., 10000' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter 10-digit phone number' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter contact email' },
    { name: 'location', label: 'Full Address', type: 'textarea', placeholder: 'Enter full street address' },
    { name: 'district', label: 'District', type: 'text', placeholder: 'e.g., Coimbatore' },
    { name: 'state', label: 'State', type: 'text', placeholder: 'e.g., Tamil Nadu' },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'e.g., 641004' },
    { name: 'moreDetails', label: 'Additional Details & Features', type: 'textarea', placeholder: 'Enter seating capacity, AC/Non-AC, catering options, etc.' },
    { name: 'isApproved', label: 'Approval Status', type: 'checkbox' },
  ];

  if (isLoading) {
    return (
      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="profile-view-header">
          <h1 className="header-main-title">Loading Business Profile...</h1>
        </div>
        <p style={{ textAlign: 'center' }}>Fetching details, please wait...</p>
      </div>
    );
  }

  if (error && !isEditing) { // Show main error if not in editing mode (where field-specific errors might be shown)
    return (
      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="profile-view-header">
          <h1 className="header-main-title">Error</h1>
        </div>
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
        <button onClick={handleBack} className="action-button error-back-button">
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
        <button type="button" className="header-action-button edit-button-header" onClick={handleEdit} disabled={isLoading || isSubmitting}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {successMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
      {/* Error message display is already handled below if error and !isEditing */}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Basic Information */}
        <fieldset className="form-section">
          <legend>Basic Information</legend>
          <div className="form-row-grid">
            {renderField('businessName')}
            {renderField('proprietorName')}
            {renderField('serviceProvided')}
            {renderField('price')}
          </div>
        </fieldset>

        {/* Contact Information */}
        <fieldset className="form-section">
          <legend>Contact Information</legend>
          <div className="form-row-grid">
            {renderField('phoneNumber')}
            {renderField('email')}
          </div>
        </fieldset>

        {/* Location Information */}
        <fieldset className="form-section">
          <legend>Location Information</legend>
          {renderField('location')}
          <div className="form-row-grid">
            {renderField('district')}
            {renderField('state')}
            {renderField('pincode')}
          </div>
        </fieldset>

        {/* Additional Details */}
        <fieldset className="form-section">
          <legend>Additional Details</legend>
          {renderField('moreDetails')}
          <div className="form-group">
            <label>Sub-Categories:</label>
            {/* Display subCategories. If they need to be editable, this part would need a more complex input. */}
            <span>
              {Array.isArray(formData.subCategories) && formData.subCategories.length > 0
                ? formData.subCategories.join(', ')
                : 'N/A'}
            </span>
          </div>
        </fieldset>

        {/* Admin Controls */}
        <fieldset className="form-section">
          <legend>Admin Controls</legend>
          {renderField('isApproved')}
        </fieldset>

        {!formData.isApproved && !isEditing && (
          <div className="form-actions" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={handleApprove}
              className="action-button submit-button" // You might want a different class for approve
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
        {error && isEditing && ( // Show error message below save button if in edit mode
          <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>Error: {error}</p>
        )}
      </form>
    </div>
  );

  function renderField(fieldName) {
    const field = editableFields.find(f => f.name === fieldName);
    if (!field) return null;

    return (
      <div className={`form-group ${field.type === 'textarea' ? 'textarea-full-width' : ''}`} key={field.name}>
        <label htmlFor={field.name}>{field.label}</label>
        {!isEditing ? (
          <span>
            {field.type === 'checkbox'
              ? (formData[field.name] ? 'Yes' : 'No')
              : (formData[field.name] || 'N/A')}
          </span>
        ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.name === 'location' ? 3 : (field.name === 'moreDetails' ? 5 : 4)}
              disabled={isSubmitting}
            />
          ) : field.type === 'checkbox' ? (
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={Boolean(formData[field.name])} // Ensure it's a boolean
                onChange={handleChange}
                className="form-checkbox"
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              disabled={isSubmitting}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessViewProfile;
