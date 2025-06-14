import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import AppLayout from "./layouts/AppLayout";
import ProtectedRouter from "./routes/ProtectedRouter";
import "./App.css";

// Lazy-loaded components
const Landing = lazy(() => import("./pages/Landingpage/Landing"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const Signup = lazy(() => import("./pages/signUp/Signup"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ResourcesContainer = lazy(() => import("./containers/resources/ResourcesContainer"));
const TeamSpaceDashboard = lazy(() => import("./pages/teamSpace/TeamSpaceDashboard"));
const JoinTeamSpace = lazy(() => import("./pages/teamSpace/JoinTeamSpace"));
const TeamSpaceResourcesContainer = lazy(() => import("./containers/teamSpaces/TeamSpaceResourcesContainer"));

// Fallback loader component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner-circle"></div>
      <div className="spinner-text">Loading...</div>
    </div>
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Landing />
            </Suspense>
          ),
        },
        {
          path: "/auth",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <AuthPage />
            </Suspense>
          ),
        },
        {
          path: "/sign-up",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Signup />
            </Suspense>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            </ProtectedRouter>
          ),
        },
        {
          path: "/dashboard/:id",
          element: (
            <ProtectedRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <ResourcesContainer />
              </Suspense>
            </ProtectedRouter>
          ),
        },
        {
          path: "/space/:spaceId",
          element: (
            <ProtectedRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <TeamSpaceDashboard />
              </Suspense>
            </ProtectedRouter>
          ),
        },
        {
          path: "/space/:spaceId/category/:categoryId",
          element: (
            <ProtectedRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <TeamSpaceResourcesContainer />
              </Suspense>
            </ProtectedRouter>
          ),
        },
        {
          path: "/join/:joinToken",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <JoinTeamSpace />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;