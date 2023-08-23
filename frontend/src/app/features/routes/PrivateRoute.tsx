import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import Loader from "../../utils/Loader";
import { useAppSelector } from "../../hooks";
import { selectAccessToken } from "../sessions/sessionSlice";

function PrivateRoute({ children }: any) {
  const loading = useAppSelector((state) => state.session.loading);
  const accessToken = useAppSelector(selectAccessToken);

  const location = useLocation();
  const fromLocation = (location.state as any)?.from;
  const previousLocation = location.state
    ? fromLocation
    : { pathname: "/login" };

  if (accessToken) {
    return children;
  } else if (loading) {
    return <Loader />;
  } else if (!accessToken && !loading) {
    return <Navigate to={previousLocation} state={fromLocation} replace />;
  } else {
    return <p>Something went wrong</p>;
  }
}

export default PrivateRoute;
