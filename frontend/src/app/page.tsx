"use client";

import { useEffect, useRef, useState } from "react";

import { generateCollegeResultsPdf } from "@/lib/pdf/generateCollegeResultsPdf";

type Prediction = {

  institute_code: string | number;

  college_name: string;

  branch_name: string;

  cap_round: number;

  status: string | null;

  level: string | null;

  stage: string | null;

  category: string;

  historical_closing_rank: number | null;

  historical_cutoff_percentile: number;

  student_percentile: number;

  percentile_difference: number;

  prediction: "More Chance" | "Moderate" | "Low Chances";

  historical_cutoff: string | number | null;

};

type PredictionResponse = {

  student_percentile: number;

  category: string;

  branch: string;

  cap_round: number;

  total_results: number;

  notice: string;

  predictions: Prediction[];

};

type CollegeBranch = {

  branch_code: string | number | null;

  branch_name: string;

};

type CollegeDetailsResponse = {

  institute_code: string | number;

  college_name: string;

  details: Record<string, unknown>;

  branches: CollegeBranch[];

};

const API_URL = "http://127.0.0.1:8000";

function formatLabel(value: string) {

  return value

    .replace(/[_-]/g, " ")

    .replace(/([a-z])([A-Z])/g, "$1 $2")

    .replace(/\b\w/g, (letter) => letter.toUpperCase());

}

function getHistoryBranchLabel(selectedBranches: string[], fallbackBranch: string): string {
  const selected = selectedBranches.filter(Boolean);
  if (selected.length === 0) return fallbackBranch.slice(0, 200);

  const fullLabel = selected.join(", ");
  if (fullLabel.length <= 200) return fullLabel;

  // The history API limits `branch` to 200 characters. Keep a readable summary
  // instead of sending the entire multi-select list and receiving a 422 error.
  const firstBranch = selected[0] ?? "Engineering branches";
  const secondBranch = selected[1];
  const remaining = selected.length - (secondBranch ? 2 : 1);
  const summary = secondBranch
    ? `${firstBranch}, ${secondBranch}${remaining > 0 ? `, +${remaining} more` : ""}`
    : `${firstBranch.slice(0, 160)}${remaining > 0 ? `, +${remaining} more` : ""}`;

  return summary.length <= 200 ? summary : `${summary.slice(0, 197)}...`;
}

function displayValue(value: unknown): string {

  if (value === null || value === undefined || value === "") {

    return "Not available";

  }

  if (typeof value === "boolean") {

    return value ? "Yes" : "No";

  }

  if (typeof value === "object") {

    return JSON.stringify(value, null, 2);

  }

  return String(value);

}

function isWebUrl(value: unknown): value is string {

  return typeof value === "string" && /^https?:\/\/\S+$/i.test(value.trim());

}

