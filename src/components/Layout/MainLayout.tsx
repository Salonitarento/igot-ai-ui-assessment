import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = ({ userDetails, isAuthorized }) => {

  // Prevent flash before auth check completes
  if (isAuthorized === undefined || isAuthorized === null) {
    return null; // or loader
  }
   const handleBack = async () => {
   const resetUrl = `/apis/reset`;
    window.location.href = resetUrl;
};
  return (
    <div className="min-h-screen bg-background">
      {isAuthorized ? (
        <>
          <Header userDetails={userDetails} />

          <main className="container mx-auto lg:px-4 md:px-2 sm:px-1 py-6">
            <Outlet />
          </main>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Unauthorized Access
            </h1>

            <p className="text-muted-foreground mb-6">
              You are not authorized to use this app.
            </p>

            <button
              onClick={handleBack}
              className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;