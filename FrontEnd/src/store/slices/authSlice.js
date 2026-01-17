import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


//createAsyncThunk -helper from redux that helps in api calls and async operation
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    logout: state => {
      state.user = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(loginUser.rejected,(state,action)=>{
        state.error = "Invalid Credentials"
    })
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
