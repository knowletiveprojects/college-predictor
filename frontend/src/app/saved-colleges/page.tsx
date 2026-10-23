"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Prediction = {
  institute_code?: string | number;
  college_name?: string;
  branch_name?: string;
  cap_round?: number;
  status?: string | null;
  level?: string | null;
  stage?: string | null;
  category?: string;
  historical_closing_rank?: number | null;
  historical_cutoff_percentile?: number | null;
  student_percentile?: number | null;
  percentile_difference?: number | null;
  prediction?: string;
  historical_cutoff?: string | number | null;
};

type SavedCollection = {
  id: number;
  title?: string;
  student_percentile: number;
  category: string;
  branch: string;
  cap_round: number;
  city?: string | null;
  predictions: Prediction[];
  created_at: string;
};

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function SavedCollegesPage() {
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = window.sessionStorage.getItem("collegePredictorToken");
    if (!token) {
      setError("Please log in to view your saved colleges.");
      setCollections([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/saved-college-collections`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : `Could not load saved colleges (${response.status}).`
        );
      }
      setCollections(Array.isArray(data.collections) ? data.collections : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load saved colleges. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCollections();
  }, [loadCollections]);

  async function deleteCollection(id: number) {
    if (!window.confirm("Delete this saved college collection?")) return;
    const token = window.sessionStorage.getItem("collegePredictorToken");
    if (!token) {
      setError("Please log in again to delete saved colleges.");
      return;
    }

    setDeletingId(id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/saved-college-collections/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : `Could not delete collection (${response.status}).`
        );
      }
      setCollections((current) => current.filter((item) => item.id !== id));
      setNotice("Saved collection deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this collection."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              MHT-CET · Maharashtra
            </p>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">My Saved Colleges</h1>
            <p className="mt-2 text-slate-600">
              Your saved prediction collections, available whenever you log in.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadCollections()}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-100 disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <Link
              href="/"
              className="rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            >
              Back to Predictor
            </Link>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
            {error.toLowerCase().includes("log in") && (
              <Link href="/login" className="ml-2 font-bold underline">Go to login</Link>
            )}
          </div>
        )}
        {notice && <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">{notice}</div>}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading your saved collections…
          </div>
        ) : !error && collections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="text-4xl" aria-hidden="true">🔖</div>
            <h2 className="mt-3 text-xl font-bold">No saved collections yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              Generate college predictions and select “Save All Colleges” to keep the complete result list here.
            </p>
            <Link href="/" className="mt-5 inline-block rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">
              Generate Predictions
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {collections.map((collection) => (
              <article key={collection.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                  <div>
                    <h2 className="text-xl font-bold">{collection.title || "Saved College Predictions"}</h2>
                    <p className="mt-1 text-sm text-slate-500">Saved {displayDate(collection.created_at)}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-800">Percentile: {collection.student_percentile}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">Category: {collection.category}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">CAP Round {collection.cap_round}</span>
                      {collection.city && <span className="rounded-full bg-slate-100 px-3 py-1">{collection.city}</span>}
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Branch: <span className="font-semibold text-slate-800">{collection.branch}</span></p>
                    <p className="mt-1 text-sm text-slate-600">{collection.predictions?.length ?? 0} colleges saved</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteCollection(collection.id)}
                    disabled={deletingId === collection.id}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === collection.id ? "Deleting…" : "Delete collection"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">College</th>
                        <th className="px-5 py-3">Institute Code</th>
                        <th className="px-5 py-3">Branch</th>
                        <th className="px-5 py-3">Historical Cutoff</th>
                        <th className="px-5 py-3">Prediction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(collection.predictions || []).map((college, index) => (
                        <tr key={`${college.institute_code ?? "college"}-${index}`} className="align-top hover:bg-slate-50">
                          <td className="max-w-sm px-5 py-4 font-semibold text-slate-900">{college.college_name || "College name unavailable"}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">{college.institute_code ?? "—"}</td>
                          <td className="px-5 py-4 text-slate-600">{college.branch_name || collection.branch || "—"}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">{college.historical_cutoff_percentile ?? college.historical_cutoff ?? "—"}</td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">{college.prediction || "—"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
