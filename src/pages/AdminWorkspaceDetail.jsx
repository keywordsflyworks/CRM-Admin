import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkspaceDetail, clearWorkspaceDetail } from "../features/adminSlice";
import Icons from "../components/icons/Icons";

export default function AdminWorkspaceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detail = useSelector((s) => s.admin.workspaceDetail);
  const loading = useSelector((s) => s.admin.status.fetchWorkspaceDetail === "loading");
  const error = useSelector((s) => s.admin.error);

  useEffect(() => {
    dispatch(fetchWorkspaceDetail(id));
    return () => dispatch(clearWorkspaceDetail());
  }, [dispatch, id]);

  const owner = detail?.owner;
  const members = detail?.members || [];

  return (
    <>
      <style>{`
        .wd-page { padding: 28px 32px; color: #1c1f2b; }
        .wd-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #6b7280; font-size: 12.5px; cursor: pointer; padding: 0; margin-bottom: 16px; }
        .wd-back:hover { color: #1c1f2b; }
        .wd-back svg { width: 14px; height: 14px; }

        .wd-owner-card { background: #ffffff; border: 1px solid #e7e9f0; border-radius: 12px; padding: 22px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 24px; box-shadow: 0 6px 24px rgba(20,20,50,.06); }
        .wd-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg,#7b5ce8,#4fb8d9); color: #ffffff; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .wd-owner-name { font-size: 17px; font-weight: 700; color: #1c1f2b; }
        .wd-owner-meta { font-size: 12.5px; color: #6b7280; margin-top: 3px; }
        .wd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-left: auto; }
        .wd-stat-label { font-size: 10.5px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #9aa0b0; }
        .wd-stat-value { font-size: 14px; font-weight: 600; color: #2b2f3d; margin-top: 3px; }

        .wd-section-title { font-size: 14px; font-weight: 700; color: #1c1f2b; margin: 0 0 12px; }
        .wd-table-wrap { background: #ffffff; border: 1px solid #e7e9f0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(20,20,50,.06); }
        .wd-table { width: 100%; border-collapse: collapse; }
        .wd-table th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #9aa0b0; padding: 12px 18px; border-bottom: 1px solid #e7e9f0; background: #f7f8fb; }
        .wd-table td { padding: 13px 18px; font-size: 13px; color: #2b2f3d; border-bottom: 1px solid #f0f1f5; }
        .wd-table tr:last-child td { border-bottom: none; }
        .wd-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
        .wd-pill.active { background: rgba(79,184,217,.12); color: #2c96b3; border: 1px solid rgba(79,184,217,.35); }
        .wd-pill.pending { background: rgba(123,92,232,.1); color: #7b5ce8; border: 1px solid rgba(123,92,232,.3); }
        .wd-empty { padding: 40px 20px; text-align: center; color: #6b7280; font-size: 13px; }
        .wd-error { padding: 14px 18px; color: #c0392b; font-size: 13px; }
      `}</style>

      <div className="wd-page">
        <button className="wd-back" onClick={() => navigate("/workspaces")} type="button">
          <Icons.arrowR style={{ transform: "rotate(180deg)" }} /> Back to workspaces
        </button>

        {error && <div className="wd-error">{error}</div>}

        {!error && owner && (
          <>
            <div className="wd-owner-card">
              <div className="wd-avatar">
                {owner.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="wd-owner-name">{owner.name}</div>
                <div className="wd-owner-meta">{owner.email} · {owner.jobTitle}</div>
              </div>
              <div className="wd-grid">
                <div>
                  <div className="wd-stat-label">Company</div>
                  <div className="wd-stat-value">{owner.company?.name || "—"}</div>
                </div>
                <div>
                  <div className="wd-stat-label">Team size</div>
                  <div className="wd-stat-value">{members.length}</div>
                </div>
                <div>
                  <div className="wd-stat-label">Joined</div>
                  <div className="wd-stat-value">{owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : "—"}</div>
                </div>
              </div>
            </div>

            <h2 className="wd-section-title">Team members</h2>
            <div className="wd-table-wrap">
              <table className="wd-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m._id}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.role?.name || "—"}</td>
                      <td>
                        {m.status === "active"
                          ? <span className="wd-pill active"><Icons.checkCircle style={{ width: 11, height: 11 }} /> Active</span>
                          : <span className="wd-pill pending"><Icons.clock style={{ width: 11, height: 11 }} /> Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {members.length === 0 && <div className="wd-empty">No team members invited yet.</div>}
            </div>
          </>
        )}

        {!error && !owner && !loading && <div className="wd-empty">Workspace not found.</div>}
      </div>
    </>
  );
}