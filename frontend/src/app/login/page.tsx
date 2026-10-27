"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const REMEMBER_KEY = "collegePredictorRememberedEmail";

type LoginResponse = {
  status?: string;
  message?: string;
  detail?: unknown;
  access_token?: string;
  token_type?: string;
  student?: {
    id: number;
    full_name: string;
    email: string;
    mobile: string;
  };
};

/* ---------- Small inline icons (no extra dependencies) ---------- */

const Icon = {
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.5 4.5-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
      <path d="M22 9v6" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.5" r=".6" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12.3 2.8 2.8L16 9.5" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  ),
};

const FEATURES = [
  {
    icon: Icon.trend,
    title: "Historical Cutoff Data",
    description: "Explore college cutoff trends across CAP rounds.",
  },
  {
    icon: Icon.target,
    title: "Smart College Predictions",
    description: "Find the best options for your percentile and category.",
  },
  {
    icon: Icon.bookmark,
    title: "Saved Predictions",
    description: "Keep track of your prediction history in one place.",
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Restore remembered email (never the password).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, []);

  function clearFeedback() {
    setError("");
    setMessage("");
  }

  function validate() {
    const errors: { email?: string; password?: string } = {};
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return { valid: Object.keys(errors).length === 0, normalizedEmail };
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();

    const { valid, normalizedEmail } = validate();
    if (!valid) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data: LoginResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Keep auth failures generic; FastAPI `detail` may be an object/array.
        if ([400, 401, 403, 422].includes(response.status)) {
          setError("Incorrect email or password.");
        } else {
          setError("Unable to log in right now. Please try again.");
        }
        return;
      }

      if (!data.access_token || !data.student) {
        setError(
          "The server did not return an authentication token. Please contact support."
        );
        return;
      }

      sessionStorage.setItem("collegePredictorToken", data.access_token);
      sessionStorage.setItem(
        "collegePredictorStudent",
        JSON.stringify({
          id: data.student.id,
          full_name: data.student.full_name,
          email: data.student.email,
          mobile: data.student.mobile,
        })
      );

      try {
        if (rememberMe) localStorage.setItem(REMEMBER_KEY, normalizedEmail);
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {
        /* ignore */
      }

      setMessage("Login successful! Redirecting...");
      window.location.assign("/predict");
    } catch {
      setError(
        "Cannot connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>

      <main className="lp-page">
        <div className="lp-overlay" />

        {/* ---------- Top brand bar ---------- */}
        <header className="lp-header">
          <div className="lp-brand">
            <span className="lp-brand-mark">{Icon.cap}</span>
            <span className="lp-brand-text">
              <span className="lp-brand-name">College Predictor</span>
              <span className="lp-brand-sub">MHT-CET · Maharashtra</span>
            </span>
          </div>
        </header>

        <div className="lp-content">
          {/* ---------- Left: hero ---------- */}
          <section className="lp-hero" aria-label="About College Predictor">
            <span className="lp-pill">
              <span className="lp-pill-dot" /> Engineering admissions 2026
            </span>

            <h1 className="lp-title">
              Smart Prediction.
              <br />
              Better Choices.
              <br />
              <span className="lp-title-accent">Bright Future.</span>
            </h1>

            <div className="lp-rule" />

            <p className="lp-lead">
              Explore engineering college options using historical MHT-CET
              cutoff data. Compare branches, categories, cities, and CAP
              rounds to make informed decisions about your future.
            </p>

            <ul className="lp-features">
              {FEATURES.map((item) => (
                <li key={item.title} className="lp-feature">
                  <span className="lp-feature-icon">{item.icon}</span>
                  <span>
                    <span className="lp-feature-title">{item.title}</span>
                    <span className="lp-feature-desc">{item.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Right: login card ---------- */}
          <section className="lp-card" aria-labelledby="login-heading">
            <div className="lp-card-head">
              <span className="lp-card-icon">{Icon.shield}</span>
              <div>
                <h2 id="login-heading" className="lp-card-title">
                  Welcome back!
                </h2>
                <p className="lp-card-sub">
                  Log in to continue to your account
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} noValidate>
              {/* Email */}
              <div className="lp-field">
                <label htmlFor="email" className="lp-label">
                  Email
                </label>
                <div
                  className={`lp-input-wrap ${
                    fieldErrors.email ? "has-error" : ""
                  }`}
                >
                  <span className="lp-input-icon">{Icon.mail}</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your registered email"
                    value={email}
                    disabled={loading}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFeedback();
                      if (fieldErrors.email)
                        setFieldErrors((f) => ({ ...f, email: undefined }));
                    }}
                    className="lp-input"
                  />
                </div>
                {fieldErrors.email && (
                  <p id="email-error" className="lp-field-error">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="lp-field">
                <label htmlFor="password" className="lp-label">
                  Password
                </label>
                <div
                  className={`lp-input-wrap ${
                    fieldErrors.password ? "has-error" : ""
                  }`}
                >
                  <span className="lp-input-icon">{Icon.lock}</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    disabled={loading}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={
                      fieldErrors.password ? "password-error" : undefined
                    }
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFeedback();
                      if (fieldErrors.password)
                        setFieldErrors((f) => ({ ...f, password: undefined }));
                    }}
                    onKeyUp={(e) =>
                      setCapsLockOn(e.getModifierState("CapsLock"))
                    }
                    onKeyDown={(e) =>
                      setCapsLockOn(e.getModifierState("CapsLock"))
                    }
                    onBlur={() => setCapsLockOn(false)}
                    className="lp-input lp-input-password"
                  />
                  <button
                    type="button"
                    className="lp-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? Icon.eyeOff : Icon.eye}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="lp-field-error">
                    {fieldErrors.password}
                  </p>
                )}
                {capsLockOn && (
                  <p className="lp-caps">Caps Lock is on</p>
                )}
              </div>

              {/* Remember + forgot */}
              <div className="lp-row">
                <label className="lp-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span className="lp-check-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  Remember me
                </label>

                <Link href="/forgot-password" className="lp-link">
                  Forgot password?
                </Link>
              </div>

              {/* Feedback */}
              <div aria-live="polite">
                {error && (
                  <div role="alert" className="lp-alert lp-alert-error">
                    {Icon.alert}
                    <span>{error}</span>
                  </div>
                )}
                {message && (
                  <div role="status" className="lp-alert lp-alert-success">
                    {Icon.check}
                    <span>{message}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="lp-submit"
              >
                {loading ? (
                  <>
                    <span className="lp-spinner" aria-hidden="true" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Log In
                    {Icon.arrow}
                  </>
                )}
              </button>
            </form>

            <p className="lp-signup">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="lp-link lp-link-strong">
                Sign up
              </Link>
            </p>

            <div className="lp-divider">
              <span>or</span>
            </div>

            <Link href="/admin/login" className="lp-admin">
              Admin login
            </Link>
          </section>
        </div>

        <footer className="lp-footer">
          © College Predictor · Predictions are based on historical data and
          are not a guarantee of admission.
        </footer>
      </main>
    </>
  );
}

/* ====================================================================== */

const css = `
.lp-page {
  --navy: #15213d;
  --navy-2: #293756;
  --blue: #3a5bff;
  --blue-soft: #e8ecff;
  --gold: #b77a26;
  --text: #172746;
  --muted: #5d6c85;
  --line: #dde3ee;
  --danger: #c62828;
  --ok: #18713a;

  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px clamp(18px, 5vw, 64px) 20px;
  box-sizing: border-box;
  color: var(--text);
  background-color: #edf3f9;
  background-image: url('/images/college-bg.jpg');
  background-size: cover;
  background-position: center;
  font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
  overflow: hidden;
  isolation: isolate;
}
.lp-page *, .lp-page *::before, .lp-page *::after { box-sizing: border-box; }
.lp-page svg {
  width: 1em; height: 1em; fill: none; stroke: currentColor;
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
  flex-shrink: 0;
}

.lp-overlay {
  position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(900px 500px at 12% 18%, rgba(58,91,255,.08), transparent 60%),
    linear-gradient(95deg, rgba(255,253,249,.97) 0%, rgba(255,253,249,.88) 45%, rgba(231,241,250,.62) 100%);
}

/* ---------- Header ---------- */
.lp-header { display: flex; justify-content: center; margin-bottom: clamp(20px, 4vh, 44px); }
.lp-brand { display: flex; align-items: center; gap: 12px; }
.lp-brand-mark {
  width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center; font-size: 24px;
  color: #fff; background: linear-gradient(135deg, var(--navy), var(--blue));
  box-shadow: 0 8px 20px rgba(41, 55, 86, .25);
}
.lp-brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.lp-brand-name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(22px, 3vw, 28px); font-weight: 700; letter-spacing: -.5px;
}
.lp-brand-sub {
  margin-top: 4px; font-size: 10px; font-weight: 700;
  letter-spacing: 2.6px; text-transform: uppercase; color: var(--gold);
}

/* ---------- Layout ---------- */
.lp-content {
  width: 100%; max-width: 1080px; margin: auto;
  display: grid; align-items: center;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 420px);
  gap: clamp(32px, 6vw, 80px);
  padding: 8px 0 24px;
}

/* ---------- Hero ---------- */
.lp-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 999px;
  font-size: 11px; font-weight: 600; letter-spacing: .3px;
  color: var(--navy-2); background: rgba(255,255,255,.75);
  border: 1px solid var(--line); backdrop-filter: blur(6px);
}
.lp-pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #2fb36b; box-shadow: 0 0 0 3px rgba(47,179,107,.2); }

.lp-title {
  margin: 18px 0 18px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(32px, 4.2vw, 46px); font-weight: 500; line-height: 1.2;
  letter-spacing: -.5px;
}
.lp-title-accent {
  background: linear-gradient(90deg, #3a5bff, #6a7dff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.lp-rule { width: 36px; height: 3px; border-radius: 2px; background: var(--gold); margin-bottom: 16px; }
.lp-lead { margin: 0; max-width: 440px; font-size: 14px; line-height: 1.8; color: var(--muted); }

.lp-features { list-style: none; padding: 0; margin: 28px 0 0; display: grid; gap: 12px; max-width: 440px; }
.lp-feature {
  display: flex; align-items: center; gap: 14px; padding: 12px 14px;
  border-radius: 12px; background: rgba(255,255,255,.7);
  border: 1px solid rgba(221,227,238,.9); backdrop-filter: blur(6px);
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.lp-feature:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 10px 26px rgba(27,42,70,.08); }
.lp-feature-icon {
  width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center;
  font-size: 19px; color: var(--blue); background: var(--blue-soft);
}
.lp-feature-title { display: block; font-size: 13px; font-weight: 700; }
.lp-feature-desc { display: block; margin-top: 3px; font-size: 12px; color: var(--muted); }

/* ---------- Card ---------- */
.lp-card {
  width: 100%; justify-self: end;
  padding: 32px 30px 26px; border-radius: 18px; background: #fff;
  border-top: 4px solid var(--navy-2);
  box-shadow: 0 24px 60px rgba(27,42,70,.16), 0 2px 6px rgba(27,42,70,.06);
  animation: lp-rise .5s ease both;
}
@keyframes lp-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.lp-card-head { display: flex; align-items: center; gap: 14px; margin-bottom: 26px; }
.lp-card-icon {
  width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
  font-size: 22px; color: var(--blue); background: var(--blue-soft);
}
.lp-card-title { margin: 0; font-family: Georgia, serif; font-size: 22px; font-weight: 600; }
.lp-card-sub { margin: 4px 0 0; font-size: 12.5px; color: #718096; }

.lp-field { margin-bottom: 18px; }
.lp-label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #24324e; }

.lp-input-wrap { position: relative; }
.lp-input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  font-size: 17px; color: #94a0b6; pointer-events: none; display: grid;
  transition: color .15s ease;
}
.lp-input {
  width: 100%; height: 48px; padding: 0 14px 0 42px;
  border: 1px solid var(--line); border-radius: 10px;
  background: #fbfcfe; color: var(--text); font-size: 14px; font-family: inherit;
  outline: none; transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}
.lp-input::placeholder { color: #9aa6ba; }
.lp-input:hover { border-color: #c5cee0; }
.lp-input:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 4px rgba(58,91,255,.14); }
.lp-input-wrap:focus-within .lp-input-icon { color: var(--blue); }
.lp-input:disabled { opacity: .7; cursor: not-allowed; }
.lp-input-password { padding-right: 48px; }
.lp-input-wrap.has-error .lp-input { border-color: var(--danger); background: #fffafa; }
.lp-input-wrap.has-error .lp-input:focus { box-shadow: 0 0 0 4px rgba(198,40,40,.12); }

.lp-toggle {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; display: grid; place-items: center;
  border: none; border-radius: 8px; background: transparent;
  color: #7c89a0; font-size: 18px; cursor: pointer; transition: background .15s, color .15s;
}
.lp-toggle:hover { background: #eef1f8; color: var(--blue); }
.lp-toggle:focus-visible { outline: 2px solid var(--blue); outline-offset: 1px; }

.lp-field-error { margin: 6px 0 0; font-size: 12px; color: var(--danger); }
.lp-caps { margin: 6px 0 0; font-size: 12px; color: #9a6a00; }

/* ---------- Remember / forgot ---------- */
.lp-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 4px 0 20px; }
.lp-check {
  display: inline-flex; align-items: center; gap: 8px; position: relative;
  font-size: 12.5px; color: #3b4a66; cursor: pointer; user-select: none;
}
.lp-check input { position: absolute; opacity: 0; width: 18px; height: 18px; margin: 0; cursor: pointer; }
.lp-check-box {
  width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #bcc6d9;
  display: grid; place-items: center; background: #fff; transition: all .15s ease;
}
.lp-check-box svg { width: 12px; height: 12px; stroke: #fff; stroke-width: 3; opacity: 0; }
.lp-check input:checked + .lp-check-box { background: var(--blue); border-color: var(--blue); }
.lp-check input:checked + .lp-check-box svg { opacity: 1; }
.lp-check input:focus-visible + .lp-check-box { box-shadow: 0 0 0 4px rgba(58,91,255,.18); }

.lp-link { font-size: 12.5px; font-weight: 600; color: var(--blue); text-decoration: none; }
.lp-link:hover { text-decoration: underline; }
.lp-link-strong { font-weight: 700; }

/* ---------- Alerts ---------- */
.lp-alert {
  display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px;
  padding: 12px 14px; border-radius: 10px; font-size: 13px; line-height: 1.5;
}
.lp-alert svg { font-size: 18px; margin-top: 1px; }
.lp-alert-error { background: #fff1f1; color: var(--danger); border: 1px solid #f6caca; }
.lp-alert-success { background: #edf8f0; color: var(--ok); border: 1px solid #c4e6cf; }

/* ---------- Submit ---------- */
.lp-submit {
  width: 100%; height: 48px; display: flex; align-items: center; justify-content: center; gap: 10px;
  border: none; border-radius: 10px; color: #fff; font-size: 14.5px; font-weight: 700; font-family: inherit;
  letter-spacing: .2px; cursor: pointer;
  background: linear-gradient(135deg, var(--navy-2), #1c2a4a);
  box-shadow: 0 10px 22px rgba(41,55,86,.28);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}
.lp-submit svg { font-size: 18px; transition: transform .15s ease; }
.lp-submit:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); box-shadow: 0 14px 28px rgba(41,55,86,.32); }
.lp-submit:hover:not(:disabled) svg { transform: translateX(3px); }
.lp-submit:active:not(:disabled) { transform: translateY(0); }
.lp-submit:focus-visible { outline: 3px solid rgba(58,91,255,.4); outline-offset: 2px; }
.lp-submit:disabled { background: #7b87a4; box-shadow: none; cursor: wait; }

.lp-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  animation: lp-spin .7s linear infinite;
}
@keyframes lp-spin { to { transform: rotate(360deg); } }

/* ---------- Footer area of card ---------- */
.lp-signup { margin: 22px 0 18px; text-align: center; font-size: 13px; color: var(--muted); }
.lp-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: #9aa4b5; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.lp-divider::before, .lp-divider::after { content: ""; flex: 1; height: 1px; background: #e8ebf0; }
.lp-admin {
  display: block; text-align: center; padding: 11px; border-radius: 10px;
  border: 1px solid var(--line); color: var(--navy-2); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: background .15s, border-color .15s, color .15s;
}
.lp-admin:hover { background: #f4f6fb; border-color: #c5cee0; color: var(--blue); }

.lp-footer { text-align: center; font-size: 11.5px; color: #7a879c; padding-top: 6px; }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .lp-content { grid-template-columns: 1fr; gap: 28px; max-width: 460px; }
  .lp-card { justify-self: stretch; order: -1; }
  .lp-hero { text-align: center; }
  .lp-lead, .lp-features { margin-left: auto; margin-right: auto; }
  .lp-rule { margin-left: auto; margin-right: auto; }
  .lp-feature { text-align: left; }
}
@media (max-width: 480px) {
  .lp-card { padding: 26px 20px 22px; }
  .lp-hero { display: none; }
  .lp-row { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .lp-page *, .lp-page *::before, .lp-page *::after { animation: none !important; transition: none !important; }
}
`;