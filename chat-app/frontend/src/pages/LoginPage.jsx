import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, isLoggingIn, authUser } = useAuthStore();

  // 监听 authUser 变化，当用户登录成功后跳转到首页
  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await login(formData);
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
            <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
            <p className='text-base-content/60'>Sign in to your account to continue</p>

          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
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
                  onChange={(e) => handleChange(e)}
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
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
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
            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
              {isLoggingIn ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : "Login"}
            </button>

          </form>

          {/* already have an account */}
          <div className='text-center'>
            <p className='text-sm text-base-content/60'>Don't have an account?{" "}
              <Link to='/signup'
                className='link link-primary'>Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern title='Welcome Back!'
        subTile='Sign in to your account to continue.' />

    </div>
  )
}

export default LoginPage;