import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminMe } from "../features/adminSlice";
import Icons from "../components/icons/Icons";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const admin = useSelector((s) => s.admin.admin);
  const loading = useSelector((s) => s.admin.status.fetchMe === "loading");
  const error = useSelector((s) => s.admin.error);

  useEffect(() => {
    dispatch(fetchAdminMe());
  }, [dispatch]);

  const initials = admin?.name
    ? admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PA";

  return (
    <>
      <style>{`
        .ap-page { padding: 28px 32px; color: #e7e9ef; max-width: 640px; }
        .ap-title { font-size: 20px; font-weight: 700; color: #f2f3f7; margin: 0 0 4px; }
        .ap-sub { font-size: 12.5px; color: #757e94; margin: 0 0 24px; }

        .ap-card { background: #0b0e16; border: 1px solid #1c2233; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 18px; margin-bottom: 20px; }
        .ap-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#f5a623,#d94f4f); color: #14151b; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ap-name { font-size: 17px; font-weight: 700; color: #f2f3f7; }
        .ap-email { font-size: 13px; color: #757e94; margin-top: 3px; }
        .ap-role-badge { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .4px; color: #f5a623; background: rgba(245,166,35,.1); border: 1px solid rgba(245,166,35,.3); padding: 5px 12px; border-radius: 20px; text-transform: uppercase; }

        .ap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
        .ap-field { background: #0b0e16; border: 1px solid #1c2233; border-radius: 10px; padding: 14px 16px; }
        .ap-field-label { font-size: 10.5px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #4c5468; }
        .ap-field-value { font-size: 13.5px; font-weight: 600; color: #d5d8e2; margin-top: 5px; word-break: break-all; }

        .ap-error { padding: 14px 16px; color: #f18b8b; font-size: 13px; background: rgba(217,79,79,.12); border: 1px solid rgba(217,79,79,.35); border-radius: 10px; }
        .ap-loading { color: #757e94; font-size: 13px; }
      `}</style>

      <div className="ap-page">
        <h1 className="ap-title">My profile</h1>
        <p className="ap-sub">Your platform admin account details.</p>

        {error && <div className="ap-error">{error}</div>}

        {!error && loading && !admin && <div className="ap-loading">Loading…</div>}

        {!error && admin && (
          <>
            <div className="ap-card">
              <div className="ap-avatar">{initials}</div>
              <div>
                <div className="ap-name">{admin.name}</div>
                <div className="ap-email">{admin.email}</div>
              </div>
              <span className="ap-role-badge"><Icons.shield style={{ width: 12, height: 12 }} /> Super Admin</span>
            </div>

            <div className="ap-grid">
              <div className="ap-field">
                <div className="ap-field-label">Admin ID</div>
                <div className="ap-field-value">{admin._id || admin.id}</div>
              </div>
              {admin.createdAt && (
                <div className="ap-field">
                  <div className="ap-field-label">Admin since</div>
                  <div className="ap-field-value">{new Date(admin.createdAt).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
