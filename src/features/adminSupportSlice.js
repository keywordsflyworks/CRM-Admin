import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../services/adminService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAllTickets = createAsyncThunk(
  "adminSupport/fetchAllTickets",
  async (params, { rejectWithValue }) => {
    try { return await adminService.listTickets(params); }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Could not load tickets"); }
  }
);

export const fetchTicketDetail = createAsyncThunk(
  "adminSupport/fetchTicketDetail",
  async (id, { rejectWithValue }) => {
    try { return await adminService.getTicket(id); }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Could not load ticket"); }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "adminSupport/updateTicketStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try { return await adminService.updateTicket(id, data); }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Could not update ticket"); }
  }
);

export const addAdminComment = createAsyncThunk(
  "adminSupport/addAdminComment",
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const data = await adminService.addComment(id, message);
      return { id, comment: data.comment, ticketUpdatedAt: data.ticketUpdatedAt };
    } catch (e) { return rejectWithValue(e.response?.data?.message || "Could not add reply"); }
  }
);

export const deleteAdminTicket = createAsyncThunk(
  "adminSupport/deleteAdminTicket",
  async (id, { rejectWithValue }) => {
    try { await adminService.deleteTicket(id); return id; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Could not delete ticket"); }
  }
);
export const fetchAdminUnreadCount = createAsyncThunk(
  "adminSupport/fetchAdminUnreadCount",
  async (_, { rejectWithValue }) => {
    try { return await adminService.getUnreadCount(); }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
  }
);
// ─── Slice ────────────────────────────────────────────────────────────────────

const adminSupportSlice = createSlice({
  name: "adminSupport",
 initialState: {
  tickets: [],
  activeTicket: null,
  loading: false,
  saving: false,
  error: null,
  unreadCount: 0,   // ADD
},
  reducers: {
    clearAdminSupportError(state) { state.error = null; },
    clearActiveTicket(state) { state.activeTicket = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTickets.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllTickets.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchAllTickets.fulfilled, (s, a) => { s.loading = false; s.tickets = a.payload.tickets; });

    builder
      .addCase(fetchTicketDetail.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTicketDetail.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchTicketDetail.fulfilled, (s, a) => {
        s.loading = false;
        s.activeTicket = { ticket: a.payload.ticket, comments: a.payload.comments };
      });

    builder
      .addCase(updateTicketStatus.pending,  (s) => { s.saving = true; s.error = null; })
      .addCase(updateTicketStatus.rejected, (s, a) => { s.saving = false; s.error = a.payload; })
    .addCase(updateTicketStatus.fulfilled, (s, a) => {
  s.saving = false;
  const updated = a.payload.ticket;
  const idx = s.tickets.findIndex((t) => t._id === updated._id);
  if (idx !== -1) s.tickets[idx] = { ...s.tickets[idx], ...updated };
  if (s.activeTicket?.ticket?._id === updated._id) {
    s.activeTicket.ticket = { ...s.activeTicket.ticket, ...updated };   // merge, not replace
  }
})

    builder.addCase(addAdminComment.fulfilled, (s, a) => {
      if (s.activeTicket?.ticket?._id === a.payload.id) {
        s.activeTicket.comments.push(a.payload.comment);
        if (a.payload.ticketUpdatedAt) s.activeTicket.ticket.updatedAt = a.payload.ticketUpdatedAt;
      }
      if (a.payload.ticketUpdatedAt) {
        const idx = s.tickets.findIndex((t) => t._id === a.payload.id);
        if (idx !== -1) s.tickets[idx].updatedAt = a.payload.ticketUpdatedAt;
      }
    });

    builder.addCase(fetchAdminUnreadCount.fulfilled, (s, a) => {
  s.unreadCount = a.payload.count;
});
    builder
  .addCase(deleteAdminTicket.pending,  (s) => { s.saving = true; s.error = null; })
  .addCase(deleteAdminTicket.rejected, (s, a) => { s.saving = false; s.error = a.payload; })
  .addCase(deleteAdminTicket.fulfilled, (s, a) => {
    s.saving = false;
    s.tickets = s.tickets.filter((t) => t._id !== a.payload);
  });
  },
});

export const { clearAdminSupportError, clearActiveTicket } = adminSupportSlice.actions;
export default adminSupportSlice.reducer;