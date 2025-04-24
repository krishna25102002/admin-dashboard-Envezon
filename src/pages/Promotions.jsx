function Promotions({ isSidebarOpen }) {
    return (
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <h1>Promotions Page</h1>
        <p>This is a placeholder for the Promotions page.</p>
      </div>
    );
  }

  export default Promotions;