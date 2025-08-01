import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users, Loader } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState, useRef } from 'react';

function Sidebar() {
  const { users, getUsers, selectedUser, setSelectedUser, isUserLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;
  const filterUserListRef = useRef(null);
  const filterUserContainerRef = useRef(null);
  const PULL_THRESHOLD = 50;      // 触发刷新的最小距离
  const MAX_PULL_DISTANCE = 70;  // 最大下拉距离
  const RESISTANCE_FACTOR = 0.6;  // 阻力系数（越小阻力越大）
  const [pullState, setPullState] = useState({
    isPulling: false,
    startY: 0,
    currentY: 0,
    distance: 0,
  });

  const handleTouchStart = (e) => {
    if (filterUserContainerRef.current.scrollTop === 0) {
      setPullState({
        isPulling: true,
        startY: e.touches[0].clientY,
        currentY: e.touches[0].clientY,
        distance: 0,
      })
    }
  }

  const handleTouchMove = (e) => {
    if (pullState.isPulling) {
      // 更新移动状态
      setPullState((lastState) => {
        const distance = e.touches[0].clientY - lastState.startY;
        // 需要移动的实际举例
        const needTranslateY = Math.min(distance * RESISTANCE_FACTOR, MAX_PULL_DISTANCE);
        translateUserListFromTop(needTranslateY);
        return {
          isPulling: true,
          startY: lastState.startY,
          currentY: e.touches[0].clientY,
          distance: distance,
        }
      })

    }
  }

  const translateUserListFromTop = (distance) => {
    if (filterUserListRef.current) {
      filterUserListRef.current.style.transform = `translateY(${distance}px)`;
    }
  }

  const handleTouchEnd = () => {
    // 重新置顶
    setPullState((lastState) => {
      if (lastState.isPulling) {
        const distance = lastState.currentY - lastState.startY;
        const actualDistance = distance * RESISTANCE_FACTOR;
        checkCanRefreshUserList(actualDistance);
      }
      translateUserListFromTop(0);
      return {
        isPulling: false,
        startY: 0,
        currentY: 0,
        distance: 0,
      }
    })
  }

  const checkCanRefreshUserList = (actualDistance) => {
    if (actualDistance > PULL_THRESHOLD) {
      getUsers();
    }
  }


  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading && users.length === 0) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className='h-fulol w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2'>
          <Users className="size-6"></Users>
          <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
        {/*  online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3" ref={filterUserContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={filterUserListRef}>
          {
            (pullState.isPulling || isUserLoading) &&
            <div className="flex justify-center items-center h-7">
              <Loader className={`w-10 h-10 ${isUserLoading ? "animate-spin" : ""}`} />
            </div>
          }
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {onlineUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>

    </aside>
  )
}

export default Sidebar;