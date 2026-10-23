
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type LoginResponse = {
  status?: string;
  message?: string;
  detail?: string;
  access_token?: string;
  token_type?: string;
  student?: {
    id: number;
    full_name: string;
    email: string;
    mobile: string;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data: LoginResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setError(
          data.detail ||
            "Login failed. Please check your email and password."
        );
        return;
      }

      if (!data.access_token || !data.student) {
        setError(
          "The backend did not return an authentication token. Check your updated backend code."
        );
        return;
      }

      // Store the authentication token for authenticated API requests.
      sessionStorage.setItem(
        "collegePredictorToken",
        data.access_token
      );

      // Store only the student information needed by the UI.
      sessionStorage.setItem(
        "collegePredictorStudent",
        JSON.stringify({
          id: data.student.id,
          full_name: data.student.full_name,
          email: data.student.email,
          mobile: data.student.mobile,
        })
      );

      setMessage("Login successful! Redirecting...");

      // Your main predictor page is frontend/src/app/page.tsx.
      window.location.assign("/predict");
    } catch {
      setError(
        "Cannot connect to the backend. Please start FastAPI and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #dce2ed",
    borderRadius: 8,
    background: "#fff",
    color: "#17233d",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#24324e",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "28px 5%",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#172746",
        backgroundColor: "#edf3f9",
        backgroundImage:
          "linear-gradient(90deg, rgba(255,253,249,.96), rgba(255,253,249,.80), rgba(231,241,250,.60)), url('/images/college-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: 42,
        }}
      >
        <div
          style={{
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          College Predictor
        </div>

        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 10,
            letterSpacing: 3,
            color: "#b77a26",
            marginTop: 8,
            fontWeight: 700,
          }}
        >
          MHT-CET · MAHARASHTRA
        </div>

        <div
          style={{
            width: 28,
            height: 3,
            background: "#c18a36",
            margin: "12px auto 0",
          }}
        />
      </header>

      <div
        style={{
          width: "100%",
          maxWidth: 1080,
          margin: "auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 45,
          alignItems: "center",
        }}
      >
        <section
          style={{
            padding: "20px 10px",
            maxWidth: 480,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(27px, 3vw, 34px)",
              fontWeight: 500,
              lineHeight: 1.3,
              margin: "0 0 20px",
            }}
          >
            Smart Prediction.
            <br />
            Better Choices.
            <br />
            <span style={{ color: "#4169ff" }}>Bright Future.</span>
          </h1>

          <div
            style={{
              width: 22,
              height: 2,
              background: "#c18a36",
              marginBottom: 14,
            }}
          />

          <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 13,
              lineHeight: 1.8,
              color: "#596a82",
              maxWidth: 390,
            }}
          >
            Explore engineering college options using historical
            MHT-CET cutoff data. Compare branches, categories, cities,
            and CAP rounds to make informed decisions about your future.
          </p>

          {[
            {
              symbol: "↗",
              title: "Historical Cutoff Data",
              description: "Explore college cutoff trends.",
            },
            {
              symbol: "✦",
              title: "College Predictions",
              description: "Compare options based on your percentile.",
            },
            {
              symbol: "♙",
              title: "Saved Predictions",
              description: "Keep track of your prediction history.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 17,
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "#e9edff",
                  color: "#4169ff",
                  fontSize: 17,
                }}
              >
                {item.symbol}
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: "#65748c",
                    marginTop: 4,
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            width: "100%",
            maxWidth: 420,
            justifySelf: "center",
            padding: "28px 25px",
            borderRadius: 14,
            background: "#fff",
            borderTop: "4px solid #293756",
            boxShadow: "0 18px 50px rgba(27, 42, 70, 0.15)",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "#4169ff",
                background: "#e9edff",
                fontSize: 18,
              }}
            >
              ♙
            </div>

            <div>
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 17,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                Welcome back!
              </h2>

              <p
                style={{
                  fontSize: 10,
                  color: "#718096",
                  margin: "5px 0 0",
                }}
              >
                Log in to continue to your account
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setMessage("");
                }}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  required
                  style={{
                    ...inputStyle,
                    paddingRight: 62,
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#4169ff",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
                marginBottom: 20,
              }}
            >
              <Link
                href="/forgot-password"
                style={{
                  fontSize: 11,
                  color: "#3159ff",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  padding: 11,
                  borderRadius: 7,
                  background: "#fff0f0",
                  color: "#c62828",
                  fontSize: 12,
                  lineHeight: 1.5,
                  marginBottom: 14,
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                role="status"
                style={{
                  padding: 11,
                  borderRadius: 7,
                  background: "#edf8f0",
                  color: "#18713a",
                  fontSize: 12,
                  lineHeight: 1.5,
                  marginBottom: 14,
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 13,
                border: "none",
                borderRadius: 8,
                background: loading ? "#7b87a4" : "#293756",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "↳  Log In"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#65748c",
              margin: "22px 0",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              style={{
                color: "#3159ff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Sign up
            </Link>
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#9aa4b5",
              fontSize: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "#e8ebf0",
              }}
            />
            OR
            <div
              style={{
                flex: 1,
                height: 1,
                background: "#e8ebf0",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <Link
              href="/admin/login"
              style={{
                color: "#3159ff",
                fontSize: 11,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Admin login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
