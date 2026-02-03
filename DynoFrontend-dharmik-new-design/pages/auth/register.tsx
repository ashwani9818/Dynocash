// import Panel from "@/Components/UI/Panel";
// import {
//   Box,
//   Button,
//   Collapse,
//   Divider,
//   Grid,
//   IconButton,
//   Popover,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import React, { useEffect, useRef, useState } from "react";
// import Wallet from "@/assets/Images/wallet.png";
// import FormManager from "@/Components/Page/Common/FormManager";
// import {
//   Apple,
//   CancelRounded,
//   CheckCircleRounded,
//   Google,
//   Password,
//   Telegram,
//   VisibilityOffRounded,
//   VisibilityRounded,
// } from "@mui/icons-material";

// import { AuthContainer, CardWrapper } from "@/Containers/Login/styled";
// import useIsMobile from "@/hooks/useIsMobile";
// import { Box, Typography } from "@mui/material";

// import * as yup from "yup";
// import { UserAction } from "@/Redux/Actions";
// import { USER_REGISTER } from "@/Redux/Actions/UserAction";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { rootReducer } from "@/utils/types";
// import TextBox from "@/Components/UI/TextBox";
// import LoadingIcon from "@/assets/Icons/LoadingIcon";

// const initialValue = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
// };

// const Register = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const passwordRef = useRef<any>();
//   const router = useRouter();
//   const [viewPassword, setViewPassword] = useState(false);
//   const [popUp, setPopUp] = useState(false);
//   const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
//   const [passwordValidation, setPasswordValidation] = useState({
//     digitCount: false,
//     capital: false,
//     small: false,
//     special: false,
//     digits: false,
//   });
//   const userState = useSelector((state: rootReducer) => state.userReducer);
//   const regex =
//     /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-=_+{}[\]:;<>,.?/~]).{8,20}$/;
//   const registerSchema = yup.object().shape({
//     firstName: yup.string().required("First Name is required!"),
//     lastName: yup.string().required("Last Name is required!"),
//     email: yup
//       .string()
//       .email("Please enter a valid email")
//       .required("email is required!"),

//     password: yup
//       .string()
//       .required("Password is required!")
//       .matches(regex, " "),
//     confirmPassword: yup
//       .string()
//       .required("Confirm password is required!")
//       .when("password", (password: any, schema) => {
//         return schema.test({
//           test: (value: string) => value === password[0],
//           message: "Password and confirm password should be same!",
//         });
//       }),
//   });

//   const handleSubmit = (values: any) => {
//     const { confirmPassword, firstName, lastName, email, password } = values;
//     const finalPayload = {
//       name: firstName + " " + lastName,
//       email: email,
//       password: password,
//     };
//     dispatch(UserAction(USER_REGISTER, finalPayload));
//   };

//   const handlePasswordValidation = (password: string) => {
//     const capital = /[A-Z]/.test(password);
//     const small = /[a-z]/.test(password);
//     const digits = /\d/.test(password);
//     const special = /[!@#$%^&*()-=_+{}[\]:;<>,.?/~]/.test(password);
//     const digitCount = password.length >= 8 && password.length <= 20;
//     setPasswordValidation({ capital, small, digits, digitCount, special });
//     if (capital && small && digits && digitCount && special) {
//       setPopUp(false);
//     }
//   };

//   useEffect(() => {
//     if (userState.name) {
//       router.push({
//         pathname: "/",
//       });
//     }
//   }, [userState]); // eslint-disable-line

//   return (
//     <Box>
//       <Popover
//         open={popUp}
//         anchorEl={passwordRef.current}
//         disableEnforceFocus
//         disableAutoFocus
//         onClose={() => setPopUp(false)}
//         anchorOrigin={{
//           vertical: "center",
//           horizontal: "left",
//         }}
//         transformOrigin={{
//           vertical: "center",
//           horizontal: "right",
//         }}
//         sx={{
//           "& .MuiPaper-root": {
//             background: "transparent",
//             p: 2,
//             boxShadow: "none",
//           },
//         }}
//       >
//         <Box
//           sx={{
//             p: 3,
//             position: "relative",
//             background: "#fff",
//             borderRadius: "10px",
//             boxShadow:
//               "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
//             "&::before": {
//               backgroundColor: "#fff",
//               content: '""',
//               display: "block",
//               position: "absolute",
//               width: 15,
//               height: 15,
//               top: "50%",
//               transform: "translateY(-50%)",
//               clipPath: "polygon(100% 50%, 0 0, 0 100%);",
//               right: -15,
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "flex-start",
//               flexDirection: "column",
//               rowGap: 1,

