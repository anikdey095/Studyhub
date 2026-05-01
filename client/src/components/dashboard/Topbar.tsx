'use client';

import { usePathname } from 'next/navigation';

const Topbar = () => {
  const pathname = usePathname();
  const title = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <header className="flex justify-between items-center p-4 bg-[#0a0a0f] text-white">
      <h1 className="text-2xl font-bold capitalize">{title}</h1>
      <div>
        <img
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default Topbar;