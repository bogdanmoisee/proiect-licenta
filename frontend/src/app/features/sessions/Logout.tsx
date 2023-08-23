import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./sessionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.session.refreshToken);

  useEffect(() => {
    if (refreshToken) {
      dispatch(logoutUser(refreshToken));
    }
    navigate("/login");
  }, [refreshToken]);

  return <div>Logout</div>;
}

export default Logout;
