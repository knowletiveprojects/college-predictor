
"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";

type SignupForm = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

const initialForm: SignupForm = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d5ddec",
  borderRadius: 10,
  outline: "none",
  fontSize: 14,
  color: "#172033",
  background: "#fff",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#293750",
  marginBottom: 7,
};

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(name: keyof SignupForm, value: string) {
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(fullName)) {
      setError("Enter a valid full name using at least 2 letters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          mobile: form.mobile,
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Registration failed. Please try again."
        );
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      window.setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch {
      setError(
        "Cannot connect to FastAPI. Check that the backend is running at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 16px",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, #0c2b52 0%, #2454b7 55%, #0b1834 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 460,
          padding: "34px",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
          boxSizing: "border-box",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 26 }}>
          <div
            style={{
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#172033",
            }}
          >
            College<span style={{ color: "#2454ed" }}>Predictor</span>
          </div>

          <h1
            style={{
              fontSize: 25,
              fontWeight: 500,
              margin: "20px 0 8px",
              color: "#172033",
            }}
          >
            Create your account
          </h1>

          <p style={{ color: "#68758c", fontSize: 14, margin: 0 }}>
            Start your MHT-CET college prediction journey.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 17 }}>
            <label htmlFor="fullName" style={labelStyle}>
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={(event) =>
                updateField("fullName", event.target.value)
              }
              style={inputStyle}
              required
              maxLength={80}
            />
          </div>

          <div style={{ marginBottom: 17 }}>
            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: 17 }}>
            <label htmlFor="mobile" style={labelStyle}>
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={(event) =>
                updateField(
                  "mobile",
                  event.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              style={inputStyle}
              required
              maxLength={10}
            />
          </div>

          <div style={{ marginBottom: 17 }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              style={inputStyle}
              required
              minLength={8}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              style={inputStyle}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: "#fff0f0",
                color: "#c62828",
                padding: 12,
                borderRadius: 9,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              style={{
                background: "#eaf8ef",
                color: "#18713a",
                padding: 12,
                borderRadius: 9,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 10,
              background: loading ? "#8299e9" : "#2454ed",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 23,
            marginBottom: 0,
            color: "#68758c",
            fontSize: 14,
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#2454ed",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
