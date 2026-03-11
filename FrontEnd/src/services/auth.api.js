import api from "./api";

export const userLogin = (data) =>{
   return api.post("/auth/login",data)
}


// Start registration (send OTP)
export const initRegister = (data) => {
  return api.post("/auth/init-register", data);
};

// Verify OTP 
export const verifyOtp = (data) => {
  return api.post("/auth/verify-otp", data);
};

//  Resend OTP
export const resendOtp = (data) => {
  return api.post("/auth/resend-otp", data);
};

//complete registration
export const userRegister =(data) =>{
   return api.post("/auth/register",data);
}