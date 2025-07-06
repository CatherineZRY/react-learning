import { useAuthStore } from '../store/useAuthStore';

function Navbar() {

  const { authUser, isCheckingAuth } = useAuthStore();
  return (
    <div>
      <h1>Navbar</h1>
    </div>
  )
}

export default Navbar;