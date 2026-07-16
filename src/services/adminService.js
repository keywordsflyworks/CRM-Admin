import adminAxiosClient from "../api/adminAxiosClient";

// POST /api/superadmin/login
function login({ email, password }) {
  return adminAxiosClient
    .post("/superadmin/login", { email, password })
    .then((res) => res.data);
}

// GET /api/superadmin/me
function getMe() {
  return adminAxiosClient.get("/superadmin/me").then((res) => res.data);
}

// GET /api/superadmin/workspaces?search=&page=&limit=
function listWorkspaces({ search = "", page = 1, limit = 20 } = {}) {
  return adminAxiosClient
    .get("/superadmin/workspaces", { params: { search, page, limit } })
    .then((res) => res.data);
}

// GET /api/superadmin/workspaces/:id
function getWorkspace(id) {
  return adminAxiosClient
    .get(`/superadmin/workspaces/${id}`)
    .then((res) => res.data);
}

// ─── Support Tickets (cross-workspace) ───────────────────────────────────────

// GET /api/support-tickets?status=&priority=&workspaceId=
function listTickets(params = {}) {
  return adminAxiosClient.get("/support-tickets", { params }).then((res) => res.data);
}

// GET /api/support-tickets/:id
function getTicket(id) {
  return adminAxiosClient.get(`/support-tickets/${id}`).then((res) => res.data);
}

// PUT /api/support-tickets/:id  — status, priority, category, assignedTo
function updateTicket(id, payload) {
  return adminAxiosClient.put(`/support-tickets/${id}`, payload).then((res) => res.data);
}

// POST /api/support-tickets/:id/comments
function addComment(id, message) {
  return adminAxiosClient.post(`/support-tickets/${id}/comments`, { message }).then((res) => res.data);
}

// DELETE /api/support-tickets/:id
function deleteTicket(id) {
  return adminAxiosClient.delete(`/support-tickets/${id}`).then((res) => res.data);
}

// GET /api/support-tickets/unread-count
function getUnreadCount() {
  return adminAxiosClient.get("/support-tickets/unread-count").then((res) => res.data);
}

const adminService = {
  login, getMe, listWorkspaces, getWorkspace,
  listTickets, getTicket, updateTicket, addComment, deleteTicket, getUnreadCount,
};
export default adminService;