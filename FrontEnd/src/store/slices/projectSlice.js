import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async () => {
    const res = await api.get("/projects");
    return res.data;
  }
);