//               mt: -1,
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 color: passwordValidation.capital ? "#2e7d32" : "#d32f2f",
//                 alignItems: "center",
//               }}
//             >
//               {passwordValidation.capital ? (
//                 <CheckCircleRounded fontSize="small" />
//               ) : (
//                 <CancelRounded fontSize="small" />
//               )}
//               <Typography sx={{ ml: 0.5 }}>Atleast 1 capital letter</Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 color: passwordValidation.small ? "#2e7d32" : "#d32f2f",
//               }}
//             >
//               {passwordValidation.small ? (
//                 <CheckCircleRounded fontSize="small" />
//               ) : (
//                 <CancelRounded fontSize="small" />
//               )}
//               <Typography sx={{ ml: 0.5 }}>Atleast 1 small letter</Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 color: passwordValidation.special ? "#2e7d32" : "#d32f2f",
//               }}
//             >
//               {passwordValidation.special ? (
//                 <CheckCircleRounded fontSize="small" />
//               ) : (
//                 <CancelRounded fontSize="small" />
//               )}
//               <Typography sx={{ ml: 0.5 }}>
//                 Atleast 1 special character
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 color: passwordValidation.digits ? "#2e7d32" : "#d32f2f",
//               }}
//             >
//               {passwordValidation.digits ? (
//                 <CheckCircleRounded fontSize="small" />
//               ) : (
//                 <CancelRounded fontSize="small" />
//               )}
//               <Typography sx={{ ml: 0.5 }}>Atleast 1 digit</Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 color: passwordValidation.digitCount ? "#2e7d32" : "#d32f2f",
//               }}
//             >
//               {passwordValidation.digitCount ? (
//                 <CheckCircleRounded fontSize="small" />
//               ) : (
//                 <CancelRounded fontSize="small" />
//               )}
//               <Typography sx={{ ml: 0.5 }}>
//                 Minimum 8 characters and maximum 20 characters
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Popover>
//       <Grid container sx={{ height: "100vh" }}>
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
//         <Grid item md={4.5} sx={{ height: "100vh", overflowY: "auto" }}>
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
//               Register
//             </Typography>
//             <Typography fontSize={18} mt={1}>
//               Let&apos;s get started your journey with us.
//             </Typography>
//             <Divider sx={{ my: 3 }} />

//             <FormManager
//               initialValues={initialValue}
//               yupSchema={registerSchema}
//               onSubmit={handleSubmit}
//             >
//               {({
//                 errors,
//                 handleBlur,
//                 handleChange,
//                 submitDisable,
//                 touched,
//                 values,
//               }) => (
//                 <>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       rowGap: "20px",
//                       width: "100%",
//                     }}
//                   >
//                     <Box sx={{ width: "100%" }}>
//                       <Grid container columnSpacing={2}>
//                         <Grid item md={6} xs={12}>
//                           <Typography
//                             sx={{
//                               ml: 1,
//                               fontSize: "14px",
//                               textTransform: "capitalize",
//                             }}
//                           >
//                             First Name
//                           </Typography>
//                           <TextBox
//                             fullWidth={true}
//                             placeholder="Enter your first name"
//                             name="firstName"
//                             value={values.firstName}
//                             error={touched.firstName && errors.firstName}
//                             helperText={
//                               touched.firstName &&
//                               errors.firstName &&
//                               errors.firstName
//                             }
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                           />
//                         </Grid>
//                         <Grid item md={6} xs={12}>
//                           <Typography
//                             sx={{
//                               ml: 1,
//                               fontSize: "14px",
//                               textTransform: "capitalize",
//                             }}
//                           >
//                             Last Name
//                           </Typography>
//                           <TextBox
//                             fullWidth={true}
//                             placeholder="Enter your last name"
//                             name="lastName"
//                             value={values.lastName}
//                             error={touched.lastName && errors.lastName}
//                             helperText={
//                               touched.lastName &&
//                               errors.lastName &&
//                               errors.lastName
//                             }
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                           />
//                         </Grid>
//                       </Grid>
//                     </Box>

//                     <Box sx={{ width: "100%" }}>
//                       <Typography
//                         sx={{
//                           ml: 1,
//                           fontSize: "14px",
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         Email
//                       </Typography>

