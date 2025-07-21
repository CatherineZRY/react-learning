import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, LogOut } from 'lucide-react';

function Navbar() {
  const { authUser, logout } = useAuthStore();
  return (
    <header className='navbar bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center justify-between h-full'>
            <Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all group'>
              <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='w-6 h-6 text-primary' />
              </div>
              <h1 className='text-xl font-bold'>Chatty</h1>
            </Link>
          </div>

          <div className='flex iten-center gap-2'>
            {/* settings btn */}
            <Link to={'/settings'} className='btn btn-sm btn-outline'>
              <Settings className='w-4 h-4' />
              <span className='hidden sm:inline'>Settings</span>
            </Link>
            {/* profile btn */}
            <Link to={'/profile'} className='btn btn-sm btn-outline'>
              <Settings className='w-4 h-4' />
              <span className='hidden sm:inline'>Profile</span>
            </Link>
            {authUser && (
              <button onClick={logout}
                className='btn btn-sm flex items-center gap-2'>
                <LogOut className='w-4 h-4' />
                <span className='hidden sm:inline'>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;