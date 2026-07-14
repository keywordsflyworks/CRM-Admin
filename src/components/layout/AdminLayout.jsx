import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminMe, logoutAdmin } from "../../features/adminSlice";
import Icons from "../icons/Icons";

const NAV = [
  { section: "PLATFORM" },
  { to: "/workspaces", icon: "building", label: "Workspaces" },
  { to: "/profile",    icon: "user",     label: "My Profile" },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.admin.token);
  const admin = useSelector((s) => s.admin.admin);
  const fetchMeStatus = useSelector((s) => s.admin.status.fetchMe);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/login", { replace: true }); return; }
    if (!admin && fetchMeStatus === "idle") dispatch(fetchAdminMe());
  }, [token]);

  useEffect(() => {
    // If the admin token turns out to be invalid/expired, bounce to login.
    if (fetchMeStatus === "failed") navigate("/login", { replace: true });
  }, [fetchMeStatus]);

  function handleLogout() {
    dispatch(logoutAdmin());
    navigate("/login");
  }

  if (!token) return null;

  const initials = admin?.name
    ? admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PA";

  const W = open ? 230 : 64;

  return (
    <>
      <style>{`
        .as-shell { display: flex; height: 100vh; overflow: hidden; background: #f4f5f8; font-family: 'Geist', system-ui, sans-serif; }
        .as-sidebar {
          width: ${W}px; flex-shrink: 0;
          background: #ffffff; border-right: 1px solid #e7e9f0;
          display: flex; flex-direction: column; height: 100vh; min-height: 0;
          overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth;
          transition: width .2s cubic-bezier(.4,0,.2,1);
        }
        .as-sidebar::-webkit-scrollbar { display: none; }
        .as-brand { display: flex; align-items: center; gap: 10px; padding: 18px 16px 16px; border-bottom: 1px solid #e7e9f0; min-height: 57px; flex-shrink: 0; overflow: hidden; white-space: nowrap; }
        .as-brand-icon { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg,#7b5ce8,#4fb8d9); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .as-brand-text { opacity: ${open ? 1 : 0}; transition: opacity .12s; overflow: hidden; }
        .as-brand-name { font-size: 14px; font-weight: 700; color: #1c1f2b; letter-spacing: -.2px; white-space: nowrap; }
        .as-brand-sub { font-size: 9.5px; font-weight: 700; color: #7b5ce8; letter-spacing: .6px; text-transform: uppercase; white-space: nowrap; }

        .as-nav { padding: 10px 0; flex: 1 1 auto; }
        .as-nav-section { font-size: 10px; font-weight: 700; letter-spacing: .7px; color: #9aa0b0; text-transform: uppercase; padding: ${open ? "10px 18px 6px" : "10px 0 6px"}; text-align: ${open ? "left" : "center"}; white-space: nowrap; overflow: hidden; }
        .as-nav-link { display: flex; align-items: center; gap: 9px; padding: ${open ? "8px 18px" : "10px 0"}; justify-content: ${open ? "flex-start" : "center"}; font-size: 13.5px; color: #4b5163; text-decoration: none; transition: background .12s, color .12s; white-space: nowrap; }
        .as-nav-link svg { width: 16px; height: 16px; flex-shrink: 0; }
        .as-nav-link:hover { background: #f7f8fb; color: #1c1f2b; }
        .as-nav-link.active { background: rgba(123,92,232,.08); color: #7b5ce8; font-weight: 600; border-right: 3px solid #7b5ce8; }
        .as-nav-label { opacity: ${open ? 1 : 0}; transition: opacity .12s; overflow: hidden; }

        .as-user { display: flex; align-items: center; gap: 10px; padding: ${open ? "14px 16px" : "14px 0"}; justify-content: ${open ? "flex-start" : "center"}; border-top: 1px solid #e7e9f0; flex-shrink: 0; }
        .as-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg,#7b5ce8,#4fb8d9); color: #ffffff; font-size: 11.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .as-user-info { flex: 1; min-width: 0; opacity: ${open ? 1 : 0}; transition: opacity .12s; }
        .as-user-name { font-size: 12.5px; font-weight: 600; color: #1c1f2b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .as-user-email { font-size: 11px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .as-logout { background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 6px; opacity: ${open ? 1 : 0}; }
        .as-logout:hover { background: #f7f8fb; color: #1c1f2b; }
        .as-logout svg { width: 15px; height: 15px; }

        .as-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .as-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-bottom: 1px solid #e7e9f0; background: #ffffff; flex-shrink: 0; }
        .as-menu-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e1e4ec; background: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #4b5163; }
        .as-menu-btn:hover { background: rgba(123,92,232,.08); color: #7b5ce8; border-color: rgba(123,92,232,.3); }
        .as-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .4px; color: #7b5ce8; background: rgba(123,92,232,.08); border: 1px solid rgba(123,92,232,.25); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
        .as-content { flex: 1; overflow-y: auto; overflow-x: hidden; background: #f4f5f8; scroll-behavior: smooth; }
      `}</style>

      <div className="as-shell">
        <aside className="as-sidebar">
          <div className="as-brand">
            <div className="as-brand-icon"><Icons.shield style={{ width: 16, height: 16, color: "#ffffff" }} /></div>
            {open && (
              <div className="as-brand-text">
                <div className="as-brand-name">KeywordsFly</div>
                <div className="as-brand-sub">Platform Admin</div>
              </div>
            )}
          </div>

          <nav className="as-nav">
            {NAV.map((item, i) => {
              if (item.section) return open ? <div key={i} className="as-nav-section">{item.section}</div> : <div key={i} className="as-nav-section">·</div>;
              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `as-nav-link${isActive ? " active" : ""}`}>
                  {(() => { const Ic = Icons[item.icon]; return Ic ? <Ic /> : null; })()}
                  {open && <span className="as-nav-label">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="as-user">
            <div className="as-avatar">{initials}</div>
            {open && (
              <>
                <div className="as-user-info">
                  <div className="as-user-name">{admin?.name || "Loading…"}</div>
                  <div className="as-user-email">{admin?.email || ""}</div>
                </div>
                <button className="as-logout" onClick={handleLogout} title="Sign out" type="button">
                  <Icons.arrowR style={{ transform: "rotate(180deg)" }} />
                </button>
              </>
            )}
          </div>
        </aside>

        <main className="as-main">
          <header className="as-topbar">
            <button className="as-menu-btn" onClick={() => setOpen((o) => !o)} type="button" title="Toggle sidebar">
              <Icons.menu style={{ width: 16, height: 16 }} />
            </button>
            <span className="as-badge"><Icons.shield style={{ width: 12, height: 12 }} /> Super Admin</span>
          </header>
          <div className="as-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}