import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare } from 'lucide-react';
import { User } from 'lucide-react';

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: ""
  });
  const { isSigningUp, signup } = useAuthStore();
  const validateForm = () => {
    const { email, fullName, password } = formData;
    if (!email || !fullName || !password) {
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await signup(formData);
  }


  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col items-center justify-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className='size-6 text-primary' />
            </div>
            <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
            <p className='text-base-content/60'>Get started with your free account</p>

          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='size-5 text-gray-400' />
                </div>
                <input type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default SignupPage;