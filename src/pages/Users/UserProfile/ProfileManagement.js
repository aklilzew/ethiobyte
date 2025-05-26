import { useEffect, useState } from 'react';
import api from '../../../api/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    first_name: '',
    last_name: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
    
        const response = await api.auth.getProfile(token);  // <-- Pass the token if needed
        setProfile(response.data);
        setUpdatedProfile({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.auth.updateProfile(updatedProfile);
      setProfile(response.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading Profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white border rounded-xl shadow-lg">
      <div className="flex flex-col items-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover shadow mb-4 border"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
            No Avatar
          </div>
        )}
        <h1 className="text-3xl font-semibold text-blue-700 mb-2">Welcome, {profile.username}</h1>
        <p className="text-gray-500">{profile.email}</p>
      </div>
  
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div><strong>ID:</strong> {profile.id}</div>
        <div><strong>Role:</strong> {profile.role}</div>
        <div><strong>First Name:</strong> {profile.first_name || 'Not Provided'}</div>
        <div><strong>Last Name:</strong> {profile.last_name || 'Not Provided'}</div>
      </div>
  
      {editing && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <input
                type="text"
                name="first_name"
                value={updatedProfile.first_name}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={updatedProfile.last_name}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  
      {!editing && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition"
          >
            Edit Profile
          </button>
        </div>
      )}
  
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
    </div>
  );
  };

export default Profile;
