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

const adminService = { login, getMe, listWorkspaces, getWorkspace };
export default adminService;