import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log("PrivateRoute location:", location);

  // if (loading) {
  //   return (
  //     <LoadingSpinner
  //       fullScreen
  //       label="Checking authentication..."
  //     />
  //   );
  // }

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-base-100">
        <Loader size="lg" label="Checking authentication..." center />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
