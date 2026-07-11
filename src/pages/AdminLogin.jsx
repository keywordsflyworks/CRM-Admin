import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, clearAdminError } from "../features/adminSlice";
import Icons from "../components/icons/Icons";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((s) => s.admin.status.login === "loading");
  const serverError = useSelector((s) => s.admin.error);

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); dispatch(clearAdminError()); setLocalError(""); };

  async function handleSubmit() {
    setLocalError("");
    if (!form.email || !form.password) { setLocalError("Email and password are required."); return; }

    const result = await dispatch(loginAdmin({ email: form.email, password: form.password }));
    if (loginAdmin.fulfilled.match(result)) {
      navigate("/workspaces");
    }
  }

  return (
    <>
      <style>{`
        .al-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 20% 20%, #1c2333 0%, #0b0e16 55%, #06070c 100%);
          font-family: 'Geist', system-ui, sans-serif;
          padding: 24px;
        }
        .al-card {
          width: 100%;
          max-width: 380px;
          background: #11141d;
          border: 1px solid #232a3b;
          border-radius: 14px;
          padding: 32px 30px 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,.5);
        }
        .al-brand {
          display: flex; align-items: center; gap: 10px; margin-bottom: 22px;
        }
        .al-brand-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #f5a623, #d94f4f);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .al-brand-name { font-size: 15px; font-weight: 700; color: #f2f3f7; letter-spacing: -.2px; }
        .al-brand-sub  { font-size: 10.5px; font-weight: 600; color: #f5a623; letter-spacing: .6px; text-transform: uppercase; }
        .al-title { font-size: 21px; font-weight: 700; color: #f2f3f7; margin: 4px 0 4px; }
        .al-sub   { font-size: 13px; color: #757e94; margin: 0 0 22px; }
        .al-field { margin-bottom: 14px; }
        .al-field label {
          display: block; font-size: 12.5px; font-weight: 600; color: #a2a9bb; margin-bottom: 6px;
        }
        .al-field input {
          width: 100%; box-sizing: border-box;
          background: #0b0e16; border: 1px solid #262d40; border-radius: 8px;
          padding: 10px 12px; font-size: 13.5px; color: #f2f3f7;
          outline: none; transition: border-color .12s;
        }
        .al-field input:focus { border-color: #f5a623; }
        .al-field input::placeholder { color: #4c5468; }
        .al-input-wrap { position: relative; }
        .al-input-btn {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #757e94; cursor: pointer; padding: 2px;
        }
        .al-error {
          display: flex; align-items: center; gap: 7px;
          background: rgba(217,79,79,.12); border: 1px solid rgba(217,79,79,.35);
          color: #f18b8b; font-size: 12.5px; border-radius: 8px; padding: 9px 11px;
          margin-bottom: 14px;
        }
        .al-btn {
          width: 100%; border: none; border-radius: 8px; padding: 11px;
          background: linear-gradient(135deg, #f5a623, #d94f4f);
          color: #14151b; font-size: 13.5px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity .12s;
        }
        .al-btn:disabled { opacity: .6; cursor: not-allowed; }
        .al-footer {
          margin-top: 18px; font-size: 11.5px; color: #4c5468; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
      `}</style>

      <div className="al-shell">
        <div className="al-card">
          <div className="al-brand">
            <div className="al-brand-icon"><Icons.shield style={{ width: 17, height: 17, color: "#14151b" }} /></div>
            <div>
              <div className="al-brand-name">KeywordsFly</div>
              <div className="al-brand-sub">Platform Admin</div>
            </div>
          </div>

          <h1 className="al-title">Admin console</h1>
          <p className="al-sub">Restricted access — platform administrators only.</p>

          <div className="al-field">
            <label>Admin email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="admin@keywordsfly.com"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="al-field">
            <label>Password</label>
            <div className="al-input-wrap">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button className="al-input-btn" type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                {showPass ? <Icons.eyeOff style={{ width: 15, height: 15 }} /> : <Icons.eye style={{ width: 15, height: 15 }} />}
              </button>
            </div>
          </div>

          {(localError || serverError) && (
            <div className="al-error">
              <Icons.alert style={{ width: 14, height: 14, flexShrink: 0 }} />
              {localError || serverError}
            </div>
          )}

          <button className="al-btn" onClick={handleSubmit} disabled={loading} type="button">
            {loading ? "Signing in…" : "Sign in"} {!loading && <Icons.arrowR style={{ width: 14, height: 14 }} />}
          </button>

          <div className="al-footer">
            <Icons.shield style={{ width: 12, height: 12 }} />
           Admin accounts are provisioned via server-side seeding only.
          </div>
        </div>
      </div>
    </>
  );
}
