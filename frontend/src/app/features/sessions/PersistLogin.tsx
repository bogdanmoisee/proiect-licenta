import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { refreshAccessToken, selectAccessToken } from "./sessionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Loader from "../../utils/Loader";

function PersistLogin() {
  const loading = useAppSelector((state) => state.session.loading);
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector((state) => state.session.refreshToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function verifyRefreshToken() {
      try {
        dispatch(refreshAccessToken(refreshToken));
      } catch (error) {
        console.log(error);
      }
    }
    if (!accessToken) {
      verifyRefreshToken();
    }
  }, [accessToken, refreshToken]);

  return <>{loading ? <Loader /> : <Outlet />}</>;
}

export default PersistLogin;
