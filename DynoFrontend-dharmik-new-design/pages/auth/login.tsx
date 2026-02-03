// import Panel from "@/Components/UI/Panel";
// import {
//   Box,
//   Button,
//   Collapse,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   Grid,
//   IconButton,
//   Radio,
//   RadioGroup,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Wallet from "@/assets/Images/wallet.png";
// import FormManager from "@/Components/Page/Common/FormManager";
// import {
//   Apple,
//   Google,
//   Password,
//   Telegram,
//   VisibilityOffRounded,
//   VisibilityRounded,
// } from "@mui/icons-material";

// import * as yup from "yup";
// import { UserAction } from "@/Redux/Actions";
// import {
//   USER_CONFIRM_CODE,
//   USER_EMAIL_CHECK,
//   USER_LOGIN,
//   USER_SEND_OTP,
// } from "@/Redux/Actions/UserAction";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { rootReducer } from "@/utils/types";
// import TextBox from "@/Components/UI/TextBox";
// import LoadingIcon from "@/assets/Icons/LoadingIcon";
// import GoogleIcon from "@/assets/Images/googleIcon.svg";
// import { signIn } from "next-auth/react";
// import TelegramLoginButton from "@/Components/Page/Common/TelegramLogin";
// import axios from "axios";
// import axiosBaseApi from "@/axiosConfig";
// import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";

// const initialValue = {
//   email: "",
//   password: "",
//   otp: "",
//   emailOTP: "",
// };

