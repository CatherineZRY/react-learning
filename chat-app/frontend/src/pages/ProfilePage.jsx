import { useAuthStore } from '../store/useAuthStore';

function ProfilePage() {

  const { authUser } = useAuthStore();
  return (
    <div>
      <h1>ProfilePage</h1>
    </div>
  )
}

export default ProfilePage;