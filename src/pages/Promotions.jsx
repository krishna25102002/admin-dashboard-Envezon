import { useState, useEffect } from 'react';
// import { getAllPromotions, addPromotion } from '../services/apiService'; // API calls commented out
import '../styles/Promotions.css'; // Import the new CSS file

// Sample data for UI design purposes
const samplePromotions = [
  { id: 1, businessId: 101, position: 'Homepage Top Banner', isApproved: true },
  { id: 2, businessId: 102, position: 'Sidebar Ad Slot 1', isApproved: false },
  { id: 3, businessId: 103, position: 'Featured Listing - Category Page', isApproved: true },
  { id: 4, businessId: 104, position: 'Newsletter Spotlight', isApproved: true },
];

function Promotions({ isSidebarOpen }) {
  // const [promotions, setPromotions] = useState([]); // Using sample data instead
  const [promotions, setPromotions] = useState(samplePromotions); // Initialize with sample data
  // const [loading, setLoading] = useState(true); // Assuming data is loaded for UI design
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPromotionData, setNewPromotionData] = useState({
    businessId: '',
    position: '',
    isApproved: true, // Defaulting to true as per API example, adjust if needed
  });

  const fetchPromotions = async () => {
    // setLoading(true);
    // setError(null);
    // try {
    //   // const data = await getAllPromotions();
    //   // setPromotions(data || []);
    //   console.log("API call to fetch promotions would be here.");
    // } catch (err) {
    //   console.error("Failed to fetch promotions:", err);
    //   setError(err.message);
    //   setPromotions([]);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    // fetchPromotions(); // API call commented out
    // If you want to simulate loading for UI testing, you can add a timeout here
  }, []); 

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPromotionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitNewPromotion = async (e) => {
    e.preventDefault();
    if (!newPromotionData.businessId || !newPromotionData.position) {
      alert("Business ID and Position are required.");
      return;
    }
    try {
      // Convert businessId and position to number if your API expects numbers
      const payload = {
        ...newPromotionData,
        businessId: parseInt(newPromotionData.businessId, 10),
        // position might also need to be a number, adjust as per API
      };
      // await addPromotion(payload); // API call commented out
      console.log("Simulating add promotion with payload:", payload);
      // Simulate adding to the local list for UI feedback
      setPromotions(prevPromotions => [
        ...prevPromotions,
        {
          id: Date.now(), // Temporary unique ID for UI
          ...payload
        }
      ]);
      setShowAddModal(false);
      setNewPromotionData({ businessId: '', position: '', isApproved: true }); // Reset form
      // fetchPromotions(); // Refetch promotions to show the new one - commented out
      alert("Promotion added successfully!");
    } catch (err) {
      console.error("Failed to add promotion:", err);
      setError(err.message);
      alert(`Failed to add promotion: ${err.message}`);
    }
  };
  if (loading) return <div className={`promotions-page ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}><p>Loading promotions...</p></div>;
  if (error) return <div className={`promotions-page ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}><p>Error fetching promotions: {error}</p></div>;

  return (
    <div className={`promotions-page ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>Promotions</h1>
      <div className="promotions-grid">
        {/* Add Promotion Card */}
        <div className="add-promotion-card" onClick={() => setShowAddModal(true)}>
          <span className="plus-icon">+</span>
          <p>Add New Promotion</p>
        </div>

        {/* Existing Promotion Cards */}
        {promotions.map(promo => (
          <div key={promo.id || promo.businessId + '-' + promo.position} className="promotion-card"> {/* Use a unique key */}
            <h3>Business ID: {promo.businessId}</h3>
            <p>Position: {promo.position}</p>
            <p className={`status ${promo.isApproved ? 'approved' : 'pending'}`}>
              Status: {promo.isApproved ? 'Approved' : 'Pending'}
            </p>
            {/* Add more details or actions (edit/delete) here if needed */}
          </div>
        ))}
        {promotions.length === 0 && !loading && <p>No promotions found.</p>}
      </div>

      {/* Add Promotion Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Promotion</h2>
            <form onSubmit={handleSubmitNewPromotion}>
              {/* Basic form, enhance with proper input components and validation */}
              <div>
                <label htmlFor="businessId">Business ID:</label>
                <input type="number" id="businessId" name="businessId" value={newPromotionData.businessId} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="position">Position:</label>
                <input type="text" id="position" name="position" value={newPromotionData.position} onChange={handleInputChange} required />
              </div>
              {/* Consider if isApproved should be set here or by admin logic */}
              <button type="submit">Add Promotion</button>
              <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;