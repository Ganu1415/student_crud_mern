import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/students";

export const fetchStudents = createAsyncThunk("students/fetch", async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const addStudent = createAsyncThunk("students/add", async (student) => {
  const res = await axios.post(API_URL, student);
  return res.data;
});

const studentSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    status: "idle",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default studentSlice.reducer;
