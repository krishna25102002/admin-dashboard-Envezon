import { useLocation } from 'react-router-dom';
import './ViewBill.css';

function ViewBill() {
  const location = useLocation();
  const { state } = location;

  // Simulated Razorpay payment data (replace with actual backend data)
  const razorpayData = state?.billData || {
    payment_id: 'pay_1234567890',
    amount: 2900, // Razorpay amount is in paisa (e.g., 2900 paisa = 29.00 INR)
    currency: 'INR',
    status: 'captured', // Possible values: created, authorized, captured, refunded, failed
    created_at: 1696118400, // Unix timestamp
    method: 'upi', // e.g., card, netbanking, wallet, upi
    email: 'john@gmail.com',
    contact: '1234567890',
    description: 'Payment for 3 Months Plan',
  };

  // Convert Razorpay amount (in paisa) to INR
  const amountInRupees = (razorpayData.amount / 100).toFixed(2);

  // Convert Unix timestamp to readable date
  const paymentDate = new Date(razorpayData.created_at * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="view-bill-container">
      <div className="view-bill-header">
        <h2>Evnazon - Bill Details (Razorpay)</h2>
        <button className="close-button" onClick={() => window.history.back()}>×</button>
      </div>
      <div className="bill-details">
        <div className="detail-row">
          <span>Payment ID</span>
          <span>{razorpayData.payment_id}</span>
        </div>
        <div className="detail-row">
          <span>Amount</span>
          <span>{razorpayData.currency} {amountInRupees}</span>
        </div>
        <div className="detail-row">
          <span>Status</span>
          <span>{razorpayData.status.charAt(0).toUpperCase() + razorpayData.status.slice(1)}</span>
        </div>
        <div className="detail-row">
          <span>Date</span>
          <span>{paymentDate}</span>
        </div>
        <div className="detail-row">
          <span>Payment Method</span>
          <span>{razorpayData.method.charAt(0).toUpperCase() + razorpayData.method.slice(1)}</span>
        </div>
        <div className="detail-row">
          <span>Email</span>
          <span>{razorpayData.email}</span>
        </div>
        <div className="detail-row">
          <span>Contact</span>
          <span>{razorpayData.contact}</span>
        </div>
        <div className="detail-row">
          <span>Description</span>
          <span>{razorpayData.description}</span>
        </div>
      </div>
      <button className="download-button" onClick={() => alert('Download PDF initiated!')}>
        Download PDF
      </button>
    </div>
  );
}

export default ViewBill;