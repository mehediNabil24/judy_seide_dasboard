import React from 'react';

const Chat: React.FC = () => {
  const handleOpenTawkDashboard = () => {
    window.open('https://dashboard.tawk.to/#/monitoring', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex justify-center items-center h-full">
      <button
        onClick={handleOpenTawkDashboard}
        className="px-6 py-3 mt-10 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded-lg shadow-md transition duration-300"
      >
        Open Tawk.to Admin Chat
      </button>
    </div>
  );
};

export default Chat;
