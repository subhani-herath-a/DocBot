import React from 'react';




const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
    
      <div className="flex flex-1 overflow-hidden">
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4">
          {children}
        </main>
      </div>
      
    </div>
  );
};

export default DashboardLayout;
