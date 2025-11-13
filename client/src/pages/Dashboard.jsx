import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <TopNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}