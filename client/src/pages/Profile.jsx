import useAuth from '../hooks/useAuth';
import Button from '../components/Button';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <Button variant="danger" onClick={logout} className="w-full justify-center">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
