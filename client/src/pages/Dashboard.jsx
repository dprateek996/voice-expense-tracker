import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

const Dashboard = () => {
  return (
    // This grid is the key: it's a single column on mobile, and two columns on medium screens and up.
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <TopNav />
        {/* This main content area now has proper padding that adapts to screen size */}
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;