import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../services/adminService";

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await adminService.login(payload);
      localStorage.setItem("kf_admin_token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchAdminMe = createAsyncThunk(
  "admin/fetchAdminMe",
  async (_, { rejectWithValue }) => {
    try { return await adminService.getMe(); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Could not fetch profile"); }
  }
);

export const fetchWorkspaces = createAsyncThunk(
  "admin/fetchWorkspaces",
  async (params, { rejectWithValue }) => {
    try { return await adminService.listWorkspaces(params); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Could not load workspaces"); }
  }
);

export const fetchWorkspaceDetail = createAsyncThunk(
  "admin/fetchWorkspaceDetail",
  async (id, { rejectWithValue }) => {
    try { return await adminService.getWorkspace(id); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Could not load workspace"); }
  }
);

const initialState = {
  token: localStorage.getItem("kf_admin_token") || null,
  admin: null,
  workspaces: [],
  pagination: { total: 0, page: 1, limit: 20, pages: 1 },
  workspaceDetail: null, // { owner, members }
  status: {
    login: "idle",
    fetchMe: "idle",
    fetchWorkspaces: "idle",
    fetchWorkspaceDetail: "idle",
  },
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) { state.error = null; },
    logoutAdmin() {
      localStorage.removeItem("kf_admin_token");
      return { ...initialState, token: null };
    },
    clearWorkspaceDetail(state) { state.workspaceDetail = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending,   (s) => { s.status.login = "loading"; s.error = null; })
      .addCase(loginAdmin.fulfilled, (s, a) => { s.status.login = "succeeded"; s.token = a.payload.token; s.admin = a.payload.admin; })
      .addCase(loginAdmin.rejected,  (s, a) => { s.status.login = "failed"; s.error = a.payload; })

      .addCase(fetchAdminMe.pending,   (s) => { s.status.fetchMe = "loading"; })
      .addCase(fetchAdminMe.fulfilled, (s, a) => { s.status.fetchMe = "succeeded"; s.admin = a.payload.admin; })
      .addCase(fetchAdminMe.rejected,  (s, a) => { s.status.fetchMe = "failed"; s.error = a.payload; })

      .addCase(fetchWorkspaces.pending,   (s) => { s.status.fetchWorkspaces = "loading"; s.error = null; })
      .addCase(fetchWorkspaces.fulfilled, (s, a) => {
        s.status.fetchWorkspaces = "succeeded";
        s.workspaces = a.payload.workspaces;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchWorkspaces.rejected,  (s, a) => { s.status.fetchWorkspaces = "failed"; s.error = a.payload; })

      .addCase(fetchWorkspaceDetail.pending,   (s) => { s.status.fetchWorkspaceDetail = "loading"; s.error = null; })
      .addCase(fetchWorkspaceDetail.fulfilled, (s, a) => { s.status.fetchWorkspaceDetail = "succeeded"; s.workspaceDetail = a.payload; })
      .addCase(fetchWorkspaceDetail.rejected,  (s, a) => { s.status.fetchWorkspaceDetail = "failed"; s.error = a.payload; });
  },
});

export const { clearAdminError, logoutAdmin, clearWorkspaceDetail } = adminSlice.actions;
export default adminSlice.reducer;