// const Login = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const userState = useSelector((state: rootReducer) => state.userReducer);
//   const [viewPassword, setViewPassword] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [signInType, setSignInType] = useState("mobile");
//   const [collapse, setCollapse] = useState(false);
//   const [countdown, setCountdown] = useState(-1);
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const loginSchema = yup.object().shape({
//     email: yup
//       .string()
//       .email("Please enter a valid email")
//       .required("email is required!"),
//   });
//   const passwordSchema = yup.object().shape({
//     password: yup.string().test("password", "password is required", (value) => {
//       let flag = true;
//       if (signInType === "password") {
//         if (value === "" || value === null) {
//           flag = false;
//         } else {
//           flag = true;
//         }
//       }
//       return flag;
//     }),
//     otp: yup.string().test("otp", "OTP is required", (value) => {
//       let flag = true;
//       if (signInType === "mobile") {
//         if (value === "" || value === null) {
//           flag = false;
//         } else {
//           flag = true;
//         }
//       }
//       return flag;
//     }),
//     emailOTP: yup.string().test("emailOTP", "OTP is required", (value) => {
//       let flag = true;
//       if (signInType === "emailOTP") {
//         if (value === "" || value === null) {
//           flag = false;
//         } else {
//           flag = true;
//         }
//       }
//       return flag;
//     }),
//   });

//   useEffect(() => {
//     if (userState.name) {
//       router.replace("/");
//     }
//   }, [userState]); // eslint-disable-line

//   useEffect(() => {
//     if (sent) {
//       setCountdown(30);
//       const timeOutId = setTimeout(() => {
//         setSent(false);
//       }, 30000);
//       return () => clearTimeout(timeOutId);
//     }
//   }, [sent]);

//   useEffect(() => {
//     if (countdown !== -1) {
//       const timerId = setInterval(() => {
//         setCountdown(countdown - 1);
//       }, 1000);
//       return () => clearInterval(timerId);
//     }
//   }, [countdown]);

//   const handleCheck = async (values: any) => {
//     try {
//       const {
//         data: { data },
//       } = await axiosBaseApi.get("/user/checkEmail?email=" + values.email);

//       if (data.validEmail) {
//         setEmail(values.email);
//         dispatch({ type: USER_EMAIL_CHECK, payload: data });
//         setCollapse(!collapse);
//       } else {
//         setEmailError("Email not found! please try again");
//       }
//     } catch (e: any) {
//       const message = e.response.data.message ?? e.message;
//       dispatch({
//         type: TOAST_SHOW,
//         payload: {
//           message: message,
//           severity: "error",
//         },
//       });
//     }
//   };
//   const handleSubmit2 = (values: any) => {
//     if (signInType === "password") {
//       dispatch(UserAction(USER_LOGIN, { email, password: values.password }));
//     } else if (signInType === "emailOTP") {
//       dispatch(UserAction(USER_CONFIRM_CODE, { email, otp: values.emailOTP }));
//     } else if (signInType === "mobile") {
//       dispatch(
//         UserAction(USER_CONFIRM_CODE, {
//           email,
//           otp: values.otp,
//           mobile: userState.mobile,
//         })
//       );
//     }
//   };

//   const connectSocial = async (token: any) => {
//     const {
//       data: { data, message },
//     } = await axiosBaseApi.post("user/connectSocial", {
//       ...token,
//     });
//     dispatch({
//       type: TOAST_SHOW,
//       payload: { message },
//     });
//     dispatch({
//       type: USER_LOGIN,
//       payload: { ...data.userData, accessToken: data.accessToken },
//     });
//   };

//   return (
//     <Box>
//       <Grid container sx={{ height: "100vh" }}>
//         <Grid item md={4.5}>
//           <Box
//             sx={{
//               display: "flex",
//               height: "100%",
//               justifyContent: "center",
//               flexDirection: "column",
//               mx: 5,
//             }}
//           >
//             <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
//               Login
//             </Typography>
//             <Typography fontSize={18} mt={1}>
//               <Typography
//                 component={"span"}
//                 fontSize={"inherit"}
//                 fontWeight={700}
//               >
//                 Welcome back,{" "}
//               </Typography>
//               manage your transactions with us.
//             </Typography>
//             <Divider sx={{ my: 3 }} />
//             <Collapse in={!collapse} orientation="vertical">
//               <FormManager
//                 initialValues={initialValue}
//                 yupSchema={loginSchema}
//                 onSubmit={handleCheck}
//               >
//                 {({
//                   errors,
//                   handleBlur,
//                   handleChange,
//                   submitDisable,
//                   touched,
//                   values,
//                 }) => (
//                   <>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         rowGap: "20px",
//                         width: "100%",
//                       }}
//                     >
//                       <Box sx={{ width: "100%" }}>
//                         <Typography
//                           sx={{
//                             ml: 1,
//                             fontSize: "14px",
//                             textTransform: "capitalize",
//                           }}
//                         >
//                           Email
//                         </Typography>
//                         <TextBox
//                           mt={1}
//                           fullWidth={true}
//                           placeholder="Enter your email"
//                           name="email"
//                           value={values.email}
//                           error={(touched.email && errors.email) || emailError}
//                           helperText={
//                             (touched.email && errors.email && errors.email) ||
//                             (emailError && emailError)
//                           }
//                           onChange={(e) => {
//                             handleChange(e);
//                             setEmailError("");
//                           }}
//                           onBlur={(e) => {
//                             handleBlur(e);
//                           }}
//                         />
//                       </Box>
//                     </Box>
//                     <Typography width="100%" marginLeft={2} fontWeight={500}>
//                       Don&apos;t have an account?{" "}
//                       <Typography
//                         component="span"
//                         sx={{
//                           fontWeight: 500,
//                           color: "text.secondary",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => {
//                           router.push("/auth/register");
//                         }}
//                       >
//                         Create new account
//                       </Typography>
//                     </Typography>
//                     <Box
//                       sx={{
//                         width: "fit-content",
//                         mt: 2,
//                         ml: "auto",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           lineHeight: 0,
//                           "& svg,img": {
//                             width: "30px",
//                             height: "auto",
//                             borderRadius: "100%",
//                           },
//                         }}
//                       >
//                         {userState.loading && <LoadingIcon />}
//                       </Box>
//                       <Button
//                         variant="rounded"
//                         type="submit"
//                         disabled={
//                           userState.loading === true
//                             ? userState.loading
//                             : submitDisable
//                         }
//                         sx={{ py: 1.5 }}
//                       >
//                         <Typography
//                           sx={{
//                             lineHeight: 1,
//                             fontSize: "0.875rem",
//                             px: 1,
//                             cursor: userState.loading
//                               ? "not-allowed"
//                               : "pointer",
//                           }}
//                         >
//                           Continue
//                         </Typography>
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </FormManager>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     height: "1px",
//                     background: "#0000001f",
//                     my: 3,
//                     width: "100%",
//                   }}
//                 />
//                 <Typography
//                   sx={{
//                     background: "#fff",
//                     p: 1,
//                     fontWeight: 700,
//                   }}
//                 >
//                   OR
//                 </Typography>
//                 <Box
//                   sx={{
//                     height: "1px",
//                     background: "#0000001f",
//                     my: 3,
//                     width: "100%",
//                   }}
//                 />
//               </Box>
//               <Box
//                 sx={{
//                   mt: 3,
//                   display: "flex",
//                   alignItems: "center",
//                   flexDirection: "column",
//                   gap: 2,
//                 }}
//               >
//                 <Typography sx={{ fontSize: 11, fontWeight: 600 }}>
//                   Sign up / Log in with
//                 </Typography>
//                 <Button
//                   variant="rounded"
//                   color="white"
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 2,
//                     "& img": {
//                       width: "30px",
//                       height: "auto",
//                     },
//                   }}
//                   onClick={() =>
//                     signIn("google", {
//                       callbackUrl: "/auth/validateSocialLogin",
//                     })
//                   }
//                 >
//                   <img src={GoogleIcon.src} alt="no image" />
//                   Sign in with Google
//                 </Button>
//                 <TelegramLoginButton
//                   dataOnauth={async (user) => {
//                     await connectSocial({
//                       name: user.first_name,
//                       provider: "telegram",
//                       id: user.id.toString(),
//                       email: null,
//                       photo: user.photo_url,
//                     });
//                   }}
//                 />
//               </Box>
//             </Collapse>
//             <Collapse in={collapse} orientation="vertical">
//               <FormManager
//                 initialValues={initialValue}
//                 yupSchema={passwordSchema}
//                 onSubmit={handleSubmit2}
//               >
//                 {({
//                   errors,
//                   handleBlur,
//                   handleChange,
//                   submitDisable,
//                   touched,
//                   values,
//                 }) => (
//                   <>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         rowGap: "20px",
//                         width: "100%",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: "100%",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "14px",
//                             textTransform: "capitalize",

//                             fontWeight: 700,
//                           }}
//                         >
//                           Email:
//                         </Typography>
//                         <Typography sx={{ fontSize: 18 }}>{email}</Typography>
//                         <Typography
//                           sx={{
//                             ml: 3,
//                             mt: 0.5,
//                             fontSize: 14,
//                             color: "text.secondary",
//                             textDecoration: "underline",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => setCollapse(!collapse)}
//                         >
//                           Change
//                         </Typography>
//                       </Box>
//                       <FormControl fullWidth>
//                         <FormLabel id="demo-radio-buttons-group-label">
//                           Choose a sign in method
//                         </FormLabel>
//                         <RadioGroup
//                           aria-labelledby="demo-radio-buttons-group-label"
//                           defaultValue="female"
//                           name="radio-buttons-group"
//                           value={signInType}
//                           onChange={(e) => setSignInType(e.target.value)}
//                         >
//                           <Box>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="mobile"
//                                 control={<Radio />}
//                                 label="Text me a verification code"
//                               />
//                               {signInType === "mobile" && userState.mobile && (
//                                 <Typography
//                                   sx={{
//                                     mr: 1,
//                                     fontWeight: 500,
//                                     fontSize: "14px",
//                                     color: sent
//                                       ? "text.disabled"
//                                       : "text.secondary",
//                                     cursor: sent ? "not-allowed" : "pointer",
//                                   }}
//                                   onClick={() => {
//                                     if (!sent) {
//                                       setSent(true);
//                                       dispatch(
//                                         UserAction(USER_SEND_OTP, {
//                                           email,
//                                           mobile: userState.mobile,
//                                         })
//                                       );
//                                     }
//                                   }}
//                                 >
//                                   Send OTP {sent ? `in ${countdown}s` : ""}
//                                 </Typography>
//                               )}
//                             </Box>
//                             <Collapse in={signInType === "mobile"}>
//                               <Box sx={{ width: "100%" }}>
//                                 <Typography
//                                   sx={{
//                                     fontSize: "12px",
//                                     ml: 4,
//                                     color: userState.mobile
//                                       ? "text.primary"
//                                       : "#d32f2f",
//                                   }}
//                                 >
//                                   {userState.mobile
//                                     ? "+ xxxxxxx" +
//                                       userState.mobile.substring(7)
//                                     : "Please enter a mobile number"}
//                                 </Typography>
//                                 <TextBox
//                                   mt={1}
//                                   fullWidth={true}
//                                   type="text"
//                                   placeholder="Enter OTP"
//                                   name="otp"
//                                   value={values.otp}
//                                   disabled={userState.mobile ? false : true}
//                                   error={touched.otp && errors.otp}
//                                   helperText={
//                                     touched.otp && errors.otp && errors.otp
//                                   }
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                 />
//                               </Box>
//                             </Collapse>
//                           </Box>
//                           <Box sx={{ mt: 2 }}>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="emailOTP"
//                                 control={<Radio />}
//                                 label="Email me a verification code"
//                               />
//                               {signInType === "emailOTP" && (
//                                 <Typography
//                                   sx={{
//                                     mr: 1,
//                                     fontWeight: 500,
//                                     fontSize: "14px",
//                                     color: sent
//                                       ? "text.disabled"
//                                       : "text.secondary",
//                                     cursor: sent ? "not-allowed" : "pointer",
//                                   }}
//                                   onClick={() => {
//                                     if (!sent) {
//                                       setSent(true);
//                                       dispatch(
//                                         UserAction(USER_SEND_OTP, {
//                                           email,
//                                           mobile: null,
//                                         })
//                                       );
//                                     }
//                                   }}
//                                 >
//                                   Send Code {sent ? `in ${countdown}s` : ""}
//                                 </Typography>
//                               )}
//                             </Box>
//                             <Collapse in={signInType === "emailOTP"}>
//                               <Box sx={{ width: "100%" }}>
//                                 <TextBox
//                                   mt={1}
//                                   fullWidth={true}
//                                   type="text"
//                                   placeholder="Enter OTP"
//                                   name="emailOTP"
//                                   value={values.emailOTP}
//                                   error={touched.emailOTP && errors.emailOTP}
//                                   helperText={
//                                     touched.emailOTP &&
//                                     errors.emailOTP &&
//                                     errors.emailOTP
//                                   }
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                 />
//                               </Box>
//                             </Collapse>
//                           </Box>
//                           <Box sx={{ mt: 2 }}>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="password"
//                                 control={<Radio />}
//                                 label="Password"
//                               />
//                               {signInType === "password" && (
//                                 <Typography
//                                   sx={{
//                                     mr: 1,
//                                     fontWeight: 500,
//                                     fontSize: "14px",
//                                     color: "text.secondary",
//                                     cursor: "pointer",
//                                   }}
//                                   onClick={() => {
//                                     router.push("/auth/forgot");
//                                   }}
//                                 >
//                                   Forgot password?
//                                 </Typography>
//                               )}
//                             </Box>
//                             <Collapse in={signInType === "password"}>
//                               <Box sx={{ width: "100%" }}>
//                                 <TextBox
//                                   mt={1}
//                                   fullWidth={true}
//                                   type={viewPassword ? "text" : "password"}
//                                   placeholder="Enter your password"
//                                   name="password"
//                                   value={values.password}
//                                   error={touched.password && errors.password}
//                                   helperText={
//                                     touched.password &&
//                                     errors.password &&
//                                     errors.password
//                                   }
//                                   InputProps={{
//                                     endAdornment: (
//                                       <IconButton
//                                         onClick={() =>
//                                           setViewPassword(!viewPassword)
//                                         }
//                                       >
//                                         {viewPassword ? (
//                                           <VisibilityOffRounded color="secondary" />
//                                         ) : (
//                                           <VisibilityRounded color="secondary" />
//                                         )}
//                                       </IconButton>
//                                     ),
//                                   }}
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                 />
//                               </Box>
//                             </Collapse>
//                           </Box>
//                         </RadioGroup>
//                       </FormControl>
//                     </Box>
//                     <Box
//                       sx={{
//                         width: "100%",
//                         mt: 2,
//                         maxWidth: "250px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >
//                       <Button
//                         variant="rounded"
//                         type="submit"
//                         disabled={
//                           userState.loading === true
//                             ? userState.loading
//                             : submitDisable
//                         }
//                         sx={{ py: 1.5 }}
//                       >
//                         <Typography
//                           sx={{
//                             lineHeight: 1,
//                             fontSize: "0.875rem",
//                             px: 1,
//                             cursor: userState.loading
//                               ? "not-allowed"
//                               : "pointer",
//                           }}
//                         >
//                           Login
//                         </Typography>
//                       </Button>
//                       <Box
//                         sx={{
//                           lineHeight: 0,
//                           "& svg,img": {
//                             width: "30px",
//                             height: "auto",
//                             borderRadius: "100%",
//                           },
//                         }}
//                       >
//                         {userState.loading && <LoadingIcon />}
//                       </Box>
//                     </Box>
//                   </>
//                 )}
//               </FormManager>
//             </Collapse>
//           </Box>
//         </Grid>
//         <Grid
//           item
//           md={7.5}
//           sx={{
//             background: theme.palette.primary.main,
//             "& img": {
//               width: "400px",
//               height: "auto",
//               mt: 5,
//             },
//             color: "#fff",
//             px: 5,
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <img src={Wallet.src} alt="no wallet" />
//           <Box>
//             <Typography sx={{ fontSize: 64, fontWeight: 900 }}>
//               BozzWallet
//             </Typography>
//             <Typography sx={{ fontSize: 18, fontWeight: 500, mt: 1 }}>
//               Welcome to BozzWallet, your secure and convenient digital wallet
//               solution. Simplifying your financial transactions has never been
//               easier.
//             </Typography>
//             <Button
//               variant="rounded"
//               color="white"
//               sx={{
//                 mt: 5,
//                 px: 5,
//                 py: 2,
//               }}
//             >
//               Learn More
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Login;

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import Image from "next/image";
import GoogleIcon from "@/assets/Images/googleIcon.svg";
import ArrowUpwardIcon from "@/assets/Icons/up-arrow-icon.png";
import EditIcon from "@/assets/Icons/editicon.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Logo from "@/assets/Images/auth/dynopay-logo.png";
import { useTranslation } from "react-i18next";
import {
  AuthContainer,
  CardWrapper,
  ImageCenter,
} from "@/Containers/Login/styled";
import TitleDescription from "@/Components/UI/AuthLayout/TitleDescription";
import InputField from "@/Components/UI/AuthLayout/InputFields";
import CustomRadio from "@/Components/UI/RadioGroup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { rootReducer } from "@/utils/types";
import * as yup from "yup";
import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";
import axiosBaseApi from "@/axiosConfig";
import {
  USER_API_ERROR,
  USER_CONFIRM_CODE,
  USER_EMAIL_CHECK,
  USER_LOGIN,
  USER_SEND_OTP,
  USER_VERIFY_PASSWORD_RESET_OTP,
  USER_RESET_PASSWORD,
  UserAction,
} from "@/Redux/Actions/UserAction";
import CustomButton from "@/Components/UI/Buttons";
import useIsMobile from "@/hooks/useIsMobile";
import LoadingIcon from "@/assets/Icons/LoadingIcon";
import { signIn } from "next-auth/react";
import LanguageSwitcher from "@/Components/UI/LanguageSwitcher";
import OtpDialog from "@/Components/UI/OtpDialog";
import ForgotPasswordDialog from "@/Components/UI/ForgotPasswordDialog";
import PasswordValidation from "@/Components/UI/AuthLayout/PasswordValidation";

export default function Login() {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const isMobile = useIsMobile("sm");
  const dispatch = useDispatch();
  const router = useRouter();
  const userState = useSelector((state: rootReducer) => state.userReducer);

  // Email check state
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [showLoginMethods, setShowLoginMethods] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  // Login method state
  const [loginMethod, setLoginMethod] = useState("email");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailOtpTouched, setEmailOtpTouched] = useState(false);
  const [emailOtpCountdown, setEmailOtpCountdown] = useState(0);
  const [emailOtpDialogOpen, setEmailOtpDialogOpen] = useState(false);

  // SMS state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [mobileTouched, setMobileTouched] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTouched, setOtpTouched] = useState(false);
  const [smsOtpCountdown, setSmsOtpCountdown] = useState(0);
  const [smsOtpDialogOpen, setSmsOtpDialogOpen] = useState(false);

  // Animation states
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);
  const [previousLoadingState, setPreviousLoadingState] = useState(false);

  // Forgot password state
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState("");
  const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false);
  const [forgotPasswordOtpCountdown, setForgotPasswordOtpCountdown] =
    useState(0);
  const [forgotPasswordOtpError, setForgotPasswordOtpError] = useState("");
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState("");
  const [newPasswordShowPassword, setNewPasswordShowPassword] = useState(false);
  const [newPasswordConfirmShowPassword, setNewPasswordConfirmShowPassword] =
    useState(false);
  const [
    newPasswordShowPasswordValidation,
    setNewPasswordShowPasswordValidation,
  ] = useState(false);
  const newPasswordFieldRef = useRef<HTMLDivElement | null>(null);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=__+{}\[\]:;<>,.?/~]).{8,20}$/;

  // Handle new password change
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordError(""); // Clear error when typing

    // Show validation if password doesn't match regex, hide if it does
    if (!value) {
      setNewPasswordShowPasswordValidation(false);
    } else if (passwordRegex.test(value)) {
      // Hide validation when all conditions are met
      setNewPasswordShowPasswordValidation(false);
    } else {
      // Show validation when password is invalid
      setNewPasswordShowPasswordValidation(true);
    }

    // Check if confirm password matches (if confirm password has a value)
    if (newPasswordConfirm) {
      if (value && newPasswordConfirm && value !== newPasswordConfirm) {
        setNewPasswordConfirmError("passwordAndConfirmPasswordShouldBeSame");
      } else {
        setNewPasswordConfirmError("");
      }
    }
  };

  // Handle new password blur
  const handleNewPasswordBlur = () => {
    // Hide validation popover on blur with a small delay
    setTimeout(() => {
      setNewPasswordShowPasswordValidation(false);
    }, 200);
  };

  // Handle new password focus
  const handleNewPasswordFocus = () => {
    // Show validation if password exists and doesn't match regex
    if (newPassword && !passwordRegex.test(newPassword)) {
      setNewPasswordShowPasswordValidation(true);
    }
  };

  // Handle confirm password change
  const handleNewPasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewPasswordConfirm(value);
    setNewPasswordConfirmError(""); // Clear error when typing

    // Check if passwords match
    if (newPassword && value && newPassword !== value) {
      setNewPasswordConfirmError("passwordAndConfirmPasswordShouldBeSame");
    } else {
      setNewPasswordConfirmError("");
    }
  };

  const handleSetNewPassword = async () => {
    // Validate passwords
    if (!newPassword) {
      setNewPasswordError("passwordRequired");
      return;
    }

    if (newPassword.length < 8) {
      setNewPasswordError("passwordMinLength");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setNewPasswordConfirmError("passwordAndConfirmPasswordShouldBeSame");
      return;
    }

    try {
      // Reset password
      dispatch(
        UserAction(USER_RESET_PASSWORD, {
          email: forgotPasswordEmail,
          otp: forgotPasswordOtp,
          newPassword: newPassword,
          mobile: null,
        })
      );
    } catch (e: any) {
      const message =
        e.response?.data?.message ?? e.message ?? "Failed to reset password";
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  // Validation schemas - use translation keys instead of translated strings
  const emailSchema = yup.object().shape({
    email: yup.string().email("emailInvalid").required("emailRequired"),
  });

  const passwordSchema = yup.object().shape({
    password: yup.string().required("passwordRequired"),
  });

  const emailOtpSchema = yup.object().shape({
    emailOTP: yup.string().required("otpRequired"),
  });

  // Navigate to home if user is logged in (but not in password recovery mode or showing reset form)
  useEffect(() => {
    if (userState.name && !isPasswordRecoveryMode && !showForgotPasswordForm) {
      setShowSuccessAnimation(true);
      setEmailOtpDialogOpen(false); // Close dialog on successful login
      setTimeout(() => {
        router.replace("/dashboard");
      }, 600);
    }
  }, [userState, router, isPasswordRecoveryMode, showForgotPasswordForm]);

  // Handle successful OTP verification for password recovery
  useEffect(() => {
    // If we're in password recovery mode and OTP was verified successfully
    // Check for success flag and action type (success flag takes precedence over error)
    if (
      isPasswordRecoveryMode &&
      !userState.loading &&
      userState.actionType === USER_VERIFY_PASSWORD_RESET_OTP &&
      userState.success
    ) {
      // OTP verified successfully for password recovery
      setShowForgotPasswordForm(true);
      setForgotPasswordDialogOpen(false);
      setIsPasswordRecoveryMode(false);
    }
  }, [
    userState.loading,
    userState.actionType,
    userState.success,
    isPasswordRecoveryMode,
  ]);

  // Handle successful password reset
  useEffect(() => {
    if (
      !userState.loading &&
      userState.actionType === USER_RESET_PASSWORD &&
      userState.success
    ) {
      // Password reset successful - redirect to login
      setTimeout(() => {
        setShowForgotPasswordForm(false);
        setNewPassword("");
        setNewPasswordConfirm("");
        setForgotPasswordEmail("");
        setForgotPasswordOtp("");
        router.push("/auth/login");
      }, 2000);
    }
  }, [userState.loading, userState.actionType, userState.success, router]);

  // Handle loading state changes for animations and ensure loading stops on error
  useEffect(() => {
    // When loading changes from true to false, check if it was an error
    if (previousLoadingState && !userState.loading) {
      // If user is not logged in and loading stopped, it was likely an error
      if (!userState.name && showLoginMethods) {
        // Don't show error animation if OTP dialog is open for email or SMS verification
        const shouldShowErrorAnimation = !(
          (loginMethod === "email" && emailOtpDialogOpen) ||
          (loginMethod === "sms" && smsOtpDialogOpen)
        );

        if (shouldShowErrorAnimation) {
          setShowErrorAnimation(true);
          setTimeout(() => {
            setShowErrorAnimation(false);
          }, 500);
        }

        // Handle API errors - set error message in form if it's an OTP verification error
        if (
          userState.error &&
          (userState.error.actionType === USER_CONFIRM_CODE ||
           userState.error.actionType === USER_VERIFY_PASSWORD_RESET_OTP)
        ) {
          // If it's a password reset OTP error, always show in forgot password dialog
          if (userState.error.actionType === USER_VERIFY_PASSWORD_RESET_OTP) {
            setForgotPasswordOtpError(
              userState.error.message || "OTP verification failed"
            );
          } 
          // If in password recovery mode and it's a regular confirm code error, show in forgot password dialog
          else if (isPasswordRecoveryMode && userState.error.actionType === USER_CONFIRM_CODE) {
            setForgotPasswordOtpError(
              userState.error.message || "OTP verification failed"
            );
          } 
          // Regular login OTP errors
          else if (loginMethod === "email" && emailOtp) {
            // Set the error message so it displays in the OTP dialog
            setEmailOtpError(
              userState.error.message || "OTP verification failed"
            );
            setEmailOtpTouched(true);
            // Keep dialog open so user can retry
            if (!emailOtpDialogOpen) {
              setEmailOtpDialogOpen(true);
            }
          } else if (loginMethod === "sms" && otp) {
            // Set the error message so it displays in the OTP dialog
            setOtpError(userState.error.message || "OTP verification failed");
            setOtpTouched(true);
            // Keep dialog open so user can retry
            if (!smsOtpDialogOpen) {
              setSmsOtpDialogOpen(true);
            }
          }
        } else {
          // Clear OTP error states after API error so user can retry
          if (loginMethod === "email" && emailOtp) {
            // Just ensure touched state allows retry
            setEmailOtpTouched(false);
            // Keep dialog open so user can retry
            if (!emailOtpDialogOpen) {
              setEmailOtpDialogOpen(true);
            }
          } else if (loginMethod === "sms" && otp) {
            // Just ensure touched state allows retry
            setOtpTouched(false);
            // Keep dialog open so user can retry
            if (!smsOtpDialogOpen) {
              setSmsOtpDialogOpen(true);
            }
          }
        }
      }
    }
    setPreviousLoadingState(userState.loading);
  }, [
    userState.loading,
    userState.name,
    userState.error,
    previousLoadingState,
    showLoginMethods,
    loginMethod,
    emailOtp,
    otp,
    emailOtpDialogOpen,
    smsOtpDialogOpen,
    isPasswordRecoveryMode,
  ]);

  // Ensure loading stops if there's an error (safety check)
  useEffect(() => {
    // If loading is stuck, reset it after a timeout (safety mechanism)
    if (userState.loading) {
      const timeout = setTimeout(() => {
        // Only reset if user is not logged in (meaning it's an error)
        if (!userState.name) {
          dispatch({ type: USER_API_ERROR });
        }
      }, 10000); // 10 second timeout
      return () => clearTimeout(timeout);
    }
  }, [userState.loading, userState.name, dispatch]);

  // Email OTP countdown timer
  useEffect(() => {
    if (emailOtpCountdown > 0) {
      const timerId = setTimeout(() => {
        setEmailOtpCountdown(emailOtpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    // Don't reset emailOtpSent when countdown ends - keep showing resend button
  }, [emailOtpCountdown]);

  // SMS OTP countdown timer
  useEffect(() => {
    if (smsOtpCountdown > 0) {
      const timerId = setTimeout(() => {
        setSmsOtpCountdown(smsOtpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    // Don't reset isOtpSent when countdown ends - keep showing resend button
  }, [smsOtpCountdown]);

  // Validate email (only called on button click)
  const validateEmail = async () => {
    if (!emailInput) {
      setEmailError("emailRequired");
      return false;
    }
    try {
      await emailSchema.validate({ email: emailInput });
      setEmailError("");
      return true;
    } catch (err: any) {
      // Store translation key instead of translated message
      setEmailError(err.message || "emailInvalid");
      return false;
    }
  };

  // Handle email check on continue
  const handleEmailCheck = async () => {
    setEmailTouched(true);
    const isValid = await validateEmail();
    if (!isValid) return;

    setEmailCheckLoading(true);
    try {
      const response = await axiosBaseApi.get(
        "/user/checkEmail?email=" + emailInput
      );

      // Check if response and data exist
      if (!response || !response.data) {
        setEmailError("errorCheckingEmail");
        dispatch({
          type: TOAST_SHOW,
          payload: {
            message: t("errorCheckingEmail"),
            severity: "error",
          },
        });
        setEmailCheckLoading(false);
        return;
      }

      const data = response.data?.data;

      // Check if data exists and has validEmail property
      if (data && typeof data.validEmail === "boolean") {
        if (data.validEmail) {
          setVerifiedEmail(emailInput);
          dispatch({ type: USER_EMAIL_CHECK, payload: data });
          setShowLoginMethods(true);
          setEmailError("");
        } else {
          setEmailError("emailNotFound");
        }
      } else {
        // Invalid response structure
        setEmailError("errorCheckingEmail");
        dispatch({
          type: TOAST_SHOW,
          payload: {
            message: t("errorCheckingEmail"),
            severity: "error",
          },
        });
      }
    } catch (e: any) {
      // Show generic error message for API errors
      setEmailError("errorCheckingEmail");
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: t("errorCheckingEmail"),
          severity: "error",
        },
      });
    } finally {
      setEmailCheckLoading(false);
    }
  };

  // Handle send email OTP
  const handleSendEmailOtp = async () => {
    // If countdown is still active and dialog is closed, just reopen it
    if (emailOtpCountdown > 0 && !emailOtpDialogOpen) {
      setEmailOtpDialogOpen(true);
      return;
    }

    // If countdown is active, don't send new OTP, just reopen dialog
    if (emailOtpCountdown > 0) {
      setEmailOtpDialogOpen(true);
      return;
    }

    try {
      dispatch(
        UserAction(USER_SEND_OTP, {
          email: verifiedEmail,
          mobile: null,
        })
      );
      setEmailOtpSent(true);
      setEmailOtpCountdown(30);
      setEmailOtpDialogOpen(true);
      // Clear any previous errors
      setEmailOtpError("");
      setEmailOtpTouched(false);
    } catch (e: any) {
      const message =
        e.response?.data?.message ?? e.message ?? "Failed to send OTP";
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  // Handle OTP verification from dialog
  const handleEmailOtpVerify = (otp: string) => {
    // Don't proceed if still loading from previous request
    if (userState.loading) {
      return;
    }

    setEmailOtp(otp);
    // Clear any previous errors before submitting
    setEmailOtpError("");
    setEmailOtpTouched(false);

    // Validate and submit
    if (!otp || otp.trim().length !== 6) {
      setEmailOtpError("otpInvalid6Digit");
      setEmailOtpTouched(true);
      return;
    }

    // Submit - don't close dialog yet, let the API response handle it
    dispatch(
      UserAction(USER_CONFIRM_CODE, {
        email: verifiedEmail,
        otp: otp.trim(),
      })
    );
  };

  // Validate mobile number
  const validateMobile = () => {
    if (!mobile || mobile.trim() === "") {
      setMobileError("mobileRequired");
      return false;
    }
    // Basic validation - should be at least 10 digits
    const cleanedMobile = mobile.replace(/\D/g, "");
    if (cleanedMobile.length < 10) {
      setMobileError("mobileInvalid");
      return false;
    }
    setMobileError("");
    return true;
  };

  // Handle send SMS OTP
  const handleSendSmsOtp = async () => {
    // If countdown is still active and dialog is closed, just reopen it
    if (smsOtpCountdown > 0 && !smsOtpDialogOpen) {
      setSmsOtpDialogOpen(true);
      return;
    }

    // If countdown is active, don't send new OTP, just reopen dialog
    if (smsOtpCountdown > 0) {
      setSmsOtpDialogOpen(true);
      return;
    }

    // If mobile is available from userState (from email check), use it directly
    if (userState.mobile) {
      try {
        dispatch(
          UserAction(USER_SEND_OTP, {
            email: verifiedEmail,
            mobile: userState.mobile,
          })
        );
        setIsOtpSent(true);
        setSmsOtpCountdown(30);
        setSmsOtpDialogOpen(true);
        // Clear any previous errors
        setOtpError("");
        setOtpTouched(false);
        setMobileError("");
        setMobileTouched(false);
        return;
      } catch (e: any) {
        const message =
          e.response?.data?.message ?? e.message ?? "Failed to send OTP";
        dispatch({
          type: TOAST_SHOW,
          payload: {
            message: message,
            severity: "error",
          },
        });
        return;
      }
    }

    // If no mobile in userState, validate input mobile
    setMobileTouched(true);
    if (!validateMobile()) {
      return;
    }

    try {
      dispatch(
        UserAction(USER_SEND_OTP, {
          email: verifiedEmail,
          mobile: mobile,
        })
      );
      setIsOtpSent(true);
      setSmsOtpCountdown(30);
      setSmsOtpDialogOpen(true);
      // Clear any previous errors
      setOtpError("");
      setOtpTouched(false);
      setMobileError("");
    } catch (e: any) {
      const message =
        e.response?.data?.message ?? e.message ?? "Failed to send OTP";
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  // Validate SMS OTP
  const validateSmsOtp = () => {
    if (!otp || otp.trim().length !== 6) {
      setOtpError("otpInvalid6Digit");
      return false;
    }
    setOtpError("");
    return true;
  };

  // Handle SMS OTP verification from dialog
  const handleSmsOtpVerify = (otp: string) => {
    // Don't proceed if still loading from previous request
    if (userState.loading) {
      return;
    }

    setOtp(otp);
    // Clear any previous errors before submitting
    setOtpError("");
    setOtpTouched(false);

    // Validate and submit
    if (!otp || otp.trim().length !== 6) {
      setOtpError("otpInvalid6Digit");
      setOtpTouched(true);
      return;
    }

    // Get mobile number - use input or from userState
    const mobileToUse = mobile || userState.mobile;
    if (!mobileToUse) {
      setMobileError("mobileRequired");
      return;
    }

    // Submit - don't close dialog yet, let the API response handle it
    dispatch(
      UserAction(USER_CONFIRM_CODE, {
        email: verifiedEmail,
        otp: otp.trim(),
        mobile: mobileToUse,
      })
    );
  };

  // Validate password
  const validatePassword = async () => {
    if (!password) {
      setPasswordError("passwordRequired");
      return false;
    }
    try {
      await passwordSchema.validate({ password });
      setPasswordError("");
      return true;
    } catch (err: any) {
      // Store translation key instead of translated message
      setPasswordError(err.message || "passwordRequired");
      return false;
    }
  };

  // Validate email OTP
  const validateEmailOtp = async () => {
    if (!emailOtp) {
      setEmailOtpError("otpRequired");
      return false;
    }
    try {
      await emailOtpSchema.validate({ emailOTP: emailOtp });
      setEmailOtpError("");
      return true;
    } catch (err: any) {
      // Store translation key instead of translated message
      setEmailOtpError(err.message || "otpRequired");
      return false;
    }
  };

  // Handle login submit
  const handleLoginSubmit = async () => {
    if (loginMethod === "password") {
      setPasswordTouched(true);
      const isValid = await validatePassword();
      if (!isValid) {
        return;
      }

      dispatch(UserAction(USER_LOGIN, { email: verifiedEmail, password }));
    } else if (loginMethod === "email") {
      if (!emailOtpSent) {
        dispatch({
          type: TOAST_SHOW,
          payload: {
            message: t("pleaseGetVerificationCodeFirst"),
            severity: "error",
          },
        });
        return;
      }

      // If dialog is open, don't submit here - let dialog handle it
      if (emailOtpDialogOpen) {
        return;
      }

      // Basic validation - just check if OTP is entered and is 6 digits
      if (!emailOtp || emailOtp.trim().length !== 6) {
        setEmailOtpTouched(true);
        setEmailOtpError("otpInvalid6Digit");
        // Reopen dialog if OTP is not valid
        setEmailOtpDialogOpen(true);
        return;
      }

      // Clear any previous errors before submitting (only if validation passes)
      setEmailOtpError("");
      setEmailOtpTouched(false);

      // All validation passed - call API
      dispatch(
        UserAction(USER_CONFIRM_CODE, {
          email: verifiedEmail,
          otp: emailOtp.trim(),
        })
      );
    } else if (loginMethod === "sms") {
      if (!isOtpSent) {
        dispatch({
          type: TOAST_SHOW,
          payload: {
            message: "Please get the verification code first",
            severity: "error",
          },
        });
        return;
      }

      // If dialog is open, don't submit here - let dialog handle it
      if (smsOtpDialogOpen) {
        return;
      }

      // Basic validation - just check if OTP is entered and is 6 digits
      if (!otp || otp.trim().length !== 6) {
        setOtpTouched(true);
        setOtpError("otpInvalid6Digit");
        // Reopen dialog if OTP is not valid
        setSmsOtpDialogOpen(true);
        return;
      }

      // Clear any previous errors before submitting (only if validation passes)
      setOtpError("");
      setOtpTouched(false);

      // Get mobile number - use input or from userState
      const mobileToUse = mobile || userState.mobile;
      if (!mobileToUse) {
        setMobileError("mobileRequired");
        return;
      }

      // All validation passed - call API
      dispatch(
        UserAction(USER_CONFIRM_CODE, {
          email: verifiedEmail,
          otp: otp.trim(),
          mobile: mobileToUse,
        })
      );
    }
  };

  // Reset to email input
  const handleChangeEmail = () => {
    setShowLoginMethods(false);
    setVerifiedEmail("");
    setEmailOtpSent(false);
    setEmailOtp("");
    setPassword("");
    setLoginMethod("email");
    setEmailOtpCountdown(0);
    // Clear all errors
    setPasswordError("");
    setPasswordTouched(false);
    setEmailOtpError("");
    setEmailOtpTouched(false);
    // Clear SMS state
    setIsOtpSent(false);
    setMobile("");
    setMobileError("");
    setMobileTouched(false);
    setOtp("");
    setOtpError("");
    setOtpTouched(false);
    setSmsOtpCountdown(0);
    setSmsOtpDialogOpen(false);
  };

  // Handle login method change - clear errors when switching
  const handleLoginMethodChange = (value: string) => {
    setLoginMethod(value);
    // Clear errors when switching methods
    setPasswordError("");
    setPasswordTouched(false);
    setEmailOtpError("");
    setEmailOtpTouched(false);
    setOtpError("");
    setOtpTouched(false);
    setMobileError("");
    setMobileTouched(false);
  };

  // Handle Google social login
  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/auth/validateSocialLogin",
    });
  };

  // Forgot password countdown timer
  useEffect(() => {
    if (forgotPasswordOtpCountdown > 0) {
      const timerId = setTimeout(() => {
        setForgotPasswordOtpCountdown(forgotPasswordOtpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [forgotPasswordOtpCountdown]);

  // Handle forgot password email submit
  const handleForgotPasswordEmailSubmit = async (email: string) => {
    setForgotPasswordEmail(email);
    setForgotPasswordEmailError("");
    setIsPasswordRecoveryMode(true); // Set password recovery mode

    try {
      // Check if email exists
      const {
        data: { data },
      } = await axiosBaseApi.get("/user/checkEmail?email=" + email);

      if (data.validEmail) {
        // Send OTP for password recovery
        dispatch(
          UserAction(USER_SEND_OTP, {
            email: email,
            mobile: null,
          })
        );
        setForgotPasswordOtpSent(true);
        setForgotPasswordOtpCountdown(30);
        setForgotPasswordEmailError("");
      } else {
        setForgotPasswordEmailError("emailNotFound");
        setIsPasswordRecoveryMode(false);
      }
    } catch (e: any) {
      const message =
        e.response?.data?.message ?? e.message ?? "An error occurred";
      setForgotPasswordEmailError(message);
      setIsPasswordRecoveryMode(false);
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  // Handle forgot password OTP verify
  const handleForgotPasswordOtpVerify = async (otp: string, email: string) => {
    setForgotPasswordOtpError("");

    if (!otp || otp.trim().length !== 6) {
      setForgotPasswordOtpError("otpInvalid6Digit");
      return;
    }

    try {
      // Store OTP for later use in password reset
      setForgotPasswordOtp(otp.trim());
      
      // Verify OTP for password recovery (does NOT log user in)
      dispatch(
        UserAction(USER_VERIFY_PASSWORD_RESET_OTP, {
          email: email,
          otp: otp.trim(),
          mobile: null,
        })
      );
    } catch (e: any) {
      const message =
        e.response?.data?.message ?? e.message ?? "Failed to verify OTP";
      setForgotPasswordOtpError(message);
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  // Handle forgot password resend code
  const handleForgotPasswordResendCode = async (email: string) => {
    try {
      dispatch(
        UserAction(USER_SEND_OTP, {
          email: email,
          mobile: null,
        })
      );
      setForgotPasswordOtpCountdown(30);
      setForgotPasswordOtpError("");
    } catch (e: any) {
      const message =
        e.response?.data?.message ?? e.message ?? "Failed to send OTP";
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  return (
    <AuthContainer>
      <CardWrapper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "10px 18px" : "8px 27px",
          height: isMobile ? "49px" : "56px",
        }}
      >
        {/* Logo */}
        <Image
          src={Logo}
          alt="logo"
          width={isMobile ? 86 : 114}
          height={isMobile ? 29 : 39}
          draggable={false}
          onClick={() => {
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        />

        <Box>
          <LanguageSwitcher
            sx={{
              maxWidth: isMobile ? "78px" : "111px",
              padding: isMobile ? "7px 10px" : "10px 14px",
            }}
          />
        </Box>
      </CardWrapper>

      {/* Login Card */}
      {!showForgotPasswordForm && (
        <CardWrapper sx={{ padding: "30px" }}>
          {/* Login Title & Description */}
          <TitleDescription
            title={t("login")}
            description={t("loginDescription")}
            align="left"
            titleVariant="h2"
            descriptionVariant="p"
          />

          {/* Email Input field - shown initially or when changing email */}
          {!showLoginMethods ? (
            <>
              <Box sx={{ marginTop: "24px" }}>
                <InputField
                  label={t("email")}
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    // Clear error when typing
                    if (emailError) {
                      setEmailError("");
                      setEmailTouched(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !emailCheckLoading) {
                      e.preventDefault();
                      handleEmailCheck();
                    }
                  }}
                  placeholder={t("emailPlaceHolder")}
                  error={emailTouched && !!emailError}
                  helperText={
                    emailTouched && emailError
                      ? emailError.includes(" ")
                        ? emailError
                        : t(emailError)
                      : ""
                  }
                />
              </Box>

              {/* Don't have acc */}
              <Box
                sx={{
                  display: "flex",
                  gap: "7px",
                  marginTop: "16px",
                  textAlign: "start",
                }}
              >
                <Typography
                  width="100%"
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.secondary,
                    fontFamily: "UrbanistMedium",
                  }}
                  fontWeight={500}
                >
                  {t("dontHaveAccount")}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      textAlign: "start",
                      cursor: "pointer",
                      paddingLeft: "7px",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      fontFamily: "UrbanistMedium",
                    }}
                    onClick={() => {
                      router.push("/auth/register");
                    }}
                  >
                    {t("createNewAccount")}
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ marginTop: "24px" }}>
                <CustomButton
                  label={t("continue")}
                  variant="primary"
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                  disabled={emailCheckLoading}
                  onClick={handleEmailCheck}
                  hideLabelWhenLoading={true}
                  showSuccessAnimation={showSuccessAnimation}
                  showErrorAnimation={showErrorAnimation}
                  sx={{
                    fontWeight: 700,
                  }}
                  endIcon={
                    emailCheckLoading ? <LoadingIcon size={20} /> : undefined
                  }
                />
              </Box>
            </>
          ) : (
            <>
              {/* Show verified email in InputBox with edit button */}
              <Box sx={{ marginTop: "24px" }}>
                <InputField
                  label={t("email")}
                  type="email"
                  value={verifiedEmail}
                  readOnly={true}
                  sideButton={true}
                  sideButtonType="primary"
                  sideButtonIcon={EditIcon}
                  sideButtonIconWidth={isMobile ? "12px" : "14px"}
                  sideButtonIconHeight={isMobile ? "12px" : "14px"}
                  onSideButtonClick={handleChangeEmail}
                />
              </Box>

              <Box sx={{ marginTop: isMobile ? "12px" : "24px" }}>
                <Typography
                  sx={{
                    textAlign: "start",
                    fontSize: isMobile ? "13px" : "15px",
                    fontFamily: "UrbanistMedium",
                    color: "#676768",
                  }}
                >
                  {t("chooseLoginMethod")}
                </Typography>

                {/* Login Method Selection */}
                <Box sx={{ marginTop: "16px" }}>
                  <RadioGroup
                    value={loginMethod}
                    onChange={(e) => handleLoginMethodChange(e.target.value)}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: isMobile ? "13px" : "15px",
                        fontFamily: "UrbanistMedium",
                        color: "#242428",
                        paddingLeft: "8px",
                      },
                    }}
                  >
                    {/* SMS Option */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <FormControlLabel
                        value="sms"
                        control={<CustomRadio />}
                        label={t("sendVerificationCodeViaSms")}
                        sx={{ margin: "0px", flex: 1, textAlign: "start" }}
                      />

                      {/* Get Code Button - Desktop */}
                      {loginMethod === "sms" && !isMobile && !isOtpSent && (
                        <CustomButton
                          variant="secondary"
                          size="medium"
                          label={t("getCode")}
                          onClick={handleSendSmsOtp}
                          disabled={userState.loading}
                          sx={{
                            fontWeight: 500,
                            padding: "8px 22.5px",
                          }}
                          endIcon={ArrowUpwardIcon}
                        />
                      )}

                      {/* Resend Code Button - Desktop */}
                      {loginMethod === "sms" && !isMobile && isOtpSent && (
                        <CustomButton
                          variant="secondary"
                          disabled={smsOtpCountdown > 0 || userState.loading}
                          size="medium"
                          label={
                            smsOtpCountdown > 0
                              ? `${t("codeIn")} ${smsOtpCountdown}s`
                              : t("resendCode")
                          }
                          onClick={handleSendSmsOtp}
                          endIcon={
                            smsOtpCountdown > 0 || userState.loading
                              ? undefined
                              : ArrowUpwardIcon
                          }
                          sx={{
                            fontWeight: 500,
                            padding: "11px 20px",
                          }}
                        />
                      )}
                    </Box>

                    {/* Show mobile number if available from userState */}
                    {loginMethod === "sms" && userState.mobile && (
                      <Box sx={{ marginLeft: "32px" }}>
                        <Typography
                          sx={{
                            textAlign: "start",
                            fontSize: "12px",
                            color: "#676768",
                            fontFamily: "UrbanistMedium",
                          }}
                        >
                          {t("codeWillBeSentTo")}
                          {userState.mobile.substring(7)}
                        </Typography>
                      </Box>
                    )}

                    {/* Mobile Input Field - Desktop (only show if mobile not in userState) */}
                    {loginMethod === "sms" &&
                      !isMobile &&
                      !isOtpSent &&
                      !userState.mobile && (
                        <Box sx={{ marginTop: "8px" }}>
                          <InputField
                            placeholder={t("enterMobilePlaceholder")}
                            value={mobile}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setMobile(value);
                              // Clear error when typing
                              if (mobileError) {
                                setMobileError("");
                                setMobileTouched(false);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                !userState.loading &&
                                mobile &&
                                mobile.length >= 10
                              ) {
                                e.preventDefault();
                                handleSendSmsOtp();
                              }
                            }}
                            type="text"
                            inputMode="numeric"
                            error={mobileTouched && !!mobileError}
                            helperText={
                              mobileTouched && mobileError
                                ? mobileError.includes(" ")
                                  ? mobileError
                                  : t(mobileError)
                                : ""
                            }
                          />
                        </Box>
                      )}

                    {/* Mobile Input Field - Mobile (only show if mobile not in userState) */}
                    {loginMethod === "sms" &&
                      isMobile &&
                      !isOtpSent &&
                      !userState.mobile && (
                        <Box sx={{ marginTop: "8px" }}>
                          <InputField
                            placeholder={t("enterMobilePlaceholder")}
                            value={mobile}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setMobile(value);
                              // Clear error when typing
                              if (mobileError) {
                                setMobileError("");
                                setMobileTouched(false);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                !userState.loading &&
                                mobile &&
                                mobile.length >= 10
                              ) {
                                e.preventDefault();
                                handleSendSmsOtp();
                              }
                            }}
                            type="text"
                            inputMode="numeric"
                            error={mobileTouched && !!mobileError}
                            helperText={
                              mobileTouched && mobileError
                                ? mobileError.includes(" ")
                                  ? mobileError
                                  : t(mobileError)
                                : ""
                            }
                            sideButton={true}
                            sideButtonType="secondary"
                            sideButtonIcon={ArrowUpwardIcon}
                            sideButtonIconWidth={isMobile ? "10px" : "14px"}
                            sideButtonIconHeight={isMobile ? "10px" : "14px"}
                            onSideButtonClick={handleSendSmsOtp}
                          />
                        </Box>
                      )}

                    {/* Get Code Button - Mobile (when mobile is in userState) */}
                    {loginMethod === "sms" &&
                      isMobile &&
                      !isOtpSent &&
                      userState.mobile && (
                        <Box sx={{ marginTop: "8px" }}>
                          <CustomButton
                            variant="secondary"
                            size="small"
                            label={t("getCode")}
                            fullWidth
                            disabled={userState.loading}
                            onClick={handleSendSmsOtp}
                            sx={{
                              fontWeight: 500,
                              padding: "8px 22.5px",
                            }}
                            endIcon={ArrowUpwardIcon}
                          />
                        </Box>
                      )}

                    {/* Resend Code Button - Mobile */}
                    {loginMethod === "sms" && isMobile && isOtpSent && (
                      <Box sx={{ marginTop: "8px" }}>
                        <CustomButton
                          variant="secondary"
                          disabled={smsOtpCountdown > 0 || userState.loading}
                          size="small"
                          label={
                            smsOtpCountdown > 0
                              ? `${t("codeIn")} ${smsOtpCountdown}s`
                              : t("resendCode")
                          }
                          fullWidth
                          onClick={handleSendSmsOtp}
                          endIcon={
                            smsOtpCountdown > 0 || userState.loading
                              ? undefined
                              : ArrowUpwardIcon
                          }
                          sx={{
                            height: "32px",
                            fontSize: "13px",
                            fontWeight: 500,
                            padding: "8px 20px",
                          }}
                        />
                      </Box>
                    )}

                    {/* Email Option */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "16px",
                      }}
                    >
                      <FormControlLabel
                        value="email"
                        control={<CustomRadio />}
                        label={t("sendVerificationCodeViaEmail")}
                        sx={{
                          margin: "0px",
                          color: "#242428",
                          textAlign: "start",
                          flex: 1,
                        }}
                      />
                      {/* Get Code Button */}
                      {loginMethod === "email" &&
                        !isMobile &&
                        !emailOtpSent && (
                          <CustomButton
                            variant="secondary"
                            size="medium"
                            label={t("getCode")}
                            onClick={handleSendEmailOtp}
                            disabled={userState.loading}
                            sx={{
                              fontWeight: 500,
                              padding: "8px 22.5px",
                            }}
                            endIcon={ArrowUpwardIcon}
                          />
                        )}

                      {/* Resend Code Button */}
                      {loginMethod === "email" && !isMobile && emailOtpSent && (
                        <CustomButton
                          variant="secondary"
                          disabled={
                            (emailOtpDialogOpen && emailOtpCountdown > 0) ||
                            userState.loading
                          }
                          size="medium"
                          label={
                            emailOtpCountdown > 0
                              ? `${t("codeIn")} ${emailOtpCountdown}s`
                              : t("resendCode")
                          }
                          onClick={handleSendEmailOtp}
                          endIcon={
                            emailOtpCountdown > 0 && emailOtpDialogOpen
                              ? undefined
                              : ArrowUpwardIcon
                          }
                          sx={{
                            fontWeight: 500,
                            padding: "11px 20px",
                          }}
                        />
                      )}
                    </Box>

                    {/* Get Code Button - Mobile */}
                    {loginMethod === "email" && isMobile && !emailOtpSent && (
                      <Box sx={{ marginTop: "16px" }}>
                        <CustomButton
                          variant="secondary"
                          size="small"
                          label={t("getCode")}
                          fullWidth
                          disabled={userState.loading}
                          onClick={handleSendEmailOtp}
                          sx={{
                            fontWeight: 500,
                            padding: "8px 22.5px",
                          }}
                          endIcon={ArrowUpwardIcon}
                        />
                      </Box>
                    )}

                    {/* Resend Code Button - Mobile */}
                    {loginMethod === "email" && isMobile && emailOtpSent && (
                      <Box sx={{ marginTop: "16px" }}>
                        <CustomButton
                          variant="secondary"
                          size="small"
                          label={
                            emailOtpCountdown > 0
                              ? `${t("codeIn")} ${emailOtpCountdown}s`
                              : t("resendCode")
                          }
                          fullWidth
                          disabled={emailOtpCountdown > 0}
                          endIcon={
                            emailOtpCountdown > 0 ? undefined : ArrowUpwardIcon
                          }
                          onClick={handleSendEmailOtp}
                          sx={{
                            fontWeight: 500,
                            padding: "8px 20px",
                          }}
                        />
                      </Box>
                    )}

                    {/* Password Option */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "16px 0 0 0",
                      }}
                    >
                      <FormControlLabel
                        value="password"
                        control={<CustomRadio />}
                        label={t("password")}
                        sx={{ margin: "0px", color: "#242428" }}
                      />
                      {loginMethod === "password" && (
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "13px",
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            textAlign: "start",
                            cursor: "pointer",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                            fontFamily: "UrbanistMedium",
                          }}
                          onClick={() => {
                            setForgotPasswordDialogOpen(true);
                          }}
                        >
                          {t("forgotYourPassword")}
                        </Typography>
                      )}
                    </Box>
                    {/* Password Input Field */}
                    {loginMethod === "password" && (
                      <Box sx={{ marginTop: "10px" }}>
                        <InputField
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            // Clear error when typing
                            if (passwordError) {
                              setPasswordError("");
                              setPasswordTouched(false);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !userState.loading) {
                              e.preventDefault();
                              handleLoginSubmit();
                            }
                          }}
                          placeholder={t("passwordPlaceHolder")}
                          error={
                            loginMethod === "password" &&
                            passwordTouched &&
                            !!passwordError
                          }
                          helperText={
                            loginMethod === "password" &&
                              passwordTouched &&
                              passwordError
                              ? passwordError.includes(" ")
                                ? passwordError
                                : t(passwordError)
                              : ""
                          }
                          sideButton={true}
                          sideButtonType="primary"
                          sideButtonIcon={
                            showPassword ? (
                              <VisibilityOffIcon
                                sx={{
                                  color: "#676768",
                                  height: "18px",
                                  width: "16px",
                                }}
                              />
                            ) : (
                              <VisibilityIcon
                                sx={{
                                  color: "#676768",
                                  height: "18px",
                                  width: "16px",
                                }}
                              />
                            )
                          }
                          sideButtonIconWidth={isMobile ? "14px" : "18px"}
                          sideButtonIconHeight={isMobile ? "14px" : "18px"}
                          onSideButtonClick={() => {
                            setShowPassword(!showPassword);
                          }}
                          showPasswordToggle={true}
                        />
                      </Box>
                    )}
                  </RadioGroup>
                </Box>
              </Box>

              {/* Continue Button - shown when login methods are visible */}
              <Box sx={{ marginTop: "24px" }}>
                <CustomButton
                  label={t("continue")}
                  variant="primary"
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                  disabled={
                    userState.loading &&
                    !(
                      (loginMethod === "email" && emailOtpDialogOpen) ||
                      (loginMethod === "sms" && smsOtpDialogOpen)
                    )
                  }
                  onClick={() => {
                    // Ensure we can submit even after previous errors
                    handleLoginSubmit();
                  }}
                  hideLabelWhenLoading={true}
                  showSuccessAnimation={
                    showSuccessAnimation &&
                    !(
                      (loginMethod === "email" && emailOtpDialogOpen) ||
                      (loginMethod === "sms" && smsOtpDialogOpen)
                    )
                  }
                  showErrorAnimation={
                    showErrorAnimation &&
                    !(
                      (loginMethod === "email" && emailOtpDialogOpen) ||
                      (loginMethod === "sms" && smsOtpDialogOpen)
                    )
                  }
                  sx={{
                    fontWeight: 700,
                  }}
                  endIcon={
                    userState.loading &&
                      !(
                        (loginMethod === "email" && emailOtpDialogOpen) ||
                        (loginMethod === "sms" && smsOtpDialogOpen)
                      ) ? (
                      <LoadingIcon size={20} />
                    ) : undefined
                  }
                />
              </Box>
            </>
          )}

          {/* Social Login Section - shown only when login methods are visible */}

          <Box sx={{ marginTop: isMobile ? "16px" : "24px" }}>
            <Divider
              sx={{
                borderColor: "red",
                "&::before, &::after": {
                  borderColor: "#E9ECF2",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "UrbanistMedium",
                  color: "#676768",
                  padding: "0 24px",
                  fontSize: isMobile ? "10px" : "15px",
                }}
              >
                {t("or")}
              </Typography>
            </Divider>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              padding: 0,
              marginTop: isMobile ? "16px" : "24px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: isMobile ? "13px" : "15px",
                fontFamily: "UrbanistMedium",
                color: "#676768",
              }}
            >
              {t("registerLogin")}
            </Typography>

            <Box
              sx={{
                height: isMobile ? "32px" : "40px",
                width: isMobile ? "32px" : "40px",
                borderRadius: "100%",
                border: "1px solid #E9ECF2",
                backgroundColor: "#F4F6FA",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#E9ECF2",
                  borderColor: "#D0D5DD",
                },
              }}
              onClick={handleGoogleLogin}
            >
              <ImageCenter>
                <Image
                  src={GoogleIcon}
                  alt="google login"
                  width={24}
                  height={24}
                  draggable={false}
                />
              </ImageCenter>
            </Box>
          </Box>
        </CardWrapper>
      )}

      {/* Email OTP Dialog */}
      {loginMethod === "email" && (
        <OtpDialog
          open={emailOtpDialogOpen}
          onClose={() => {
            setEmailOtpDialogOpen(false);
            // Don't reset emailOtpSent so resend button still shows
          }}
          title={t("emailVerification")}
          subtitle={t("emailVerificationSubtitle")}
          contactInfo={emailInput}
          contactType="email"
          resendCodeLabel={t("resendCode")}
          resendCodeCountdownLabel={(seconds) => `${t("codeIn")} ${seconds}s`}
          primaryButtonLabel={t("checkAndAdd")}
          onResendCode={handleSendEmailOtp}
          onVerify={handleEmailOtpVerify}
          onClearError={() => {
            // Clear error when user starts typing
            setEmailOtpError("");
            setEmailOtpTouched(false);
          }}
          countdown={emailOtpCountdown}
          loading={userState.loading}
          preventClose={emailOtpCountdown > 0}
          error={
            emailOtpTouched && emailOtpError
              ? emailOtpError.includes(" ")
                ? emailOtpError
                : t(emailOtpError)
              : undefined
          }
        />
      )}

      {/* SMS OTP Dialog */}
      {loginMethod === "sms" && (
        <OtpDialog
          open={smsOtpDialogOpen}
          onClose={() => {
            setSmsOtpDialogOpen(false);
            // Don't reset isOtpSent so resend button still shows
          }}
          title={t("smsVerification") || "SMS Verification"}
          subtitle={
            t("smsVerificationSubtitle") ||
            "Enter the verification code sent to your mobile number"
          }
          contactInfo={userState.mobile || mobile}
          contactType="phone"
          resendCodeLabel={t("resendCode")}
          resendCodeCountdownLabel={(seconds) => `${t("codeIn")} ${seconds}s`}
          primaryButtonLabel={t("checkAndAdd")}
          onResendCode={handleSendSmsOtp}
          onVerify={handleSmsOtpVerify}
          onClearError={() => {
            // Clear error when user starts typing
            setOtpError("");
            setOtpTouched(false);
          }}
          countdown={smsOtpCountdown}
          loading={userState.loading}
          preventClose={smsOtpCountdown > 0}
          error={
            otpTouched && otpError
              ? otpError.includes(" ")
                ? otpError
                : t(otpError)
              : undefined
          }
        />
      )}

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordDialogOpen}
        onClose={() => {
          setForgotPasswordDialogOpen(false);
          setForgotPasswordEmail("");
          setForgotPasswordEmailError("");
          setForgotPasswordOtpSent(false);
          setForgotPasswordOtpCountdown(0);
          setForgotPasswordOtpError("");
          setIsPasswordRecoveryMode(false);
        }}
        onEmailSubmit={handleForgotPasswordEmailSubmit}
        onOtpVerify={handleForgotPasswordOtpVerify}
        onResendCode={handleForgotPasswordResendCode}
        countdown={forgotPasswordOtpCountdown}
        loading={userState.loading}
        currentEmail={verifiedEmail}
        emailError={
          forgotPasswordEmailError
            ? forgotPasswordEmailError.includes(" ")
              ? forgotPasswordEmailError
              : t(forgotPasswordEmailError)
            : undefined
        }
        otpError={
          forgotPasswordOtpError
            ? forgotPasswordOtpError.includes(" ")
              ? forgotPasswordOtpError
              : t(forgotPasswordOtpError)
            : undefined
        }
      />

      {/* Reset Password Form - shown after OTP verification */}
      {showForgotPasswordForm && (
        <CardWrapper sx={{ padding: "30px" }}>
          <TitleDescription
            title={t("setNewPassword") || "Set the New Password"}
            align="left"
            titleVariant="h2"
            descriptionVariant="p"
          />
          <Box
            ref={newPasswordFieldRef}
            sx={{ position: "relative", width: "100%", marginTop: "24px" }}
          >
            <InputField
              label={t("newPassword")}
              type={newPasswordShowPassword ? "text" : "password"}
              value={newPassword}
              autoComplete="off"
              onChange={handleNewPasswordChange}
              onFocus={handleNewPasswordFocus}
              onBlur={handleNewPasswordBlur}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !userState.loading &&
                  newPassword &&
                  newPasswordConfirm
                ) {
                  e.preventDefault();
                  handleSetNewPassword();
                }
              }}
              placeholder={t("newPasswordPlaceholder")}
              sideButton={true}
              sideButtonType="primary"
              sideButtonIcon={
                newPasswordShowPassword ? (
                  <VisibilityOffIcon
                    sx={{
                      color: "#676768",
                      height: "18px",
                      width: "16px",
                    }}
                  />
                ) : (
                  <VisibilityIcon
                    sx={{
                      color: "#676768",
                      height: "18px",
                      width: "16px",
                    }}
                  />
                )
              }
              sideButtonIconWidth={isMobile ? "14px" : "18px"}
              sideButtonIconHeight={isMobile ? "14px" : "18px"}
              onSideButtonClick={() => {
                setNewPasswordShowPassword(!newPasswordShowPassword);
              }}
              showPasswordToggle={true}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                ...(isMobile &&
                  theme.breakpoints.down("lg") && {
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                }),
                zIndex: 5,
              }}
            >
              <PasswordValidation
                password={newPassword}
                anchorEl={newPasswordFieldRef.current}
                open={newPasswordShowPasswordValidation}
                onClose={() => setNewPasswordShowPasswordValidation(false)}
                showOnMobile={newPasswordShowPasswordValidation}
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: "16px" }}>
            <InputField
              label={t("newPasswordConfirm")}
              type={newPasswordConfirmShowPassword ? "text" : "password"}
              value={newPasswordConfirm}
              autoComplete="off"
              onChange={handleNewPasswordConfirmChange}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !userState.loading &&
                  newPassword &&
                  newPasswordConfirm
                ) {
                  e.preventDefault();
                  handleSetNewPassword();
                }
              }}
              placeholder={t("newPasswordConfirmPlaceholder")}
              error={!!newPasswordConfirmError}
              helperText={
                newPasswordConfirmError
                  ? newPasswordConfirmError.includes(" ")
                    ? newPasswordConfirmError
                    : t(newPasswordConfirmError)
                  : ""
              }
              sideButton={true}
              sideButtonType="primary"
              sideButtonIcon={
                newPasswordConfirmShowPassword ? (
                  <VisibilityOffIcon
                    sx={{
                      color: "#676768",
                      height: "18px",
                      width: "16px",
                    }}
                  />
                ) : (
                  <VisibilityIcon
                    sx={{
                      color: "#676768",
                      height: "18px",
                      width: "16px",
                    }}
                  />
                )
              }
              sideButtonIconWidth={isMobile ? "14px" : "18px"}
              sideButtonIconHeight={isMobile ? "14px" : "18px"}
              onSideButtonClick={() => {
                setNewPasswordConfirmShowPassword(
                  !newPasswordConfirmShowPassword
                );
              }}
              showPasswordToggle={true}
            />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <CustomButton
              label={t("continue")}
              variant="primary"
              size={isMobile ? "small" : "medium"}
              fullWidth
              onClick={handleSetNewPassword}
            />
          </Box>
        </CardWrapper>
      )}
    </AuthContainer>
  );
}
