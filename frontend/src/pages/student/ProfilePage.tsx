import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Mail, Phone, Building, Calendar, Edit3, CheckCircle2, X, Camera, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable Form State - Synced with Logged In User
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [registerNo, setRegisterNo] = useState(user?.registerNo || user?.employeeId || '');
  const [department, setDepartment] = useState(user?.department || 'Information Technology');
  const [college, setCollege] = useState(user?.college || 'Karpagam Institute of Technology');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar && typeof user.avatar === 'string' && !user.avatar.includes('images.unsplash.com') ? user.avatar : '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRegisterNo(user.registerNo || user.employeeId || '');
      setDepartment(user.department || 'Information Technology');
      setCollege(user.college || 'Karpagam Institute of Technology');
      setPhone(user.phone || '');
      setAvatar(user.avatar && typeof user.avatar === 'string' && !user.avatar.includes('images.unsplash.com') ? user.avatar : '');
    }
  }, [user]);

  // Gallery Profile Picture Picker Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file from your gallery.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateUserProfile({
        name,
        email,
        registerNo,
        department,
        college,
        phone,
        avatar
      });

      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto text-slate-900 bg-slate-50 min-h-screen font-sans">
      {/* Hidden File Input for Gallery Image Picker */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <UserIcon className="w-5 h-5 text-purple-600" />
            My Profile & Account Settings
          </h1>
          <p className="text-xs text-slate-600 font-semibold">View and update your academic credentials and contact details</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile credentials & avatar updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
          <X className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* User Avatar & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div
              className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (isEditing) fileInputRef.current?.click();
              }}
              title={isEditing ? 'Click to select new profile picture from gallery' : undefined}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-600 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-purple-100 border-2 border-purple-600 flex items-center justify-center text-purple-700 shadow-md">
                  <UserIcon className="w-10 h-10 text-purple-600" />
                </div>
              )}
              {/* Camera Icon Overlay ONLY rendered when inside Edit Mode */}
              {isEditing && (
                <div className="absolute inset-0 bg-slate-900/50 rounded-2xl flex flex-col items-center justify-center text-white transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-[9px] font-bold mt-0.5">Change</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{name || 'Smart Campus User'}</h2>
              <p className="text-xs text-purple-700 font-semibold">{registerNo || 'ID / Register No'}</p>
              <span className="inline-block px-3 py-1 mt-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                {user?.role || 'STUDENT'} PORTAL
              </span>
            </div>
          </div>

          {/* Upload Button ONLY shown inside Edit Mode */}
          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Upload Photo from Gallery</span>
            </button>
          )}
        </div>

        {/* Profile Details Grid (Interactive Edit Form) */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Avatar Field Card (ONLY visible when editing) */}
          {isEditing && (
            <div className="md:col-span-2 p-4 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">PROFILE PICTURE AVATAR</span>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Upload a new photo from your device gallery</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Choose File
              </button>
            </div>
          )}

          {/* Full Name */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</span>
            {!isEditing ? (
              <p className="text-xs font-bold text-slate-900">{name || 'N/A'}</p>
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                required
              />
            )}
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</span>
            {!isEditing ? (
              <p className="text-xs font-bold text-slate-900">{email || 'N/A'}</p>
            ) : (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                required
              />
            )}
          </div>

          {/* Department */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Department</span>
            {!isEditing ? (
              <p className="text-xs font-bold text-slate-900">{department || 'N/A'}</p>
            ) : (
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                required
              />
            )}
          </div>

          {/* Institution / College */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Institution / College</span>
            {!isEditing ? (
              <p className="text-xs font-bold text-slate-900">{college || 'N/A'}</p>
            ) : (
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                required
              />
            )}
          </div>

          {/* Register / ID Number */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Register / ID Number</span>
            {!isEditing ? (
              <p className="text-xs font-bold text-slate-900">{registerNo || 'N/A'}</p>
            ) : (
              <input
                type="text"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                required
              />
            )}
          </div>

          {/* Contact Phone Number */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contact Phone</span>
            {!isEditing ? (
              <p className="text-xs font-bold text-slate-900">{phone || 'Not Provided'}</p>
            ) : (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
              />
            )}
          </div>

          {isEditing && (
            <div className="md:col-span-2 pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
