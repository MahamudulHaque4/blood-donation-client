import { createBrowserRouter } from "react-router-dom";
import Rootlayout from "../layout/Rootlayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import Profile from "../pages/Dashboard/Profile";
import MyDonationRequest from "../pages/Dashboard/MyDonationRequest";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import PrivateRoute from "./PrivateRoute.Jsx";
import Requests from "../pages/DonationRequests/Requests";
import RequestsDetails from "../pages/DonationRequests/RequestsDetails";
// import Donors from "../pages/Donors/Donors";
import SearchDonors from "../pages/Donors/SearchDonors";
import AllDonationRequests from "../pages/dashboard/AllDonationRequests";
import VolunteerDashboardHome from "../pages/dashboard/VolunteerDashboardHome";
import VolunteerRoute from "./VolunteerRoute";
import AdminDashboardHome from "../pages/dashboard/admin/AdminDashboardHome";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageDonationRequests from "../pages/dashboard/admin/ManageDonationRequest";
import Funding from "../pages/Funding/Funding";
import ManageFundings from "../pages/dashboard/admin/ManageFundings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
    children: [
      { index: true, Component: Home },

      { path: "donation-requests", Component: Requests },
      { path: "donation-requests/:id", Component: RequestsDetails },
      { path: "search-donors", Component: SearchDonors },
      { path: "fundings", Component: Funding },
    ],
  },

  
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },

  
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      { path: "my-donation-requests", element: <MyDonationRequest /> },
      {
        path: "volunteer",
        element: (
          <VolunteerRoute>
            <VolunteerDashboardHome />
          </VolunteerRoute>
        ),
      },
      {
        path: "all-donation-requests",
        element: (
          <VolunteerRoute>
            <AllDonationRequests />
          </VolunteerRoute>
        ),
      },
      //   Admin routes can be added here
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboardHome />
          </AdminRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/donation-requests",
        element: (
          <AdminRoute>
            <ManageDonationRequests />
          </AdminRoute>
        ),
      },
      {
        path: "admin/fundings",
        element: (
          <AdminRoute>
            <ManageFundings />
          </AdminRoute>
        ),
      },
    ],
  },
]);
