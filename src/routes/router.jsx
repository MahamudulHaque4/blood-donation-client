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
import Donors from "../pages/Donors/Donors";
import SearchDonors from "../pages/Donors/SearchDonors";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
    children: [
      { index: true, Component: Home },

      // ✅ Public Requests Pages
      { path: "donation-requests", Component: Requests },
      { path: "donation-requests/:id", Component: RequestsDetails },
    //   { path: "donors", Component: Donors },
      { path: "donors", Component: SearchDonors },
    ],
  },

  // ✅ Auth Pages
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },

  // ✅ Dashboard (private)
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
    ],
  },
]);
