import axiosBaseApi from "@/axiosConfig";
import Loading from "@/Components/UI/Loading";
import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";
import { USER_LOGIN } from "@/Redux/Actions/UserAction";
import { rootReducer } from "@/utils/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ValidateSocialLogin = () => {
  const session = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state: rootReducer) => state.userReducer);

  useEffect(() => {
    const tempSession: any = session.data;
    console.log(tempSession);
    if (tempSession?.token) {
      connectSocial(tempSession.token);
    }
  }, [session]);

  useEffect(() => {
    if (userState.name) {
      router.replace("/");
    }
  }, [userState]); // eslint-disable-line

  const connectSocial = async (token: any) => {
    const {
      data: { data, message },
    } = await axiosBaseApi.post("user/connectSocial", {
      ...token,
      photo: token?.picture,
    });
    dispatch({
      type: TOAST_SHOW,
      payload: { message },
    });
    dispatch({
      type: USER_LOGIN,
      payload: { ...data.userData, accessToken: data.accessToken },
    });
  };

  return <Loading />;
};

export default ValidateSocialLogin;
