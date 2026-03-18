import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Content */}
      <main className="container mx-auto lg:px-4 md:px-2 sm:px-1 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;