import { useEffect } from "react";
import { getMe } from "../services/auth.service";
import { useAppDispatch } from "../store/hooks";
import { setLoading, setUser } from "../store/authSlice";

const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const response = await getMe();

        dispatch(setUser(response.user));
      } catch (error) {
        localStorage.removeItem("accessToken");
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default useAuth;