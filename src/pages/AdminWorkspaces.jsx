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
        .aw-page { padding: 28px 32px; color: #e7e9ef; }
        .aw-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .aw-title { font-size: 20px; font-weight: 700; color: #f2f3f7; margin: 0; }
        .aw-sub { font-size: 12.5px; color: #757e94; margin: 4px 0 0; }
        .aw-search { display: flex; align-items: center; gap: 8px; background: #11141d; border: 1px solid #232a3b; border-radius: 9px; padding: 8px 12px; min-width: 260px; }
        .aw-search input { background: none; border: none; outline: none; color: #f2f3f7; font-size: 13px; flex: 1; }
        .aw-search input::placeholder { color: #4c5468; }
        .aw-search svg { width: 15px; height: 15px; color: #757e94; flex-shrink: 0; }

        .aw-table-wrap { background: #0b0e16; border: 1px solid #1c2233; border-radius: 12px; overflow: hidden; }
        .aw-table { width: 100%; border-collapse: collapse; }
        .aw-table th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #4c5468; padding: 12px 18px; border-bottom: 1px solid #1c2233; background: #0e121b; }
        .aw-table td { padding: 14px 18px; font-size: 13px; color: #d5d8e2; border-bottom: 1px solid #161c29; }
        .aw-table tr:last-child td { border-bottom: none; }
        .aw-row { cursor: pointer; transition: background .1s; }
        .aw-row:hover { background: #11141d; }
        .aw-owner-name { font-weight: 600; color: #f2f3f7; }
        .aw-owner-email { font-size: 11.5px; color: #757e94; }
        .aw-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
        .aw-pill.ok { background: rgba(15,181,166,.12); color: #34d6c8; border: 1px solid rgba(15,181,166,.3); }
        .aw-pill.pending { background: rgba(245,166,35,.12); color: #f5a623; border: 1px solid rgba(245,166,35,.3); }
        .aw-count { font-weight: 600; color: #f2f3f7; }
        .aw-empty { padding: 60px 20px; text-align: center; color: #757e94; font-size: 13px; }
        .aw-error { padding: 14px 18px; color: #f18b8b; font-size: 13px; }
        .aw-pager { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 14px 18px; font-size: 12.5px; color: #757e94; }
        .aw-pager button { background: #11141d; border: 1px solid #232a3b; color: #d5d8e2; border-radius: 7px; padding: 6px 12px; cursor: pointer; font-size: 12.5px; }
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
