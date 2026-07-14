import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWorkspaces } from "../features/adminSlice";
import Icons from "../components/icons/Icons";

export default function AdminWorkspaces() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workspaces = useSelector((s) => s.admin.workspaces);
  const pagination = useSelector((s) => s.admin.pagination);
  const loading = useSelector((s) => s.admin.status.fetchWorkspaces === "loading");
  const error = useSelector((s) => s.admin.error);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchWorkspaces({ search, page, limit: 20 }));
  }, [dispatch, page]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    dispatch(fetchWorkspaces({ search, page: 1, limit: 20 }));
  }

  return (
    <>
      <style>{`
        .aw-page { padding: 28px 32px; color: #1c1f2b; }
        .aw-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .aw-title { font-size: 20px; font-weight: 700; color: #1c1f2b; margin: 0; }
        .aw-sub { font-size: 12.5px; color: #6b7280; margin: 4px 0 0; }
        .aw-search { display: flex; align-items: center; gap: 8px; background: #f7f8fb; border: 1px solid #e1e4ec; border-radius: 9px; padding: 8px 12px; min-width: 260px; transition: border-color .12s, box-shadow .12s; }
        .aw-search:focus-within { border-color: #7b5ce8; box-shadow: 0 0 0 3px rgba(123,92,232,.12); background: #ffffff; }
        .aw-search input { background: none; border: none; outline: none; color: #1c1f2b; font-size: 13px; flex: 1; }
        .aw-search input::placeholder { color: #a0a5b4; }
        .aw-search svg { width: 15px; height: 15px; color: #8a90a2; flex-shrink: 0; }

        .aw-table-wrap { background: #ffffff; border: 1px solid #e7e9f0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(20,20,50,.06); }
        .aw-table { width: 100%; border-collapse: collapse; }
        .aw-table th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #9aa0b0; padding: 12px 18px; border-bottom: 1px solid #e7e9f0; background: #f7f8fb; }
        .aw-table td { padding: 14px 18px; font-size: 13px; color: #2b2f3d; border-bottom: 1px solid #f0f1f5; }
        .aw-table tr:last-child td { border-bottom: none; }
        .aw-row { cursor: pointer; transition: background .1s; }
        .aw-row:hover { background: #f7f8fb; }
        .aw-owner-name { font-weight: 600; color: #1c1f2b; }
        .aw-owner-email { font-size: 11.5px; color: #6b7280; }
        .aw-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
        .aw-pill.ok { background: rgba(79,184,217,.12); color: #2c96b3; border: 1px solid rgba(79,184,217,.35); }
        .aw-pill.pending { background: rgba(123,92,232,.1); color: #7b5ce8; border: 1px solid rgba(123,92,232,.3); }
        .aw-count { font-weight: 600; color: #1c1f2b; }
        .aw-empty { padding: 60px 20px; text-align: center; color: #6b7280; font-size: 13px; }
        .aw-error { padding: 14px 18px; color: #c0392b; font-size: 13px; }
        .aw-pager { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 14px 18px; font-size: 12.5px; color: #6b7280; }
        .aw-pager button { background: #f7f8fb; border: 1px solid #e1e4ec; color: #2b2f3d; border-radius: 7px; padding: 6px 12px; cursor: pointer; font-size: 12.5px; }
        .aw-pager button:disabled { opacity: .4; cursor: not-allowed; }
      `}</style>

      <div className="aw-page">
        <div className="aw-head">
          <div>
            <h1 className="aw-title">Workspaces</h1>
            <p className="aw-sub">{pagination.total} workspace{pagination.total === 1 ? "" : "s"} registered on the platform</p>
          </div>
          <form className="aw-search" onSubmit={handleSearchSubmit}>
            <Icons.search />
            <input
              placeholder="Search by name, email, or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="aw-table-wrap">
          {error && <div className="aw-error">{error}</div>}

          {!error && (
            <table className="aw-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Company</th>
                  <th>Team size</th>
                  <th>Onboarding</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map((w) => (
                  <tr key={w.id} className="aw-row" onClick={() => navigate(`/workspaces/${w.id}`)}>
                    <td>
                      <div className="aw-owner-name">{w.ownerName}</div>
                      <div className="aw-owner-email">{w.ownerEmail}</div>
                    </td>
                    <td>{w.company?.name || "—"}</td>
                    <td className="aw-count">{w.teamMemberCount}</td>
                    <td>
                      {w.onboardingComplete
                        ? <span className="aw-pill ok"><Icons.checkCircle style={{ width: 11, height: 11 }} /> Complete</span>
                        : <span className="aw-pill pending"><Icons.clock style={{ width: 11, height: 11 }} /> In progress</span>}
                    </td>
                    <td>{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!error && !loading && workspaces.length === 0 && (
            <div className="aw-empty">No workspaces match your search.</div>
          )}

          {!error && pagination.pages > 1 && (
            <div className="aw-pager">
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} type="button">Prev</button>
              <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} type="button">Next</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}