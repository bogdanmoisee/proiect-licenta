import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../store";
import Loader from "../../utils/Loader";
import { useAppSelector } from "../../hooks";
import { selectAccessToken } from "../sessions/sessionSlice";

function PublicOnlyRoute({ children }: any) {
  const accessToken = useAppSelector(selectAccessToken);
  const loading = useAppSelector((state) => state.session.loading);
  const location = useLocation();
  const fromLocation = (location.state as any)?.from;
  const previousLocation = location.state ? fromLocation : { pathname: "/" };

  if (!accessToken && !loading) {
    return children;
  } else if (loading) {
    return <Loader />;
  } else if (accessToken && !loading) {
    return <Navigate to={previousLocation} state={fromLocation} replace />;
  } else {
    return <p>Something went wrong</p>;
  }
}

export default PublicOnlyRoute;
