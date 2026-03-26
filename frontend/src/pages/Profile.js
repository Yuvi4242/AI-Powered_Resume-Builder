import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { FiUser, FiMail, FiEdit2, FiCheck } from 'react-icons/fi';

const Profile = () => {
  const [formData, setFormData] = useState({ name: 'Jane Doe', email: 'jane@example.com' });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">Profile</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Manage your personal information.</p>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner shrink-0">
            {formData.name.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
          </div>
          <Button variant={editing ? "secondary" : "primary"} onClick={() => setEditing(!editing)} className="gap-2 shrink-0">
            <FiEdit2 /> {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                disabled={!editing}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                disabled={!editing}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {editing && (
            <div className="pt-4">
              <Button onClick={handleSave} className="gap-2 px-8">
                <FiCheck /> Save Changes
              </Button>
            </div>
          )}

          {saved && !editing && (
            <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <FiCheck /> Profile updated successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
