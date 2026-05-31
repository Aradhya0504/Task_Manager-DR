import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Top color banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-blue-500"></div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-700 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>

          <hr className="my-5 border-gray-100" />

          <button
            onClick={logout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 rounded-xl text-sm transition-colors border border-red-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
