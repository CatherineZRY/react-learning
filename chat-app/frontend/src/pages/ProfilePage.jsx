import { useAuthStore } from '../store/useAuthStore';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { User, Mail, Loader2 } from 'lucide-react';

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    profilePic: authUser.profilePic,
    fullName: authUser.fullName,
    email: authUser.email,// 此项不允许修改
  });


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setFormData({ ...formData, profilePic: base64Image });
      console.log('formData:', formData);
    }
    reader.readAsDataURL(file);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log('formData:', formData);
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const requestData = {
      profilePic: formData.profilePic,
      fullName: formData.fullName,
    }
    await updateProfile(requestData);
  }

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your profile information</p>
          </div>

          {/* avatar update section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img src={formData.profilePic || authUser.profilePicture || '\\avatar.png'}
                alt='avatar'
                className='size-32 rounded-full object-cover border-4' />
              <label htmlFor="avatar-upload" className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}
                `}>
                <Camera className='w-5 h-5 text-base-200' />
                <input type="file"
                  id="avatar-upload"
                  name="avatar-upload"
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className='text-sm text-size-400'>
              {isUpdatingProfile ? 'Uploading...' : 'Click the camera to upload'}
            </p>
          </div>

          {/* profile update section */}
          <div className='space-y-6'>
            {/* full name */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                  <User className='w-5 h-5 text-base-content opacity-40' />
                </div>
                <input type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* email */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                  <Mail className='w-5 h-5 text-base-content opacity-40' />
                </div>
                <input type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="john.doe@example.com"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* account information */}
            <div className='mt-6 bg-base-300 rounded-b-xl p-6'>
              <h2 className='text-lg font-medium mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                  <span>Member since</span>
                  <span>{authUser.createdAt?.split('T')[0]}</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account status</span>
                  <span className={`${authUser.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {authUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

              </div>
            </div>

            {/* submit button */}
            <button type='button'
              className='btn btn-primary w-full'
              disabled={isUpdatingProfile}
              onClick={handleUpdateProfile}>
              {isUpdatingProfile ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : "Update Profile"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage;