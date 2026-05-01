const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <ul>
        <li className="mb-2"><a href="#" className="hover:text-pink-500">Total Notes</a></li>
        <li className="mb-2"><a href="#" className="hover:text-pink-500">Total Downloads</a></li>
        <li className="mb-2"><a href="#" className="hover:text-pink-500">Total Research</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;