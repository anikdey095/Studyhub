import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import StatCard from '@/components/dashboard/StatCard';
import NoteCard from '@/components/dashboard/NoteCard';
import { Book, Download, FileText } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="flex bg-[#0a0a0f] text-white">
      <Sidebar />
      <div className="flex-grow ml-64">
        <Topbar />
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <StatCard title="Total Notes" value="1,250" icon={<Book />} />
            <StatCard title="Total Downloads" value="8,230" icon={<Download />} />
            <StatCard title="Total Research" value="480" icon={<FileText />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Notes</h2>
              <div className="space-y-4">
                <NoteCard title="React Hooks Cheatsheet" content="A quick reference for all React hooks..." />
                <NoteCard title="Next.js 13 App Router" content="An overview of the new app router in Next.js 13..." />
                <NoteCard title="Tailwind CSS Best Practices" content="Tips and tricks for writing clean and maintainable..." />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Questions</h2>
              <div className="space-y-4">
                <NoteCard title="How to use getServerSideProps in Next.js?" content="I'm having trouble fetching data on the server..." />
                <NoteCard title="What is the best way to manage state in React?" content="I'm trying to decide between Redux and Zustand..." />
                <NoteCard title="How to deploy a Next.js app to Vercel?" content="I'm getting a build error when I try to deploy..." />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;