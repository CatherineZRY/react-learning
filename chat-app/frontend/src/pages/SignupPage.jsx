import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

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
      toast.error("Please fill in all fields");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
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
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            {/* password */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                  <Lock className='w-5 h-5 text-base-content opacity-40' />
                </div>
                <input type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center z-10 bg-transparent border-none  focus:outline-none'
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className='w-5 h-5 text-base-content opacity-40' />
                  ) : (
                    <Eye className='w-5 h-5 text-base-content opacity-40' />
                  )}
                </button>
              </div>
            </div>

            {/* submit button */}
            <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>
              {isSigningUp ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : "Create Account"}
            </button>

          </form>

          {/* already have an account */}
          <div className='text-center'>
            <p className='text-sm text-base-content/60'>Already have an account?{" "}
              <Link to='/login'
                className='link link-primary'>Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern title='Join us community'
        subTile='Contect with frinds, share moments, and stay in touch with your love ones.' />

    </div>
  )
}

export default SignupPage;