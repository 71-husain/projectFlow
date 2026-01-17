import api from "./api";

export const userLogin = (data) =>{
   return api.post("/auth/login",data)
}

export const userRegister =(data) =>{
   return api.post("/auth/register",data);
}