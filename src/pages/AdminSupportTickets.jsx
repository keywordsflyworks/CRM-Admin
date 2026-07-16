import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets, fetchTicketDetail, updateTicketStatus, addAdminComment, deleteAdminTicket, clearAdminSupportError, clearActiveTicket } from "../features/adminSupportSlice";
import Icons from "../components/icons/Icons";

const STATUS_TABS = [
  { key: "All",         label: "All" },
  { key: "open",        label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved",    label: "Resolved" },
  { key: "closed",      label: "Closed" },
];
const STATUS_LABEL = { open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed" };
const STATUS_CLASS = { open: "blue", in_progress: "violet", resolved: "green", closed: "gray" };
const PRIORITY_CLASS = { low: "gray", medium: "blue", high: "amber", urgent: "red" };

function relativeTime(date) {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}

function fmtDateTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return d.toLocaleString();
}

export default function AdminSupportTickets() {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((s) => s.adminSupport);

  const [tab, setTab] = useState("All");
  const [priority, setPriority] = useState("");
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTickets({
      status: tab !== "All" ? tab : undefined,
      priority: priority || undefined,
    }));
  }, [dispatch, tab, priority]);

  const counts = useMemo(() => {
    const c = { All: tickets.length, open: 0, in_progress: 0, resolved: 0, closed: 0 };
    tickets.forEach((t) => { if (c[t.status] != null) c[t.status]++; });
    return c;
  }, [tickets]);

  const rows = tickets.filter((t) => {
    if (!q) return true;
    const hay = `${t.subject} ${t.category} ${t.workspace?.name || ""} ${t.workspace?.email || ""} ${t.workspace?.companyName || ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="ast-page">
      <style>{PAGE_CSS}</style>

      <div className="ast-head">
        <div>
          <h1 className="ast-title">Support Tickets</h1>
          <p className="ast-sub">{tickets.length} ticket{tickets.length === 1 ? "" : "s"} across every workspace</p>
        </div>
        <div className="ast-search">
          <Icons.search />
          <input placeholder="Search subject, workspace, company…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {error && (
        <div className="ast-error">
          {error} <button onClick={() => dispatch(clearAdminSupportError())}>Dismiss</button>
        </div>
      )}

      <div className="ast-toolbar">
        <div className="ast-seg">
          {STATUS_TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              {t.label} <span className="ast-ct">{counts[t.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <select className="ast-priority-filter" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="ast-table-wrap">
        <table className="ast-table">
        <thead>
  <tr>
    <th>Subject</th><th>Workspace</th><th>Raised By</th><th>Category</th>
    <th>Priority</th><th>Status</th><th>Raised</th><th>Updated</th>
  </tr>
</thead>
<tbody>
  {rows.map((t) => (
    <tr key={t._id} className="ast-row" onClick={() => setActiveId(t._id)}>
      <td className="ast-subject">
        {t.unreadForSupport && <span className="ast-unread-dot" title="Unread" />}
        {t.subject}
      </td>
      <td>
        <div className="ast-ws-name">{t.workspace?.companyName || t.workspace?.name || "—"}</div>
        <div className="ast-ws-email">{t.workspace?.email || ""}</div>
      </td>
      <td className="ast-dim">{t.createdByName || "—"}</td>
      <td>{t.category}</td>
              <td><span className={`ast-pill ${PRIORITY_CLASS[t.priority] || "gray"}`}><i className="ast-dot" />{t.priority}</span></td>
<td><span className={`ast-pill ${STATUS_CLASS[t.status] || "gray"}`}><i className="ast-dot" />{STATUS_LABEL[t.status] || t.status}</span></td>
                <td>{fmtDateTime(t.createdAt)}</td>
                <td>{fmtDateTime(t.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && <div className="ast-empty">No tickets match your filters.</div>}
      </div>

      {activeId && (
        <TicketDrawer
          id={activeId}
          onClose={() => { setActiveId(null); dispatch(clearActiveTicket()); }}
        />
      )}
    </div>
  );
}

function TicketDrawer({ id, onClose }) {
  const dispatch = useDispatch();
  const { activeTicket, saving } = useSelector((s) => s.adminSupport);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false); // NEW

  useEffect(() => { dispatch(fetchTicketDetail(id)); }, [id, dispatch]);

  const ticket = activeTicket?.ticket;
  const comments = activeTicket?.comments || [];

  function changeStatus(status) {
    dispatch(updateTicketStatus({ id, data: { status } }));
  }
  function changePriority(priorityVal) {
    dispatch(updateTicketStatus({ id, data: { priority: priorityVal } }));
  }

  function submitReply(e) {
    e.preventDefault();
    if (!message.trim()) return;
    dispatch(addAdminComment({ id, message: message.trim() }));
    setMessage("");
  }

  function handleDelete() {
    dispatch(deleteAdminTicket(id)).unwrap().then(() => onClose());
  }

  return (
    <>
      <div className="ast-scrim" onClick={onClose} />
      <div className="ast-drawer">
        <div className="ast-drawer-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="ast-drawer-title">{ticket?.subject || "Loading…"}</h2>
            {ticket && (
              <div className="ast-drawer-sub">
                {ticket.workspace?.companyName || ticket.workspace?.name} · {ticket.workspace?.email}
              </div>
            )}
          </div>
          <button className="ast-icon-btn" onClick={onClose}><Icons.x style={{ width: 18, height: 18 }} /></button>
        </div>

        <div className="ast-drawer-body">
          {!ticket && <div className="ast-dim">Loading ticket…</div>}
          {ticket && (
            <>
              <div className="ast-field-row">
                <label>Status</label>
                <select value={ticket.status} onChange={(e) => changeStatus(e.target.value)} disabled={saving}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="ast-field-row">
                <label>Priority</label>
                <select value={ticket.priority} onChange={(e) => changePriority(e.target.value)} disabled={saving}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            <button className="ast-delete-btn" disabled={saving} onClick={() => setConfirmDelete(true)}>
                {saving ? "Deleting…" : "Delete Ticket"}
              </button>

             <div className="ast-kv"><div className="k">Category</div><div className="v">{ticket.category}</div></div>
<div className="ast-kv"><div className="k">Raised By</div><div className="v">{ticket.createdByName || "—"}</div></div>
<div className="ast-kv"><div className="k">Description</div><div className="v" style={{ whiteSpace: "pre-wrap" }}>{ticket.description}</div></div>
<div className="ast-kv"><div className="k">Raised</div><div className="v">{new Date(ticket.createdAt).toLocaleString()}</div></div>
              <div className="ast-sect">Conversation</div>
              <div className="ast-thread">
                {comments.length === 0 && <div className="ast-dim" style={{ fontSize: 13 }}>No replies yet.</div>}
                {comments.map((c) => (
                  <div key={c._id} className={`ast-comment ${c.authorType === "superadmin" ? "mine" : "theirs"}`}>
                    <div className="ast-comment-head">
                      <span>{c.authorType === "superadmin" ? "You (Support)" : "Workspace"}</span>
                      <span className="ast-comment-time">{relativeTime(c.createdAt)}</span>
                    </div>
                    <div className="ast-comment-body">{c.message}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={submitReply} className="ast-reply">
                <textarea rows={2} placeholder="Reply to the workspace…" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" disabled={!message.trim()}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
     {confirmDelete && (
        <ConfirmModal
          title="Delete this ticket?"
          message="This can't be undone."
          confirmLabel="Delete"
          danger
          onConfirm={() => { setConfirmDelete(false); handleDelete(); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}function ConfirmModal({ title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  return (
    <div className="ast-confirm-overlay" onClick={onCancel}>
      <div className="ast-confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="ast-confirm-title">{title}</div>
        {message && <div className="ast-confirm-msg">{message}</div>}
        <div className="ast-confirm-actions">
          <button className="ast-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className={`ast-confirm-ok${danger ? " danger" : ""}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const PAGE_CSS = `
.ast-page { padding: 28px 32px; color: #1c1f2b; }
.ast-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.ast-title { font-size: 20px; font-weight: 700; color: #1c1f2b; margin: 0; }
.ast-sub { font-size: 12.5px; color: #6b7280; margin: 4px 0 0; }
.ast-search { display: flex; align-items: center; gap: 8px; background: #f7f8fb; border: 1px solid #e1e4ec; border-radius: 9px; padding: 8px 12px; min-width: 280px; }
.ast-search:focus-within { border-color: #7b5ce8; box-shadow: 0 0 0 3px rgba(123,92,232,.12); background: #fff; }
.ast-search input { background: none; border: none; outline: none; color: #1c1f2b; font-size: 13px; flex: 1; }
.ast-search svg { width: 15px; height: 15px; color: #8a90a2; flex-shrink: 0; }
.ast-error { background: #fde8e8; border: 1px solid #f3b7b7; color: #c0392b; padding: 10px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 13px; }
.ast-error button { background: none; border: none; color: #c0392b; text-decoration: underline; cursor: pointer; font: inherit; margin-left: 8px; }
.ast-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.ast-seg { display: flex; background: #fff; border: 1px solid #e1e4ec; border-radius: 9px; padding: 3px; gap: 2px; }
.ast-seg button { font-size: 13px; font-weight: 500; color: #4b5163; background: none; border: none; border-radius: 7px; padding: 5px 12px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: inherit; }
.ast-seg button.active { background: rgba(123,92,232,.1); color: #7b5ce8; font-weight: 600; }
.ast-ct { font-size: 11px; font-weight: 700; background: #eef0f5; color: #6b7280; padding: 1px 5px; border-radius: 8px; }
.ast-seg button.active .ast-ct { background: rgba(123,92,232,.18); color: #7b5ce8; }
.ast-priority-filter { border: 1px solid #e1e4ec; border-radius: 9px; padding: 7px 12px; font-size: 13px; color: #4b5163; background: #fff; font-family: inherit; }
.ast-table-wrap { background: #fff; border: 1px solid #e7e9f0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(20,20,50,.06); }
.ast-table { width: 100%; border-collapse: collapse; }
.ast-table th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #9aa0b0; padding: 12px 18px; border-bottom: 1px solid #e7e9f0; background: #f7f8fb; white-space: nowrap; }
.ast-table td { padding: 13px 18px; font-size: 13px; color: #2b2f3d; border-bottom: 1px solid #f0f1f5; white-space: nowrap; }
.ast-table tr:last-child td { border-bottom: none; }
.ast-row { cursor: pointer; }
.ast-row:hover { background: #f7f8fb; }
.ast-subject { font-weight: 600; }
.ast-unread-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#7b5ce8; margin-right:8px; flex-shrink:0; vertical-align:middle; }
.ast-ws-name { font-weight: 600; }
.ast-ws-email { font-size: 11.5px; color: #6b7280; }
.ast-pill { display: inline-flex; align-items: center;  gap: 5px; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; text-transform: capitalize; }
.ast-pill.blue { background: rgba(79,184,217,.12); color: #2c96b3; }
.ast-pill.violet { background: rgba(123,92,232,.1); color: #7b5ce8; }
.ast-pill.green { background: rgba(46,160,90,.12); color: #1e8449; }
.ast-pill.gray { background: #eef0f5; color: #6b7280; }
.ast-pill.amber { background: rgba(230,161,29,.13); color: #b7791f; }
.ast-pill.red { background: rgba(220,38,38,.1); color: #c0392b; }
.ast-empty { padding: 60px 20px; text-align: center; color: #6b7280; font-size: 13px; }
.ast-scrim { position: fixed; inset: 0; background: rgba(18,24,40,.38); z-index: 400; }
.ast-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 480px; max-width: 96vw; background: #fff; z-index: 401; box-shadow: -20px 0 50px rgba(18,24,40,.18); display: flex; flex-direction: column; }
.ast-drawer-head { display: flex; align-items: flex-start; gap: 12px; padding: 18px 22px 16px; border-bottom: 1px solid #e7e9f0; flex-shrink: 0; }
.ast-drawer-title { margin: 0; font-size: 16px; font-weight: 700; }
.ast-drawer-sub { font-size: 12px; color: #6b7280; margin-top: 3px; }
.ast-icon-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 7px; cursor: pointer; color: #6b7280; }
.ast-icon-btn:hover { background: #f7f8fb; color: #1c1f2b; }
.ast-drawer-body { flex: 1; overflow-y: auto; padding: 20px 22px; }
.ast-field-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.ast-field-row label { font-size: 12.5px; font-weight: 600; color: #6b7280; }
.ast-field-row select { border: 1px solid #e1e4ec; border-radius: 8px; padding: 6px 10px; font-size: 13px; font-family: inherit; color: #1c1f2b; background: #fff; }
.ast-kv { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f1f5; font-size: 13px; }
.ast-kv .k { width: 34%; color: #6b7280; font-weight: 500; flex-shrink: 0; }
.ast-kv .v { flex: 1; font-weight: 500; word-break: break-word; }
.ast-sect { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #9aa0b0; margin: 22px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e7e9f0; }
.ast-dim { color: #6b7280; }
.ast-thread { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.ast-comment { border-radius: 10px; padding: 10px 13px; font-size: 13px; border: 1px solid #e7e9f0; }
.ast-comment.mine { background: rgba(123,92,232,.08); border-color: rgba(123,92,232,.2); }
.ast-comment.theirs { background: #f7f8fb; }
.ast-comment-head { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; font-weight: 600; font-size: 12px; }
.ast-comment-time { font-weight: 400; color: #9aa0b0; font-size: 11px; }
.ast-comment-body { white-space: pre-wrap; line-height: 1.5; }
.ast-reply { display: flex; flex-direction: column; gap: 8px; }
.ast-reply textarea { width: 100%; border: 1px solid #e1e4ec; border-radius: 9px; padding: 10px 13px; font-family: inherit; font-size: 13px; resize: vertical; box-sizing: border-box; }
.ast-reply textarea:focus { outline: none; border-color: #7b5ce8; box-shadow: 0 0 0 3px rgba(123,92,232,.12); }
.ast-reply button { align-self: flex-end; background: #7b5ce8; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
.ast-reply button:disabled { opacity: .5; cursor: not-allowed; }
.ast-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

.ast-delete-btn { align-self:flex-start; background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; border-radius:8px; padding:7px 14px; font-size:13px; font-weight:600; cursor:pointer; margin-bottom:16px; }
.ast-delete-btn:hover { background:#fecaca; }
.ast-delete-btn:disabled { opacity:.6; cursor:not-allowed; }
.ast-confirm-overlay { position: fixed; inset: 0; background: rgba(18,24,40,.5); z-index: 500; display: flex; align-items: center; justify-content: center; }
.ast-confirm-box { background: #fff; border-radius: 14px; padding: 22px 24px; width: 320px; max-width: 90vw; box-shadow: 0 20px 50px rgba(18,24,40,.25); }
.ast-confirm-title { font-size: 15px; font-weight: 700; color: #1c1f2b; margin-bottom: 6px; }
.ast-confirm-msg { font-size: 13px; color: #6b7280; margin-bottom: 18px; }
.ast-confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }
.ast-confirm-cancel { background: #f7f8fb; border: 1px solid #e1e4ec; color: #4b5163; font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 8px; cursor: pointer; }
.ast-confirm-cancel:hover { background: #eef0f5; }
.ast-confirm-ok { background: #7b5ce8; color: #fff; border: none; font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 8px; cursor: pointer; }
.ast-confirm-ok:hover { opacity: .9; }
.ast-confirm-ok.danger { background: #dc2626; }
`;