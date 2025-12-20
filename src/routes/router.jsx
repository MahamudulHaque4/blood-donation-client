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

export const router = createBrowserRouter([
    {
        path : "/",
        Component : Rootlayout,
        children : [{
            index: true,
            Component : Home
         }
        ]
    },
    {
        path : "/",
        Component : AuthLayout,
        children : [
            {
                path: "/login",
                Component: Login
            },
            {
                path: "/register",
                Component: Register
            },
        ],
    },

    // Dashboard
    {path : "/dashboard",
        element : (
            <PrivateRoute> 
                <DashboardLayout />
            </PrivateRoute>
        ),
        children : [
            {
                index : true,
                element : <DashboardHome /> 
            },
            {
                path : "profile",
                element : <Profile />
            },
            {
                path : "create-donation-request",
                element : <CreateDonationRequest />
            },
            {
                path : "my-donation-request",
                element : <MyDonationRequest />
            },
        ],
    },
]);
