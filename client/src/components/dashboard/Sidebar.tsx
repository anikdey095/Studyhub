'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Book, Briefcase, Home, Landmark, Users } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Study', href: '/study', icon: Book },
    { name: 'Research', href: '/research', icon: Landmark },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Network', href: '/network', icon: Users },
    { name: 'Mentorship', href: '/mentorship', icon: BarChart },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f0f15] text-white p-4 fixed">
      <div className="text-2xl font-bold mb-10">StudyHub</div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link href={item.href} className={`flex items-center p-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'hover:bg-gray-800'}`}>
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;