export default function Home() {

  const [percentile, setPercentile] = useState("");

  const [category, setCategory] = useState("GOBCS");

  const [selectedBranches, setSelectedBranches] = useState<string[]>(["Computer Engineering"]);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");

  const [round, setRound] = useState("4");

  const [results, setResults] = useState<PredictionResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [exportingPdf, setExportingPdf] = useState(false);

  const [savingCollection, setSavingCollection] = useState(false);

  const [saveCollectionMessage, setSaveCollectionMessage] = useState("");

  const [error, setError] = useState("");

  const [selectedCollege, setSelectedCollege] =

    useState<CollegeDetailsResponse | null>(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [detailsError, setDetailsError] = useState("");

  const [categories, setCategories] = useState<string[]>([]);

  const [branches, setBranches] = useState<string[]>([]);

  const [cities, setCities] = useState<string[]>([]);

  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const [optionsLoading, setOptionsLoading] = useState(true);

  const [optionsError, setOptionsError] = useState("");

  // Save each successful prediction once for the signed-in student.

  // This requires the backend POST /prediction-history endpoint.

  const lastSavedPrediction = useRef("");

  useEffect(() => {

    if (!results || results.predictions.length === 0) return;

    let student: { id?: number | string };

    try {

      const rawStudent = window.sessionStorage.getItem("collegePredictorStudent");

      if (!rawStudent) return;

      student = JSON.parse(rawStudent) as { id?: number | string };

    } catch {

      return;

    }

    const studentId = Number(student.id);

    if (!Number.isInteger(studentId) || studentId <= 0) return;

    const signature = `${studentId}:${JSON.stringify({

      student_percentile: results.student_percentile,

      category: results.category,

      branch: getHistoryBranchLabel(selectedBranches, results.branch),

      cap_round: results.cap_round,

      city: selectedCities,

      predictions: results.predictions,

    })}`;

    if (lastSavedPrediction.current === signature) return;

    lastSavedPrediction.current = signature;

    void (async () => {

      try {

        const response = await fetch(`${API_URL}/prediction-history`, {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({

            student_id: studentId,

            student_percentile: results.student_percentile,

            category: results.category,

            branch: getHistoryBranchLabel(selectedBranches, results.branch),

            cap_round: results.cap_round,

            city: selectedCities.length ? selectedCities.join(", ") : null,

            predictions: results.predictions,

          }),

        });

        if (!response.ok) {

          lastSavedPrediction.current = "";

          console.error(

            `Could not save prediction history (${response.status}):`,

            await response.text()

          );

        }

      } catch (saveError) {

        lastSavedPrediction.current = "";

        console.error("Could not save prediction history:", saveError);

      }

    })();

  }, [results, selectedBranches, selectedCities]);

  useEffect(() => {

    let cancelled = false;

    async function loadOptions() {

      setOptionsLoading(true);

      setOptionsError("");

      try {

        const [categoryResponse, branchResponse, cityResponse] = await Promise.all([

          fetch(`${API_URL}/categories`),

          fetch(`${API_URL}/branches?limit=100&offset=0`),

          fetch(`${API_URL}/cities`),

        ]);

        if (!categoryResponse.ok) {

          throw new Error(`Categories request failed (${categoryResponse.status}).`);

        }

        if (!branchResponse.ok) {

          throw new Error(`Branches request failed (${branchResponse.status}).`);

        }

        if (!cityResponse.ok) {

          throw new Error(`Cities request failed (${cityResponse.status}).`);

        }

        const categoryData = await categoryResponse.json();

        const firstBranchData = await branchResponse.json();

        const cityData = await cityResponse.json();

        const categoryList: string[] = Array.isArray(categoryData)

          ? categoryData

          : (categoryData.categories ?? categoryData.category_codes ?? []);

        const allBranches: string[] = (firstBranchData.branches ?? []).map(

          (item: { branch_name: string }) => item.branch_name

        );

        let offset = allBranches.length;

        let pageHasMore = (firstBranchData.branches ?? []).length === 100;

        while (pageHasMore) {

          const response = await fetch(

            `${API_URL}/branches?limit=100&offset=${offset}`

          );

          if (!response.ok) {

            throw new Error(`Could not load more branches (${response.status}).`);

          }

          const data = await response.json();

          const page: { branch_name: string }[] = data.branches ?? [];

          if (page.length === 0) break;

          allBranches.push(...page.map((item) => item.branch_name));

          offset += page.length;

          pageHasMore = page.length === 100;

        }

        const uniqueCategories = [...new Set(categoryList.map((item) => String(item).trim()).filter(Boolean))].sort();

        const uniqueBranches = [...new Set(allBranches.map((item) => String(item).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

        const cityList: string[] = Array.isArray(cityData)

          ? cityData

          : (cityData.cities ?? []);

        const uniqueCities = [...new Set(cityList.map((item) => String(item).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

        if (uniqueCategories.length === 0) {

          throw new Error("The categories API returned no category codes. Check the /categories endpoint.");

        }

        if (uniqueBranches.length === 0) {

          throw new Error("The branches API returned no branch names.");

        }

        if (cancelled) return;

        setCategories(uniqueCategories);

        setBranches(uniqueBranches);

        setCities(uniqueCities);

        setSelectedCities((current) => current.filter((item) => uniqueCities.includes(item)));

        setCategory((current) => uniqueCategories.includes(current) ? current : (uniqueCategories.includes("GOBCS") ? "GOBCS" : uniqueCategories[0]));

        setSelectedBranches((current) => {
          const valid = current.filter((item) => uniqueBranches.includes(item));
          return valid.length ? valid : [uniqueBranches.includes("Computer Engineering") ? "Computer Engineering" : uniqueBranches[0]];
        });

      } catch (err) {

        if (!cancelled) {

          setOptionsError(err instanceof Error ? err.message : "Could not load dropdown options.");

        }

      } finally {

        if (!cancelled) setOptionsLoading(false);

      }

    }

    loadOptions();

    return () => { cancelled = true; };

  }, []);

  async function handleSubmit(

    event: React.FormEvent<HTMLFormElement>

  ) {

    event.preventDefault();

    setLoading(true);

    setError("");

    setResults(null);

    setSelectedCollege(null);

    setDetailsError("");

    try {

      if (selectedBranches.length === 0) {
        throw new Error("Select at least one preferred engineering branch.");
      }

      const branchesToSearch = selectedBranches;
      // No selected cities means search all cities, matching the previous form behavior.
      const citiesToSearch = selectedCities.length > 0 ? selectedCities : [""];
      const searchPairs = branchesToSearch.flatMap((branchName) =>
        citiesToSearch.map((cityName) => ({ branchName, cityName }))
      );

      const responses = await Promise.all(
        searchPairs.map(async ({ branchName, cityName }) => {
          const params = new URLSearchParams({
            percentile,
            category,
            branch: branchName,
            cap_round: round,
            limit: "50",
          });
          if (cityName) params.set("city", cityName);

          const response = await fetch(`${API_URL}/predict?${params.toString()}`);
          if (!response.ok) {
            const message = await response.text();
            throw new Error(
              `Prediction request failed for ${branchName}${cityName ? ` in ${cityName}` : ""} (${response.status}): ${message}`
            );
          }
          return (await response.json()) as PredictionResponse;
        })
      );

      const firstResponse = responses[0];
      const allPredictions = responses.flatMap((item) => item.predictions);
      const uniquePredictionMap = new Map<string, Prediction>();
      for (const item of allPredictions) {
        const key = `${item.institute_code}-${item.branch_name}-${item.cap_round}-${item.category}`;
        uniquePredictionMap.set(key, item);
      }
      const predictions = Array.from(uniquePredictionMap.values()).sort(
        (a, b) =>
          a.college_name.localeCompare(b.college_name) ||
          a.branch_name.localeCompare(b.branch_name)
      );

      const data: PredictionResponse = {
        ...firstResponse,
        branch: branchesToSearch.join(", "),
        total_results: predictions.length,
        predictions,
      };
      setResults(data);

      if (data.total_results === 0) {
        setError(
          "No matching records were found. Try another city, branch, category, or CAP round."
        );
      }

      window.setTimeout(() => {

        document

          .getElementById("results")

          ?.scrollIntoView({ behavior: "smooth", block: "start" });

      }, 100);

    } catch (err) {

      setError(

        err instanceof Error

          ? `${err.message}. Check that the FastAPI backend is running.`

          : "Could not connect to the prediction API."

      );

    } finally {

      setLoading(false);

    }

  }

  async function viewCollegeDetails(

    instituteCode: string | number

  ) {

    setDetailsLoading(true);

    setDetailsError("");

    setSelectedCollege(null);

    try {

      const code = encodeURIComponent(String(instituteCode));

      const response = await fetch(

        `${API_URL}/colleges/${code}/details`

      );

      if (!response.ok) {

        const message = await response.text();

        throw new Error(

          `Could not load college details (${response.status}): ${message}`

        );

      }

      const data: CollegeDetailsResponse = await response.json();

      setSelectedCollege(data);

      window.setTimeout(() => {

        document

          .getElementById("college-profile")

          ?.scrollIntoView({ behavior: "smooth", block: "start" });

      }, 100);

    } catch (err) {

      setDetailsError(

        err instanceof Error

          ? err.message

          : "Could not load college details."

      );

    } finally {

      setDetailsLoading(false);

    }

  }

  async function saveAllColleges() {

    if (!results || results.predictions.length === 0) {

      setSaveCollectionMessage("Generate predictions before saving.");

      return;

    }

    const token = window.sessionStorage.getItem("collegePredictorToken");

    if (!token) {

      setSaveCollectionMessage("Please log in again to save your colleges.");

      return;

    }

    setSavingCollection(true);

    setSaveCollectionMessage("");

    try {

      const response = await fetch(`${API_URL}/saved-college-collections`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

        },

        body: JSON.stringify({

          student_percentile: results.student_percentile,

          category: results.category,

          branch: getHistoryBranchLabel(selectedBranches, results.branch),

          cap_round: results.cap_round,

          city: selectedCities.length ? selectedCities.join(", ") : null,

          predictions: results.predictions,

        }),

      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {

        throw new Error(

          typeof data.detail === "string"

            ? data.detail

            : `Could not save colleges (${response.status}).`

        );

      }

      setSaveCollectionMessage(

        `Saved successfully! ${data.saved_colleges ?? results.predictions.length} colleges added to My Saved Colleges.`

      );

    } catch (saveError) {

      setSaveCollectionMessage(

        saveError instanceof Error

          ? saveError.message

          : "Could not save colleges. Please try again."

      );

    } finally {

      setSavingCollection(false);

    }

  }

  async function downloadResultsPdf() {

    if (!results || results.predictions.length === 0) return;

    setExportingPdf(true);

    setError("");

    try {

      await generateCollegeResultsPdf({

        results,

        apiUrl: API_URL,

        logoUrl: "/images/knowletive-logo.png",

        cutoffYear: 2025,

      });

    } catch (err) {

      setError(

        err instanceof Error

          ? `Could not generate PDF: ${err.message}`

          : "Could not generate the PDF. Please try again."

      );

    } finally {

      setExportingPdf(false);

    }

  }

  function closeCollegeDetails() {

    setSelectedCollege(null);

    setDetailsError("");

  }

  return (

    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navigation */}

      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">

          <a

            href="#top"

            className="text-xl font-extrabold tracking-tight text-blue-700 sm:text-2xl"

          >

            College<span className="text-slate-900">Predictor</span>

          </a>

          <div className="flex items-center gap-4">

            <a

              href="#predict"

              className="hidden text-sm font-semibold text-slate-600 hover:text-blue-700 sm:block"

            >

              Predict Colleges

            </a>

            <a

              href="#results"

              className="hidden text-sm font-semibold text-slate-600 hover:text-blue-700 sm:block"

            >

              Results

            </a>

            <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 sm:text-sm">

              MHT-CET 2025 Data

            </span>

          </div>

        </div>

      </nav>

      {/* Hero and prediction form */}

      <section

        id="top"

        className="relative scroll-mt-20 overflow-hidden text-white"

        style={{

          backgroundImage: "url('/images/college-campus-bg.png')",

          backgroundSize: "cover",

          backgroundPosition: "center",

          backgroundRepeat: "no-repeat",

        }}

      >

        {/* Dark overlay improves text contrast over the campus image. */}

        <div

          className="absolute inset-0 bg-slate-950/50"

          aria-hidden="true"

        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:py-20">

          <div>

            <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-blue-100">

              Your admission journey starts here

            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">

              Find the right college for your CET percentile.

            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">

              Explore Maharashtra engineering colleges using historical CAP

              cutoff records. Compare colleges, branches, fees, facilities,

              placement information, and more wherever details are available.

            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">

              <span className="rounded-lg bg-white/10 px-4 py-3">

                Historical cutoffs

              </span>

              <span className="rounded-lg bg-white/10 px-4 py-3">

                Category-wise results

              </span>

              <span className="rounded-lg bg-white/10 px-4 py-3">

                College profiles

              </span>

            </div>

            <a

              href="#predict"

              className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition hover:bg-blue-50"

            >

              Start Your Search ↓

            </a>

          </div>

          <div

            id="predict"

            className="scroll-mt-24 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8"

          >

            <h2 className="text-2xl font-bold">

              Predict your colleges

            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              Enter your MHT-CET percentile and admission preferences.

            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              <div>

                <label

                  htmlFor="percentile"

                  className="mb-2 block text-sm font-semibold"

                >

                  MHT-CET Percentile

                </label>

                <input

                  id="percentile"

                  type="number"

                  min="0"

                  max="100"

                  step="any"

                  required

                  value={percentile}

                  onChange={(event) => setPercentile(event.target.value)}

                  placeholder="Example: 97.25"

                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"

                />

              </div>

              <div>

                <label

                  htmlFor="category"

                  className="mb-2 block text-sm font-semibold"

                >

                  Admission Category

                </label>

                <select

                  id="category"

                  value={category}

                  onChange={(event) => setCategory(event.target.value)}

                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"

                >

                  {categories.map((item) => (

                    <option key={item} value={item}>

                      {item}

                    </option>

                  ))}

                </select>

                <p className="mt-1 text-xs leading-5 text-slate-500">

                  Select the exact category code applicable to you.

                </p>

              </div>

              <div className="relative">
                <label htmlFor="branch-dropdown" className="mb-2 block text-sm font-semibold text-slate-800">Preferred Engineering Branch</label>
                <button id="branch-dropdown" type="button" aria-expanded={branchDropdownOpen} aria-haspopup="listbox" onClick={() => setBranchDropdownOpen((open) => !open)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm shadow-sm transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className={selectedBranches.length ? "truncate text-slate-800" : "text-slate-500"}>
                    {selectedBranches.length === 0 ? "Select engineering branches" : selectedBranches.length === 1 ? selectedBranches[0] : `${selectedBranches.length} branches selected`}
                  </span>
                  <svg className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${branchDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.032l-4.255 4.516a.75.75 0 01-1.09 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </button>
                {branchDropdownOpen && <div className="absolute z-[100] w-[min(22rem,calc(100vw-2rem))] max-h-[min(24rem,65vh)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-200" style={{ left: "calc(100% + 1rem)", top: "2rem" }}>
                  <div className="border-b border-slate-100 p-3">
                    <input type="search" value={branchSearch} onChange={(event) => setBranchSearch(event.target.value)} placeholder="Search branches..." className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500"><span>{selectedBranches.length} selected</span><button type="button" onClick={() => setSelectedBranches([])} className="font-medium text-blue-700 hover:text-blue-900">Clear selection</button></div>
                  </div>
                  <div role="listbox" aria-label="Engineering branches" aria-multiselectable="true" className="max-h-48 overflow-y-auto p-1.5">
                    {branches.filter((item) => item.toLowerCase().includes(branchSearch.toLowerCase())).map((item) => <label key={item} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50">
                      <input type="checkbox" checked={selectedBranches.includes(item)} onChange={(event) => setSelectedBranches((current) => event.target.checked ? current.includes(item) ? current : [...current, item] : current.filter((value) => value !== item))} className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500" />
                      <span>{item}</span>
                    </label>)}
                  </div>
                  <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white p-3"><button type="button" onClick={() => setBranchDropdownOpen(false)} className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-blue-800 transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Done <span aria-hidden="true">✓</span></button></div>
                </div>}
                {selectedBranches.length > 1 && <div className="mt-2 flex flex-wrap gap-1.5">{selectedBranches.slice(0, 3).map((item) => <span key={item} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">{item}</span>)}{selectedBranches.length > 3 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">+{selectedBranches.length - 3} more</span>}</div>}
                <p className="mt-1 text-xs leading-5 text-slate-500">Choose one or more branches from the dropdown.</p>
              </div>

              <div className="relative">
                <label htmlFor="city-dropdown" className="mb-2 block text-sm font-semibold text-slate-800">Filter by City</label>
                <button id="city-dropdown" type="button" aria-expanded={cityDropdownOpen} aria-haspopup="listbox" onClick={() => setCityDropdownOpen((open) => !open)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm shadow-sm transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className={selectedCities.length ? "truncate text-slate-800" : "text-slate-500"}>{selectedCities.length === 0 ? "All Cities (no city filter)" : selectedCities.length === 1 ? selectedCities[0] : `${selectedCities.length} cities selected`}</span>
                  <svg className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.032l-4.255 4.516a.75.75 0 01-1.09 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </button>
                {cityDropdownOpen && <div className="absolute z-[100] w-[min(22rem,calc(100vw-2rem))] max-h-[min(24rem,65vh)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-200" style={{ left: "calc(100% + 1rem)", top: "2rem" }}>
                  <div className="border-b border-slate-100 p-3">
                    <input type="search" value={citySearch} onChange={(event) => setCitySearch(event.target.value)} placeholder="Search cities..." className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500"><span>{selectedCities.length === 0 ? "No city filter" : `${selectedCities.length} selected`}</span><button type="button" onClick={() => setSelectedCities([])} className="font-medium text-blue-700 hover:text-blue-900">Clear selection</button></div>
                  </div>
                  <div role="listbox" aria-label="Cities" aria-multiselectable="true" className="max-h-48 overflow-y-auto p-1.5">
                    <button type="button" onClick={() => setSelectedCities([])} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selectedCities.length === 0 ? "bg-blue-50 font-medium text-blue-800" : "text-slate-700 hover:bg-slate-50"}`}>All Cities (no city filter)</button>
                    {cities.filter((item) => item.toLowerCase().includes(citySearch.toLowerCase())).map((item) => <label key={item} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50">
                      <input type="checkbox" checked={selectedCities.includes(item)} onChange={(event) => setSelectedCities((current) => event.target.checked ? current.includes(item) ? current : [...current, item] : current.filter((value) => value !== item))} className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500" />
                      <span>{item}</span>
                    </label>)}
                  </div>
                  <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white p-3"><button type="button" onClick={() => setCityDropdownOpen(false)} className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-blue-800 transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Done <span aria-hidden="true">✓</span></button></div>
                </div>}
                {selectedCities.length > 1 && <div className="mt-2 flex flex-wrap gap-1.5">{selectedCities.slice(0, 3).map((item) => <span key={item} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">{item}</span>)}{selectedCities.length > 3 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">+{selectedCities.length - 3} more</span>}</div>}
                <p className="mt-1 text-xs leading-5 text-slate-500">Choose multiple cities, or keep All Cities selected to search without a city filter.</p>
              </div>

              <div>

                <label

                  htmlFor="round"

                  className="mb-2 block text-sm font-semibold"

                >

                  CAP Round

                </label>

                <select

                  id="round"

                  value={round}

                  onChange={(event) => setRound(event.target.value)}

                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"

                >

                  <option value="1">Round 1</option>

                  <option value="2">Round 2</option>

                  <option value="3">Round 3</option>

                  <option value="4">Round 4</option>

                </select>

              </div>

              <button

                type="submit"

                disabled={loading || optionsLoading || categories.length === 0 || branches.length === 0 || selectedBranches.length === 0}

                className="w-full rounded-xl bg-blue-700 px-5 py-4 font-bold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"

              >

                {loading ? "Finding Colleges..." : "Find My Colleges →"}

              </button>

            </form>

            {optionsLoading && (

              <p className="mt-3 text-sm text-blue-700" role="status">

                Loading all admission categories and engineering branches...

              </p>

            )}

            {optionsError && (

              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">

                {optionsError} Make sure the backend is running and the /categories endpoint exists.

              </p>

            )}

            <p className="mt-4 text-xs leading-5 text-slate-500">

              Results use available historical records and do not guarantee

              admission.

            </p>

          </div>

        </div>

      </section>

      {/* Prediction results */}

      <section

        id="results"

        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-6 sm:py-14"

      >

        {loading && (

          <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

            <p className="mt-4 font-semibold text-blue-800">

              Searching historical cutoff records...

            </p>

          </div>

        )}

        {error && (

          <div

            role="alert"

            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"

          >

            {error}

          </div>

        )}

        {results && results.total_results > 0 && (

          <>

            <div className="flex flex-wrap items-end justify-between gap-4">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">

                  Your Search Results

                </p>

                <h2 className="mt-2 text-3xl font-extrabold">

                  Your College Predictions

                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">

                  {results.branch} · {results.category} · CAP Round{" "}

                  {results.cap_round}

                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <button

                  type="button"

                  onClick={saveAllColleges}

                  disabled={savingCollection || !results.predictions.length}

                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"

                >

                  {savingCollection ? "Saving Colleges..." : "Save All Colleges"}

                </button>

                <button

                  type="button"

                  onClick={() => window.location.assign("/saved-colleges")}

                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 transition hover:bg-blue-100"

                >

                  My Saved Colleges

                </button>

                <button

                  type="button"

                  onClick={downloadResultsPdf}

                  disabled={exportingPdf}

                  className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"

                >

                  {exportingPdf ? "Preparing PDF..." : "Download Results PDF ↓"}

                </button>

              <button

                type="button"

                onClick={() => {

                  setResults(null);

                  setSelectedCollege(null);

                  setError("");

                  setDetailsError("");

                }}

                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"

              >

                Clear Results

              </button>

              </div>

              {saveCollectionMessage && (

                <p

                  role="status"

                  className={`mt-3 text-sm ${saveCollectionMessage.startsWith("Saved successfully") ? "text-emerald-700" : "text-amber-700"}`}

                >

                  {saveCollectionMessage}

                </p>

              )}

            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm text-slate-500">Your percentile</p>

                <p className="mt-2 text-3xl font-extrabold text-blue-700">

                  {results.student_percentile}

                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm text-slate-500">Matching records</p>

                <p className="mt-2 text-3xl font-extrabold">

                  {results.total_results}

                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm text-slate-500">Cutoff data year</p>

                <p className="mt-2 text-3xl font-extrabold">2025</p>

              </div>

            </div>

            <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

              <table className="w-full min-w-[900px] text-left text-sm">

                <thead className="bg-slate-100 text-slate-700">

                  <tr>

                    <th className="p-4">College and Branch</th>

                    <th className="p-4">Cutoff Percentile</th>

                    <th className="p-4">Closing Rank</th>

                    <th className="p-4">Institute Status</th>

                    <th className="p-4">Preliminary Estimate</th>

                  </tr>

                </thead>

                <tbody>

                  {results.predictions.map((item, index) => (

                    <tr

                      key={`${item.institute_code}-${item.branch_name}-${index}`}

                      className="border-t border-slate-100 align-top transition hover:bg-blue-50/50"

                    >

                      <td className="max-w-sm p-4">

                        <p className="font-bold text-slate-900">

                          {item.college_name}

                        </p>

                        <p className="mt-1 text-slate-600">

                          {item.branch_name}

                        </p>

                        <p className="mt-1 text-xs text-slate-500">

                          Institute Code: {item.institute_code}

                        </p>

                        <button

                          type="button"

                          onClick={() =>

                            viewCollegeDetails(item.institute_code)

                          }

                          disabled={detailsLoading}

                          className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"

                        >

                          View College Details →

                        </button>

                      </td>

                      <td className="p-4 font-semibold">

                        {Number(

                          item.historical_cutoff_percentile

                        ).toFixed(4)}

                      </td>

                      <td className="p-4">

                        {item.historical_closing_rank ?? "—"}

                      </td>

                      <td className="max-w-xs p-4 text-xs leading-5 text-slate-600">

                        {item.status ?? "Not available"}

                      </td>

                      <td className="p-4">

                        <span

                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${

                            item.prediction === "More Chance"

                              ? "bg-emerald-100 text-emerald-800"

                              : item.prediction === "Moderate"

                                ? "bg-amber-100 text-amber-800"

                                : "bg-rose-100 text-rose-800"

                          }`}

                        >

                          {item.prediction}

                        </span>

                        <p className="mt-2 text-xs text-slate-500">

                          Difference:{" "}

                          {item.percentile_difference > 0 ? "+" : ""}

                          {item.percentile_difference}

                        </p>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <p className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">

              {results.notice} More Chance, Moderate, and Low Chances are

              preliminary labels based on historical cutoff differences, not

              statistically validated admission probabilities. Verify the

              applicable category, seat type, and official CAP rules before

              making admission choices.

            </p>

          </>

        )}

        {!results && !loading && !error && (

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">

            <div className="text-4xl">🎓</div>

            <h2 className="mt-4 text-2xl font-bold">

              Find your future college

            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">

              Submit your preferences to explore matching historical cutoff

              records. Open any college profile to view the master-data

              information available for that institute.

            </p>

          </div>

        )}

        {/* College details loading and errors */}

        {detailsLoading && (

          <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 text-blue-800">

            Loading college profile...

          </div>

        )}

        {detailsError && (

          <div

            role="alert"

            className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800"

          >

            {detailsError}

          </div>

        )}

        {/* Full college profile */}

        {selectedCollege && (

          <div

            id="college-profile"

            className="mt-10 scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"

          >

            <div className="bg-gradient-to-r from-blue-950 to-blue-700 p-6 text-white sm:p-8">

              <div className="flex flex-wrap items-start justify-between gap-4">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">

                    Complete College Profile

                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">

                    {selectedCollege.college_name}

                  </h2>

                  <p className="mt-3 text-sm text-blue-100">

                    Institute Code: {selectedCollege.institute_code}

                  </p>

                </div>

                <button

                  type="button"

                  onClick={closeCollegeDetails}

                  className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"

                >

                  Close Profile ✕

                </button>

              </div>

            </div>

            <div className="space-y-8 p-5 sm:p-8">

              {/* Master data fields */}

              <div>

                <h3 className="text-xl font-bold">

                  College Information

                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">

                  Information below is loaded from the master-data record

                  stored in your database.

                </p>

                {Object.keys(selectedCollege.details ?? {}).length > 0 ? (

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {Object.entries(selectedCollege.details ?? {}).map(

                      ([key, value]) => (

                        <div

                          key={key}

                          className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4"

                        >

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">

                            {formatLabel(key)}

                          </p>

                          {isWebUrl(value) ? (

                            <a

                              href={value}

                              target="_blank"

                              rel="noopener noreferrer"

                              className="mt-2 inline-block break-all text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900"

                            >

                              Open official link ↗

                            </a>

                          ) : (

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-800">

                              {displayValue(value)}

                            </p>

                          )}

                        </div>

                      )

                    )}

                  </div>

                ) : (

                  <p className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">

                    No additional master-data fields are available for this

                    college.

                  </p>

                )}

              </div>

              {/* Official links */}

              {Object.entries(selectedCollege.details ?? {}).some(

                ([key, value]) =>

                  isWebUrl(value) &&

                  /website|web site|url|link|email|accreditation|mou|brochure|placement/i.test(

                    key

                  )

              ) && (

                <div>

                  <h3 className="text-xl font-bold">

                    Official Websites and Resources

                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">

                    {Object.entries(selectedCollege.details ?? {})

                      .filter(

                        ([key, value]) =>

                          isWebUrl(value) &&

                          /website|web site|url|link|email|accreditation|mou|brochure|placement/i.test(

                            key

                          )

                      )

                      .map(([key, value]) => (

                        <a

                          key={key}

                          href={value as string}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"

                        >

                          {formatLabel(key)} ↗

                        </a>

                      ))}

                  </div>

                </div>

              )}

              {/* Branch list */}

              <div>

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <h3 className="text-xl font-bold">

                    Available Engineering Branches

                  </h3>

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">

                    {selectedCollege.branches?.length ?? 0} branches

                  </span>

                </div>

                {selectedCollege.branches?.length > 0 ? (

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {selectedCollege.branches.map((item, index) => (

                      <div

                        key={`${item.branch_code}-${index}`}

                        className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"

                      >

                        <p className="font-semibold leading-6 text-slate-800">

                          {item.branch_name}

                        </p>

                        <p className="mt-2 text-xs text-slate-500">

                          Branch Code:{" "}

                          {item.branch_code ?? "Not available"}

                        </p>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">

                    No branch information is available for this institute.

                  </p>

                )}

              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">

                <strong>Note:</strong> College information is shown as

                recorded in the available master data. Verify current fees,

                placement figures, facilities, and admission requirements

                with the college before making a decision.

              </div>

            </div>

          </div>

        )}

      </section>

      {/* Feature cards */}

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-6">

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">

            Explore with confidence

          </p>

          <h2 className="mt-2 text-3xl font-extrabold">

            More than just cutoff predictions

          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">

            Compare historical admission records and explore the college

            information available in your master data.

          </p>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="text-3xl">🎯</div>

            <h3 className="mt-4 text-xl font-bold">

              Personalised Predictions

            </h3>

            <p className="mt-2 leading-7 text-slate-600">

              Compare your percentile with historical cutoffs for your

              selected category, branch, and CAP round.

            </p>

          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="text-3xl">🏫</div>

            <h3 className="mt-4 text-xl font-bold">

              Complete College Profiles

            </h3>

            <p className="mt-2 leading-7 text-slate-600">

              View stored college information, official links, fees, facilities,

              and other available fields.

            </p>

          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="text-3xl">📊</div>

            <h3 className="mt-4 text-xl font-bold">

              Historical Cutoff Data

            </h3>

            <p className="mt-2 leading-7 text-slate-600">

              Review available closing ranks, percentile cutoffs, and

              institute status for your selected CAP round.

            </p>

          </article>

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center sm:px-6">

        <p className="font-bold text-slate-800">CollegePredictor</p>

        <p className="mt-2 text-sm leading-6 text-slate-500">

          MHT-CET Engineering Admissions · Historical cutoffs are guidance,

          not admission guarantees.

        </p>

        <p className="mt-2 text-xs text-slate-400">

          College details depend on the information available in the

          imported master-data file.

        </p>

      </footer>

    </main>

  );

}
