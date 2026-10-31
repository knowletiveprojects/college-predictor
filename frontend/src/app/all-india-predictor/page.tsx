"use client";



import { useEffect, useState } from "react";



const API_URL = (

  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

).replace(/\/+$/, "");



type CutoffRecord = {

  institute_code: string;

  institute_name: string;

  choice_code: string;

  course_name: string;

  academic_year: string;

  cap_round: number;

  all_india_merit_rank: number;

  percentile: number | string;

  merit_exam: string;

  allotment_type: string;

  seat_type: string;

  source_file: string;

  student_percentile?: number;

  percentile_difference?: number;

  historical_comparison?: string;

};



type FilterOptions = {
  cities: string[];
  departments: string[];
};

type ApiResponse = {

  academic_year: string;

  exam: string;

  matched_exam_labels: string[];

  cap_round: number | null;

  branch: string | null;

  student_percentile: number | null;

  total_results: number;

  results: CutoffRecord[];

  disclaimer: string;

  cities: string[];

  departments: string[];

};



export default function AllIndiaPredictorPage() {

  const [exam, setExam] = useState("JEE");

  const [percentile, setPercentile] = useState("");

  const [round, setRound] = useState("");

  const [branch, setBranch] = useState("");
  const [city, setCity] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cities: [],
    departments: [],
  });

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const response = await fetch(
          `${API_URL}/api/all-india/filters?academic_year=2025`
        );

        if (!response.ok) {
          throw new Error("Unable to load filter options.");
        }

        const data: FilterOptions = await response.json();

        setFilterOptions({
          cities: data.cities || [],
          departments: data.departments || [],
        });
      } catch (err) {
        console.error("Filter options error:", err);
      }
    }

    loadFilterOptions();
  }, []);

  const [results, setResults] = useState<CutoffRecord[]>([]);

  const [responseInfo, setResponseInfo] = useState<ApiResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [searched, setSearched] = useState(false);



  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();



    if (

      percentile.trim() &&

      (!Number.isFinite(Number(percentile)) ||

        Number(percentile) < 0 ||

        Number(percentile) > 100)

    ) {

      setError("Enter a valid percentile between 0 and 100.");

      return;

    }



    setLoading(true);

    setError("");

    setSearched(true);

    setResults([]);

    setResponseInfo(null);



    const params = new URLSearchParams({

      exam,

      academic_year: "2025",

      limit: "500",

    });



    if (round) params.set("cap_round", round);

    if (branch) params.set("branch", branch);
    if (city) params.set("city", city);

    if (percentile.trim()) {

      params.set("student_percentile", percentile.trim());

    }



    try {

      const response = await fetch(

        `${API_URL}/api/all-india/cutoffs?${params.toString()}`

      );



      if (!response.ok) {

        const message = await response.text();

        throw new Error(message || `Request failed: ${response.status}`);

      }



      const data: ApiResponse = await response.json();



      setResults(data.results || []);

      setResponseInfo(data);

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to connect to the All India Predictor API."

      );

    } finally {

      setLoading(false);

    }

  }



  function handleReset() {

    setExam("JEE");

    setPercentile("");

    setRound("");

    setBranch("");
    setCity("");

    setResults([]);

    setResponseInfo(null);

    setError("");

    setSearched(false);

  }



  function formatPercentile(value: number | string) {

    return Number(value).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");

  }



  return (

    <main className="min-h-screen bg-slate-50">

      {/* Navigation */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <a

            href="/"

            className="text-xl font-extrabold tracking-tight text-slate-900"

          >

            College<span className="text-blue-700">Predictor</span>

          </a>



          <a

            href="/"

            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"

          >

            ← Main Predictor

          </a>

        </div>

      </header>



      {/* Hero */}

      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-800 px-5 py-14 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100">

            ALL INDIA CAP ADMISSIONS · 2025 DATA

          </div>



          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">

            All India Engineering

            <span className="block text-blue-300">

              College Predictor

            </span>

          </h1>



          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">

            Explore historical All India CAP cutoff records for JEE and

            MHT-CET. Compare your percentile with previous admission

            trends and discover colleges and courses.

          </p>



          <div className="mt-8 flex flex-wrap gap-3">

            <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3">

              <p className="text-2xl font-bold">6,480</p>

              <p className="text-xs text-blue-200">Source records</p>

            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3">

              <p className="text-2xl font-bold">4</p>

              <p className="text-xs text-blue-200">CAP rounds</p>

            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3">

              <p className="text-2xl font-bold">2025</p>

              <p className="text-xs text-blue-200">Academic year</p>

            </div>

          </div>

        </div>

      </section>



      {/* Main content */}

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[360px_1fr]">

        {/* Search panel */}

        <aside>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">

                Prediction search

              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">

                Student Details

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Enter your exam details to explore historical cutoffs.

              </p>

            </div>



            <form onSubmit={handleSearch} className="space-y-5">

              {/* Exam */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Select Entrance Exam

                </label>



                <div className="grid grid-cols-2 gap-3">

                  {["JEE", "MHT-CET"].map((item) => (

                    <button

                      key={item}

                      type="button"

                      onClick={() => setExam(item)}

                      className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${

                        exam === item

                          ? "border-blue-700 bg-blue-50 text-blue-800 ring-2 ring-blue-100"

                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"

                      }`}

                    >

                      {item}

                    </button>

                  ))}

                </div>

              </div>



              {/* Percentile */}

              <div>

                <label

                  htmlFor="percentile"

                  className="mb-2 block text-sm font-semibold text-slate-700"

                >

                  Your Percentile

                  <span className="ml-1 font-normal text-slate-400">

                    (Optional)

                  </span>

                </label>



                <input

                  id="percentile"

                  type="number"

                  min="0"

                  max="100"

                  step="0.000001"

                  placeholder="Example: 95.456789"

                  value={percentile}

                  onChange={(e) => setPercentile(e.target.value)}

                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"

                />

                <p className="mt-2 text-xs text-slate-500">

                  Enter a percentile between 0 and 100.

                </p>

              </div>



              {/* CAP Round */}

              <div>

                <label

                  htmlFor="round"

                  className="mb-2 block text-sm font-semibold text-slate-700"

                >

                  CAP Round

                </label>



                <select

                  id="round"

                  value={round}

                  onChange={(e) => setRound(e.target.value)}

                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"

                >

                  <option value="">All CAP Rounds</option>

                  <option value="1">CAP Round 1</option>

                  <option value="2">CAP Round 2</option>

                  <option value="3">CAP Round 3</option>

                  <option value="4">CAP Round 4</option>

                </select>

              </div>



              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select City
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">All Cities</option>
                  {filterOptions.cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                {filterOptions.cities.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    Verified city data is not available yet.
                  </p>
                )}
              </div>

              {/* Department / Course */}
              <div>
                <label
                  htmlFor="branch"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Department / Course
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">All Departments</option>
                  {filterOptions.departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}

              <button

                type="submit"

                disabled={loading}

                className="w-full rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"

              >

                {loading ? "Searching colleges..." : "Find Colleges →"}

              </button>



              <button

                type="button"

                onClick={handleReset}

                className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"

              >

                Reset Filters

              </button>

            </form>

          </div>



          {/* Information */}

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <h3 className="font-bold text-blue-900">

              How it works

            </h3>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-900/75">

              <li>1. Select JEE or MHT-CET.</li>

              <li>2. Enter your percentile if available.</li>

              <li>3. Select a CAP round or search all rounds.</li>

              <li>4. Explore historical college cutoff records.</li>

            </ul>

          </div>

        </aside>



        {/* Results */}

        <section className="min-w-0">

          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">

                Historical admission data

              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">

                College Results

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Explore verified 2025 All India CAP cutoff records.

              </p>

            </div>



            {responseInfo && (

              <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">

                {responseInfo.total_results} records returned

              </div>

            )}

          </div>



          {/* Error */}

          {error && (

            <div

              role="alert"

              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"

            >

              <strong>Something went wrong:</strong> {error}

            </div>

          )}



          {/* Loading */}

          {loading && (

            <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

              <p className="mt-4 font-semibold text-slate-700">

                Finding historical college records...

              </p>

              <p className="mt-1 text-sm text-slate-500">

                Please wait.

              </p>

            </div>

          )}



          {/* Initial state */}

          {!loading && !searched && (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">

                🎓

              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">

                Start Your College Search

              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                Choose your entrance exam, enter your percentile and

                apply filters to discover historical All India CAP

                college cutoffs.

              </p>

            </div>

          )}



          {/* Empty state */}

          {!loading && searched && !error && results.length === 0 && (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

              <div className="text-4xl">🔍</div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">

                No matching records found

              </h3>

              <p className="mt-2 text-sm text-slate-500">

                Try changing your exam, CAP round or course filter.

              </p>

            </div>

          )}



          {/* Result cards */}

          {!loading && results.length > 0 && (

            <>

              <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">

                <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-800">

                  {exam}

                </span>

                <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">

                  Academic Year 2025

                </span>

                <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">

                  {round ? `CAP Round ${round}` : "All Rounds"}

                </span>

              </div>



              <div className="space-y-4">

                {results.map((college, index) => {

                  const comparison =

                    college.historical_comparison;



                  const difference =

                    college.percentile_difference;



                  return (

                    <article

                      key={`${college.choice_code}-${college.cap_round}-${index}`}

                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md md:p-6"

                    >

                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div className="min-w-0 flex-1">

                          <div className="mb-2 flex flex-wrap items-center gap-2">

                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">

                              {college.choice_code}

                            </span>

                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">

                              CAP Round {college.cap_round}

                            </span>

                          </div>



                          <h3 className="text-lg font-bold leading-7 text-slate-900">

                            {college.institute_name}

                          </h3>



                          <p className="mt-1 text-sm text-slate-600">

                            {college.course_name}

                          </p>

                        </div>



                        <span className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-800">

                          All India Quota

                        </span>

                      </div>



                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 md:grid-cols-3">

                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-xs text-slate-500">

                            Historical Merit Rank

                          </p>

                          <p className="mt-1 text-lg font-extrabold text-slate-900">

                            {Number(

                              college.all_india_merit_rank

                            ).toLocaleString("en-IN")}

                          </p>

                        </div>



                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-xs text-slate-500">

                            Historical Percentile

                          </p>

                          <p className="mt-1 text-lg font-extrabold text-blue-800">

                            {formatPercentile(college.percentile)}

                          </p>

                        </div>



                        <div className="col-span-2 rounded-xl bg-slate-50 p-3 md:col-span-1">

                          <p className="text-xs text-slate-500">

                            Merit Exam

                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">

                            {college.merit_exam}

                          </p>

                        </div>

                      </div>



                      {comparison && difference !== undefined && (

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">

                          <div>

                            <p className="text-xs font-semibold text-slate-500">

                              Your percentile comparison

                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">

                              Difference:{" "}

                              {difference >= 0 ? "+" : ""}

                              {difference.toFixed(6)}

                            </p>

                          </div>



                          <span

                            className={`rounded-full px-3 py-2 text-xs font-bold ${

                              comparison ===

                              "AT_OR_ABOVE_HISTORICAL_CUTOFF"

                                ? "bg-green-100 text-green-800"

                                : "bg-amber-100 text-amber-800"

                            }`}

                          >

                            {comparison ===

                            "AT_OR_ABOVE_HISTORICAL_CUTOFF"

                              ? "At / Above historical cutoff"

                              : "Below historical cutoff"}

                          </span>

                        </div>

                      )}



                      <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-slate-500">

                        <span>

                          Institute Code: {college.institute_code}

                        </span>

                        <span>

                          Seat Type: {college.seat_type}

                        </span>

                      </div>

                    </article>

                  );

                })}

              </div>



              <p className="mt-5 text-center text-xs text-slate-500">

                Showing up to 500 matching records. Refine your

                filters to narrow your search.

              </p>

            </>

          )}



          {/* Disclaimer */}

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">

            <p className="text-sm font-bold text-amber-900">

              Important admission disclaimer

            </p>

            <p className="mt-1 text-xs leading-6 text-amber-900/80">

              {responseInfo?.disclaimer ||

                "This tool provides historical cutoff comparisons based on 2025 data. Historical results do not guarantee admission in future CAP rounds. Actual allotment depends on merit, seat availability, category, eligibility and admission rules."}

            </p>

          </div>

        </section>

      </div>



      {/* Footer */}

      <footer className="border-t border-slate-200 bg-white px-5 py-6">

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs text-slate-500">

          <p>

            © 2026 CollegePredictor. All rights reserved.

          </p>

          <a

            href="/"

            className="font-semibold text-blue-700 hover:text-blue-900"

          >

            Back to Main Predictor →

          </a>

        </div>

      </footer>

    </main>

  );

}
