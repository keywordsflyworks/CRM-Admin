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
        .ap-page { padding: 28px 32px; color: #1c1f2b; max-width: 640px; }
        .ap-title { font-size: 20px; font-weight: 700; color: #1c1f2b; margin: 0 0 4px; }
        .ap-sub { font-size: 12.5px; color: #6b7280; margin: 0 0 24px; }

        .ap-card { background: #ffffff; border: 1px solid #e7e9f0; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 18px; margin-bottom: 20px; box-shadow: 0 6px 24px rgba(20,20,50,.06); }
        .ap-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#7b5ce8,#4fb8d9); color: #ffffff; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ap-name { font-size: 17px; font-weight: 700; color: #1c1f2b; }
        .ap-email { font-size: 13px; color: #6b7280; margin-top: 3px; }
        .ap-role-badge { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .4px; color: #7b5ce8; background: rgba(123,92,232,.08); border: 1px solid rgba(123,92,232,.25); padding: 5px 12px; border-radius: 20px; text-transform: uppercase; }

        .ap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
        .ap-field { background: #ffffff; border: 1px solid #e7e9f0; border-radius: 10px; padding: 14px 16px; }
        .ap-field-label { font-size: 10.5px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #9aa0b0; }
        .ap-field-value { font-size: 13.5px; font-weight: 600; color: #2b2f3d; margin-top: 5px; word-break: break-all; }

        .ap-error { padding: 14px 16px; color: #c0392b; font-size: 13px; background: rgba(217,79,79,.08); border: 1px solid rgba(217,79,79,.25); border-radius: 10px; }
        .ap-loading { color: #6b7280; font-size: 13px; }
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