//                       <TextBox
//                         fullWidth={true}
//                         placeholder="Enter your email"
//                         name="email"
//                         value={values.email}
//                         error={touched.email && errors.email}
//                         helperText={
//                           touched.email && errors.email && errors.email
//                         }
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                       />
//                     </Box>
//                     <Box sx={{ width: "100%" }}>
//                       <Typography
//                         sx={{
//                           ml: 1,
//                           fontSize: "14px",
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         Password
//                       </Typography>

//                       <TextBox
//                         fullWidth={true}
//                         inputRef={passwordRef}
//                         type={viewPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         name="password"
//                         value={values.password}
//                         error={touched.password && errors.password}
//                         helperText={
//                           touched.password && errors.password && errors.password
//                         }
//                         onClick={() => setPopUp(true)}
//                         InputProps={{
//                           endAdornment: (
//                             <IconButton
//                               onClick={() => setViewPassword(!viewPassword)}
//                             >
//                               {viewPassword ? (
//                                 <VisibilityOffRounded color="secondary" />
//                               ) : (
//                                 <VisibilityRounded color="secondary" />
//                               )}
//                             </IconButton>
//                           ),
//                         }}
//                         onChange={(e) => {
//                           handlePasswordValidation(e.target.value);
//                           handleChange(e);
//                         }}
//                         onBlur={handleBlur}
//                       />
//                     </Box>
//                     <Box sx={{ width: "100%" }}>
//                       <Typography
//                         sx={{
//                           ml: 1,
//                           fontSize: "14px",
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         Confirm Password
//                       </Typography>
//                       <TextBox
//                         fullWidth={true}
//                         type={viewConfirmPassword ? "text" : "password"}
//                         placeholder="Enter your password again"
//                         name="confirmPassword"
//                         value={values.confirmPassword}
//                         error={
//                           touched.confirmPassword && errors.confirmPassword
//                         }
//                         helperText={
//                           touched.confirmPassword &&
//                           errors.confirmPassword &&
//                           errors.confirmPassword
//                         }
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         InputProps={{
//                           endAdornment: (
//                             <IconButton
//                               onClick={() =>
//                                 setViewConfirmPassword(!viewConfirmPassword)
//                               }
//                             >
//                               {viewConfirmPassword ? (
//                                 <VisibilityOffRounded color="secondary" />
//                               ) : (
//                                 <VisibilityRounded color="secondary" />
//                               )}
//                             </IconButton>
//                           ),
//                         }}
//                       />
//                     </Box>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         width: "100%",
//                       }}
//                     >
//                       <Typography width="100%" marginLeft={2} fontWeight={500}>
//                         Already have an account?{" "}
//                         <Typography
//                           component="span"
//                           sx={{
//                             fontWeight: 500,
//                             color: "text.secondary",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => {
//                             router.push("/auth/login");
//                           }}
//                         >
//                           Login
//                         </Typography>
//                       </Typography>
//                       <Box
//                         sx={{
//                           width: "100%",

//                           maxWidth: "fit-content",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             lineHeight: 0,
//                             "& svg,img": {
//                               width: "30px",
//                               height: "auto",
//                               borderRadius: "100%",
//                             },
//                           }}
//                         >
//                           {userState.loading && <LoadingIcon />}
//                         </Box>
//                         <Button
//                           variant="rounded"
//                           type="submit"
//                           disabled={
//                             userState.loading === true
//                               ? userState.loading
//                               : submitDisable
//                           }
//                           sx={{ py: 1.5 }}
//                         >
//                           <Typography
//                             sx={{
//                               lineHeight: 1,
//                               fontSize: "0.875rem",
//                               px: 1,
//                               cursor: userState.loading
//                                 ? "not-allowed"
//                                 : "pointer",
//                             }}
//                           >
//                             Sign up
//                           </Typography>
//                         </Button>
//                       </Box>
//                     </Box>
//                   </Box>
//                 </>
//               )}
//             </FormManager>
//             {/* <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   height: "1px",
//                   background: "#0000001f",
//                   my: 3,
//                   width: "100%",
//                 }}
//               />
//               <Typography
//                 sx={{
//                   background: "#fff",
//                   p: 1,
//                   fontWeight: 700,
//                 }}
//               >
//                 OR
//               </Typography>
//               <Box
//                 sx={{
//                   height: "1px",
//                   background: "#0000001f",
//                   my: 3,
//                   width: "100%",
//                 }}
//               />
//             </Box> */}
//             {/* <Box
//               sx={{
//                 mt: 3,
//                 display: "flex",
//                 alignItems: "center",
//                 flexDirection: "column",
//                 gap: 2,
//               }}
//             >
//               <Button
//                 variant="rounded"
//                 color="white"
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                   "& img": {
//                     width: "20px",
//                     height: "auto",
//                   },
//                 }}
//                 onClick={() =>
//                   signIn("google", {
//                     callbackUrl: "/auth/validateSocialRegister",
//                   })
//                 }
//               >
//                 <img src={GoogleIcon.src} alt="no image" />
//                 Sign in with Google
//               </Button>
//               <TelegramLoginButton
//                 dataOnauth={async (user) => {
//                   const data = await axios.post(
//                     `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`,
//                     {
//                       chat_id: user.id,
//                       text: "Please provide an email or mobile number to have more control over your account.",
//                     }
//                   );
//                   console.log(user);
//                 }}
//               />
//             </Box> */}
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Register;

import { useState, useRef, useEffect } from "react";
import Logo from "@/assets/Images/auth/dynopay-logo.png";
import Image from "next/image";
import LanguageSwitcher from "@/Components/UI/LanguageSwitcher";
import { AuthContainer, CardWrapper } from "@/Containers/Login/styled";
import useIsMobile from "@/hooks/useIsMobile";
import { Box, Typography } from "@mui/material";
import TitleDescription from "@/Components/UI/AuthLayout/TitleDescription";
import { useTranslation } from "react-i18next";
import InputField from "@/Components/UI/AuthLayout/InputFields";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomButton from "@/Components/UI/Buttons";
import { theme } from "@/styles/theme";
import router from "next/router";
import PasswordValidation from "@/Components/UI/AuthLayout/PasswordValidation";
import { useDispatch, useSelector } from "react-redux";
import { rootReducer } from "@/utils/types";
import {
  USER_API_ERROR,
  USER_REGISTER,
  UserAction,
} from "@/Redux/Actions/UserAction";
import * as yup from "yup";
import LoadingIcon from "@/assets/Icons/LoadingIcon";

type RegisterErrorKey =
  | ""
  | "firstNameRequired"
  | "lastNameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "passwordRequired"
  | "passwordInvalid"
  | "passwordAndConfirmPasswordShouldBeSame";

const Register = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation("auth");
  const dispatch = useDispatch();
  const userState = useSelector((state: rootReducer) => state.userReducer);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState<RegisterErrorKey>("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState<RegisterErrorKey>("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<RegisterErrorKey>("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<RegisterErrorKey>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const passwordFieldRef = useRef<HTMLDivElement | null>(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<RegisterErrorKey>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=__+{}\[\]:;<>,.?/~]).{8,20}$/;

  const registerSchema = yup.object().shape({
    // Store translation keys as messages so UI can translate live on language change
    firstName: yup.string().required("firstNameRequired"),
    lastName: yup.string().required("lastNameRequired"),
    email: yup.string().email("emailInvalid").required("emailRequired"),
    password: yup
      .string()
      .required("passwordRequired")
      .matches(passwordRegex, "passwordInvalid"),
    confirmPassword: yup.string().oneOf([yup.ref("password")]),
  });

  useEffect(() => {
    if (userState.name) {
      router.push("/dashboard");
    }
  }, [userState]);

  useEffect(() => {
    if (userState.loading) {
      const timeout = setTimeout(() => {
        if (!userState.name) {
          dispatch({ type: USER_API_ERROR });
        }
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [userState.loading, userState.name, dispatch]);

  // Errors for firstName, lastName, email only show on Sign Up click (via schema)

  const validateField = async (
    field: "firstName" | "lastName" | "email" | "password",
    nextValues?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    }
  ) => {
    try {
      await registerSchema.validateAt(field, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        ...(nextValues || {}),
      });
      if (field === "firstName") setFirstNameError("");
      if (field === "lastName") setLastNameError("");
      if (field === "email") setEmailError("");
      if (field === "password") {
        setPasswordError("");
        setShowPasswordValidation(false);
      }
    } catch (e: any) {
      const key = (e?.message || "") as RegisterErrorKey;
      if (field === "firstName") setFirstNameError(key);
      if (field === "lastName") setLastNameError(key);
      if (field === "email") setEmailError(key);
      if (field === "password") {
        // For invalid password pattern, show the PasswordValidation UI instead of helper text
        if (key === "passwordInvalid") {
          setPasswordError("");
          setShowPasswordValidation(true);
        } else {
          setPasswordError(key);
        }
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    // Remove spaces from password
    const valueWithoutSpaces = value.replace(/\s/g, "");
    const finalValue = valueWithoutSpaces;

    setPassword(finalValue);

    if (!finalValue) {
      setShowPasswordValidation(false);
      // If the user already tried submitting, keep schema-driven error in sync
      if (passwordError) validateField("password", { password: finalValue });
    } else if (passwordRegex.test(finalValue)) {
      // Hide validation when all conditions are met
      setPasswordError("");
      setShowPasswordValidation(false);
    } else {
      setPasswordError("");
      setShowPasswordValidation(true);
    }

    // If confirm password already has a value, keep mismatch error in sync
    if (confirmPassword) {
      if (finalValue && confirmPassword && confirmPassword !== finalValue) {
        setConfirmPasswordError("passwordAndConfirmPasswordShouldBeSame");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handlePasswordBlur = () => {
    // Only handle closing the validation popover; no new errors on blur
    setTimeout(() => {
      setShowPasswordValidation(false);
    }, 200);
  };

  const handleSignUp = async () => {
    try {
      await registerSchema.validate(
        { firstName, lastName, email, password, confirmPassword },
        { abortEarly: false }
      );

      setFirstNameError("");
      setLastNameError("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");

      const payload = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      };

      dispatch(UserAction(USER_REGISTER, payload));
    } catch (err: any) {
      if (err.inner && Array.isArray(err.inner)) {
        const fieldErrors: Record<string, RegisterErrorKey> = {};
        err.inner.forEach((e: any) => {
          if (e.path && !fieldErrors[e.path]) {
            fieldErrors[e.path] = e.message as RegisterErrorKey;
          }
        });

        setFirstNameError(fieldErrors.firstName || "");
        setLastNameError(fieldErrors.lastName || "");
        setEmailError(fieldErrors.email || "");
        if (fieldErrors.password === "passwordInvalid") {
          setPasswordError("");
          setShowPasswordValidation(true);
        } else {
          setPasswordError(fieldErrors.password || "");
        }

        // confirmPassword: schema doesn't have its own message, so map to our key
        if (confirmPassword && password && confirmPassword !== password) {
          setConfirmPasswordError("passwordAndConfirmPasswordShouldBeSame");
        } else {
          setConfirmPasswordError("");
        }
      }
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

      {/* Register Card */}
      <CardWrapper sx={{ padding: "30px" }}>
        {/* Register Title & Description */}
        <TitleDescription
          title={t("register")}
          description={t("registerDescription")}
          align="left"
          titleVariant="h2"
          descriptionVariant="p"
        />

        <Box
          sx={{
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "10px",
            }}
          >
            {/* First Name */}
            <InputField
              label={t("firstName")}
              type="text"
              placeholder={t("firstNamePlaceholder")}
              value={firstName}
              onChange={(e) => {
                // Remove spaces and capitalize first character
                const rawValue = e.target.value.replace(/\s/g, "");
                const capitalized =
                  rawValue.length > 0
                    ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1)
                    : rawValue;
                setFirstName(capitalized);
                if (firstNameError)
                  validateField("firstName", { firstName: capitalized });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !userState.loading) {
                  e.preventDefault();
                  handleSignUp();
                }
              }}
              error={!!firstNameError}
              helperText={firstNameError ? t(firstNameError) : ""}
            />

            {/* Last Name */}
            <InputField
              label={t("lastName")}
              type="text"
              placeholder={t("lastNamePlaceholder")}
              value={lastName}
              onChange={(e) => {
                // Remove spaces and capitalize first character
                const rawValue = e.target.value.replace(/\s/g, "");
                const capitalized =
                  rawValue.length > 0
                    ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1)
                    : rawValue;
                setLastName(capitalized);
                if (lastNameError)
                  validateField("lastName", { lastName: capitalized });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !userState.loading) {
                  e.preventDefault();
                  handleSignUp();
                }
              }}
              error={!!lastNameError}
              helperText={lastNameError ? t(lastNameError) : ""}
            />
          </Box>

          {/* Email */}
          <InputField
            label={t("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => {
              // Remove all spaces from email
              const valueWithoutSpaces = e.target.value.replace(/\s/g, "");
              setEmail(valueWithoutSpaces);
              if (emailError)
                validateField("email", { email: valueWithoutSpaces });
            }}
            onKeyDown={(e) => {
              // Prevent space key from being entered
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
              }
              // Submit on Enter
              if (e.key === "Enter" && !userState.loading) {
                e.preventDefault();
                handleSignUp();
              }
            }}
            error={!!emailError}
            helperText={emailError ? t(emailError) : ""}
          />

          {/* Password */}
          <Box
            ref={passwordFieldRef}
            sx={{ position: "relative", width: "100%" }}
          >
            <InputField
              type={showPassword ? "text" : "password"}
              value={password}
              autoComplete="off"
              label={t("password")}
              onChange={(e) => {
                handlePasswordChange(e.target.value);
              }}
              onFocus={() => {
                if (password && !passwordRegex.test(password)) {
                  setShowPasswordValidation(true);
                }
              }}
              onBlur={() => {
                handlePasswordBlur();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !userState.loading) {
                  e.preventDefault();
                  handleSignUp();
                }
              }}
              placeholder={t("passwordPlaceHolder")}
              // Show red border when there is a password error or
              // when the PasswordValidation component is visible (invalid password)
              error={!!passwordError || showPasswordValidation}
              helperText={passwordError ? t(passwordError) : ""}
              sideButton={true}
              sideButtonType="primary"
              sideButtonIcon={
                showPassword ? (
                  <VisibilityOffIcon
                    tabIndex={-1}
                    aria-hidden={true}
                    sx={{
                      color: "#676768",
                      height: "18px",
                      width: "16px",
                    }}
                  />
                ) : (
                  <VisibilityIcon
                    tabIndex={-1}
                    aria-hidden={true}
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
                password={password}
                anchorEl={passwordFieldRef.current}
                open={showPasswordValidation}
                onClose={() => setShowPasswordValidation(false)}
                showOnMobile={showPasswordValidation}
              />
            </Box>
          </Box>

          {/* Confirm Password */}
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            autoComplete="off"
            label={t("confirmPassword")}
            onChange={(e) => {
              // Remove spaces from confirm password
              const value = e.target.value.replace(/\s/g, "");
              setConfirmPassword(value);
              if (!password || !value) {
                // Only show error when both passwords have a value
                setConfirmPasswordError("");
              } else if (value !== password) {
                setConfirmPasswordError(
                  "passwordAndConfirmPasswordShouldBeSame"
                );
              } else {
                setConfirmPasswordError("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !userState.loading) {
                e.preventDefault();
                handleSignUp();
              }
            }}
            placeholder={t("confirmPasswordPlaceHolder")}
            error={
              confirmPasswordError === "passwordAndConfirmPasswordShouldBeSame"
            }
            helperText={confirmPasswordError ? t(confirmPasswordError) : ""}
            sideButton={true}
            sideButtonType="primary"
            sideButtonIcon={
              showConfirmPassword ? (
                <VisibilityOffIcon
                  tabIndex={-1}
                  aria-hidden={true}
                  sx={{
                    color: "#676768",
                    height: "18px",
                    width: "16px",
                  }}
                />
              ) : (
                <VisibilityIcon
                  tabIndex={-1}
                  aria-hidden={true}
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
              setShowConfirmPassword(!showConfirmPassword);
            }}
            showPasswordToggle={true}
          />
        </Box>

        {/* Sign Up Button */}
        <Box sx={{ marginTop: "24px" }}>
          <CustomButton
            label={t("signUpButton")}
            variant="primary"
            size={isMobile ? "small" : "medium"}
            fullWidth
            disabled={userState.loading}
            onClick={handleSignUp}
            hideLabelWhenLoading={true}
            endIcon={userState.loading ? <LoadingIcon size={20} /> : undefined}
          />
        </Box>

        {/* Don't have acc */}
        <Box
          sx={{
            display: "flex",
            gap: "7px",
            marginTop: "16px",
            textAlign: "center",
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
            {t("alreadyHaveAccount")}
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
                router.push("/auth/login");
              }}
            >
              {t("login")}
            </Typography>
          </Typography>
        </Box>
      </CardWrapper>
    </AuthContainer>
  );
};

export default Register;
