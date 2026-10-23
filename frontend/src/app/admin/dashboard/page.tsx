
"use client";

import { useEffect, useMemo, useState } from "react";

type Prediction = {
  institute_code?: string | number;
  college_name?: string;
  institute_name?: string;
  location?: string | null;
  branch_name?: string;
  prediction?: string;
  historical_cutoff_percentile?: number;
  percentile_difference?: number;
};

type History = {
  id: number;
  student_percentile: number;
  category: string;
  branch: string;
  cap_round: number;
  city?: string | null;
  predictions: Prediction[];
  created_at: string;
};

type Student = {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  created_at: string;
  prediction_count: number;
  prediction_history: History[];
};

type DashboardData = {
  total_students: number;
  students: Student[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selected, setSelected] = useState<Student | null>(null);

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/students", {
        cache: "no-store",
        credentials: "same-origin",
      });

      const result = await response.json();

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Could not load student records.");
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudents();
  }, []);

  const students = data?.students ?? [];

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        students.flatMap((student) =>
          student.prediction_history.map((history) => history.category)
        )
      )
    ).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !term ||
        student.full_name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.mobile.includes(term);

      const matchesCategory =
        categoryFilter === "ALL" ||
        student.prediction_history.some(
          (history) => history.category === categoryFilter
        );

      return matchesSearch && matchesCategory;
    });
  }, [students, search, categoryFilter]);

  const totalPredictions = students.reduce(
    (sum, student) => sum + student.prediction_count,
    0
  );

  const allHistory = students.flatMap(
    (student) => student.prediction_history
  );

  const averagePercentile =
    allHistory.length > 0
      ? allHistory.reduce(
          (sum, history) => sum + Number(history.student_percentile),
          0
        ) / allHistory.length
      : null;

  const latestHistory = selected?.prediction_history ?? [];

  function downloadCsv() {
    const headers = [
      "Student ID",
      "Full Name",
      "Email",
      "Mobile",
      "Registered At",
      "Prediction Count",
      "Percentile",
      "Category",
      "Branch",
      "CAP Round",
      "City",
      "Predicted Colleges",
    ];

    const rows = students.flatMap((student) => {
      if (!student.prediction_history.length) {
        return [[
          student.id,
          student.full_name,
          student.email,
          student.mobile,
          student.created_at,
          student.prediction_count,
          "",
          "",
          "",
          "",
          "",
          "",
        ]];
      }

      return student.prediction_history.map((history) => [
        student.id,
        student.full_name,
        student.email,
        student.mobile,
        student.created_at,
        student.prediction_count,
        history.student_percentile,
        history.category,
        history.branch,
        history.cap_round,
        history.city ?? "",
        history.predictions
          .map((p) => p.college_name ?? p.institute_name ?? "")
          .join("; "),
      ]);
    });

    const csvValue = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(csvValue).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college-predictor-students.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e4eaf2",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 4px 16px rgba(20, 40, 75, .04)",
  };

  const buttonStyle = {
    border: 0,
    borderRadius: 8,
    background: "#293756",
    color: "#fff",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
  } as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        color: "#172746",
        fontFamily: "Arial, sans-serif",
        padding: "28px 4%",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 28,
        }}
      >
        <div>
          <p style={{ color: "#5268a8", fontSize: 12, fontWeight: 700 }}>
            COLLEGE PREDICTOR / ADMIN
          </p>
          <h1 style={{ margin: "5px 0", fontSize: 30 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "#68778e", margin: 0 }}>
            Students, admission profiles and college prediction history
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={buttonStyle} onClick={() => void loadStudents()}>
            Refresh
          </button>
          <button
            style={{ ...buttonStyle, background: "#176b52" }}
            onClick={downloadCsv}
            disabled={!students.length}
          >
            Export CSV
          </button>
          <button
            style={{ ...buttonStyle, background: "#fff", color: "#293756", border: "1px solid #d8e0ec" }}
            onClick={() => window.location.assign("/")}
          >
            Predictor
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          style={{
            ...cardStyle,
            marginBottom: 20,
            color: "#a12626",
            borderColor: "#f0b9b9",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={cardStyle}>Loading student records…</div>
      ) : (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={cardStyle}>
              <p style={{ color: "#68778e", marginTop: 0 }}>Registered students</p>
              <strong style={{ fontSize: 32 }}>{data?.total_students ?? 0}</strong>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#68778e", marginTop: 0 }}>Saved predictions</p>
              <strong style={{ fontSize: 32 }}>{totalPredictions}</strong>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#68778e", marginTop: 0 }}>Prediction records</p>
              <strong style={{ fontSize: 32 }}>{allHistory.length}</strong>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#68778e", marginTop: 0 }}>Average recorded percentile</p>
              <strong style={{ fontSize: 32 }}>
                {averagePercentile === null
                  ? "—"
                  : averagePercentile.toFixed(2)}
              </strong>
            </div>
          </section>

          <section style={{ ...cardStyle, marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>Student records</h2>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or mobile…"
                style={{
                  flex: "1 1 260px",
                  padding: 12,
                  border: "1px solid #d7e0ec",
                  borderRadius: 8,
                }}
              />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                style={{
                  padding: 12,
                  border: "1px solid #d7e0ec",
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                <option value="ALL">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                  minWidth: 760,
                }}
              >
                <thead>
                  <tr style={{ background: "#f4f7fb", textAlign: "left" }}>
                    {["ID", "Student", "Email", "Mobile", "Registered", "Predictions", "Details"].map((label) => (
                      <th key={label} style={{ padding: 12, borderBottom: "1px solid #e4eaf2" }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5" }}>
                        {student.id}
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5", fontWeight: 600 }}>
                        {student.full_name}
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5" }}>
                        {student.email}
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5" }}>
                        {student.mobile}
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5" }}>
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5" }}>
                        {student.prediction_count}
                      </td>
                      <td style={{ padding: 12, borderBottom: "1px solid #edf0f5" }}>
                        <button
                          style={{ ...buttonStyle, padding: "7px 10px" }}
                          onClick={() => setSelected(student)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#68778e" }}>
                        No matching students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {selected && (
        <section style={{ ...cardStyle, marginBottom: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>
                {selected.full_name}
              </h2>
              <p style={{ margin: 0, color: "#68778e" }}>
                Student ID: {selected.id} · {selected.email} · {selected.mobile}
              </p>
            </div>
            <button
              style={{ ...buttonStyle, background: "#e8edf5", color: "#293756" }}
              onClick={() => setSelected(null)}
            >
              Close details
            </button>
          </div>

          <h3 style={{ marginTop: 28 }}>Admission and prediction history</h3>

          {latestHistory.length === 0 ? (
            <p style={{ color: "#68778e" }}>
              No saved predictions yet. The student's earlier predictions
              cannot be displayed unless they were previously stored.
            </p>
          ) : (
            latestHistory.map((history) => (
              <article
                key={history.id}
                style={{
                  marginTop: 16,
                  padding: 16,
                  border: "1px solid #e4eaf2",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 14,
                  }}
                >
                  <div>
                    <small>Percentile</small>
                    <h3>{Number(history.student_percentile).toFixed(3)}</h3>
                  </div>
                  <div>
                    <small>Category</small>
                    <h3>{history.category}</h3>
                  </div>
                  <div>
                    <small>Preferred branch</small>
                    <h3>{history.branch}</h3>
                  </div>
                  <div>
                    <small>CAP round</small>
                    <h3>{history.cap_round}</h3>
                  </div>
                  <div>
                    <small>City preference</small>
                    <h3>{history.city || "Any city"}</h3>
                  </div>
                  <div>
                    <small>Prediction date</small>
                    <h3>{new Date(history.created_at).toLocaleString()}</h3>
                  </div>
                </div>

                <h4>Predicted colleges ({history.predictions.length})</h4>

                {history.predictions.length === 0 ? (
                  <p>No colleges were returned for this prediction.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620, fontSize: 13 }}>
                      <thead>
                        <tr style={{ textAlign: "left", background: "#f4f7fb" }}>
                          {["College", "Institute code", "Branch", "Cutoff percentile", "Estimate"].map((label) => (
                            <th key={label} style={{ padding: 10 }}>{label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {history.predictions.map((college, index) => (
                          <tr key={`${college.institute_code ?? index}-${index}`}>
                            <td style={{ padding: 10, borderBottom: "1px solid #edf0f5" }}>
                              {college.college_name ?? college.institute_name ?? "Not available"}
                            </td>
                            <td style={{ padding: 10, borderBottom: "1px solid #edf0f5" }}>
                              {college.institute_code ?? "—"}
                            </td>
                            <td style={{ padding: 10, borderBottom: "1px solid #edf0f5" }}>
                              {college.branch_name ?? history.branch}
                            </td>
                            <td style={{ padding: 10, borderBottom: "1px solid #edf0f5" }}>
                              {college.historical_cutoff_percentile ?? "—"}
                            </td>
                            <td style={{ padding: 10, borderBottom: "1px solid #edf0f5" }}>
                              {college.prediction ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}
