import Link from "next/link";

const features = [
  {
    icon: "⌕",
    number: "01",
    title: "Smart College Search",
    description:
      "Explore engineering colleges using your MHT-CET percentile, category, preferred branch, city, academic year and CAP round.",
    color: "from-blue-500 to-cyan-400",
    light: "bg-blue-50 text-blue-700",
  },
  {
    icon: "◉",
    number: "02",
    title: "Historical Cutoff Insights",
    description:
      "Review available previous admission cutoffs to understand trends and discover colleges worth considering.",
    color: "from-indigo-500 to-violet-400",
    light: "bg-indigo-50 text-indigo-700",
  },
  {
    icon: "⇄",
    number: "03",
    title: "College Comparison",
    description:
      "Compare shortlisted colleges using available details such as fees, placements, hostel facilities and other college information.",
    color: "from-violet-500 to-fuchsia-400",
    light: "bg-violet-50 text-violet-700",
  },
  {
    icon: "▦",
    number: "04",
    title: "Detailed College Profiles",
    description:
      "Discover available college, branch, location, intake and other relevant information to support further research.",
    color: "from-cyan-500 to-blue-400",
    light: "bg-cyan-50 text-cyan-700",
  },
  {
    icon: "♡",
    number: "05",
    title: "Saved Colleges",
    description:
      "Use available account features to revisit saved colleges and organise your admission research more conveniently.",
    color: "from-rose-500 to-pink-400",
    light: "bg-rose-50 text-rose-700",
  },
  {
    icon: "⇩",
    number: "06",
    title: "Downloadable Results",
    description:
      "Export results as a PDF where supported, making it easier to discuss your shortlist with family or counsellors.",
    color: "from-emerald-500 to-teal-400",
    light: "bg-emerald-50 text-emerald-700",
  },
];

const roadmap = [
  {
    phase: "Continuous",
    title: "Better admission data",
    description:
      "Improve data quality and incorporate reliable admission-year datasets as they become available.",
  },
  {
    phase: "Planned",
    title: "Advanced college insights",
    description:
      "Enhance comparison summaries and visual explanations of historical cutoff trends.",
  },
  {
    phase: "Planned",
    title: "CollegeGuide AI",
    description:
      "Explore a locally run guidance assistant that can answer common admission questions using verified project information.",
  },
  {
    phase: "Planned",
    title: "A better student experience",
    description:
      "Continue improving accessibility, mobile usability and the college shortlisting journey.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8ff] text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 font-black text-white shadow-lg">
              CP
            </span>
            <span className="text-base font-black tracking-tight sm:text-lg">
              College<span className="text-blue-700">Predictor</span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1 sm:gap-2"
          >
            <Link
              href="/#predict"
              className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:px-3 sm:text-sm"
            >
              Predict Colleges
            </Link>
            <Link
              href="/universities"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
            >
              Universities
            </Link>
            <Link
              href="/student-guide"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 md:inline-flex"
            >
              Student Guide
            </Link>
            <Link
              href="/about"
              aria-current="page"
              className="rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-bold text-blue-700 sm:px-3 sm:text-sm"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_20%,rgba(59,130,246,0.17),transparent_40%),radial-gradient(ellipse_at_90%_70%,rgba(99,102,241,0.17),transparent_35%)]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-extrabold text-blue-800 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              YOUR ENGINEERING ADMISSION COMPANION
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your percentile.
              <br />
              Your possibilities.
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Your future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover engineering college options across Maharashtra, explore
              historical MHT-CET cutoffs, compare available college details and
              build a more informed admission shortlist.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#predict"
                className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-700/20 transition hover:-translate-y-1 hover:bg-blue-800"
              >
                Explore My Colleges <span className="ml-2">→</span>
              </Link>

              <Link
                href="/universities"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
              >
                Browse Universities
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              <span>✓ Student-focused search</span>
              <span>✓ Historical cutoff context</span>
              <span>✓ Informed comparisons</span>
            </div>
          </div>

          {/* DECORATIVE COLLEGE DASHBOARD */}
          <div className="relative mx-auto w-full max-w-lg">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-blue-300/40 to-violet-300/40 blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/95 p-5 shadow-2xl shadow-blue-900/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    YOUR ADMISSION JOURNEY
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    Find your direction
                  </h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl text-white shadow-lg">
                  ✦
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    n: "01",
                    title: "Your preferences",
                    desc: "Percentile, category and branch",
                    color: "bg-blue-600",
                  },
                  {
                    n: "02",
                    title: "Relevant college options",
                    desc: "Available cutoff records and filters",
                    color: "bg-indigo-600",
                  },
                  {
                    n: "03",
                    title: "Compare your shortlist",
                    desc: "College details and available insights",
                    color: "bg-violet-600",
                  },
                  {
                    n: "04",
                    title: "Make an informed plan",
                    desc: "Review and verify your options",
                    color: "bg-emerald-600",
                  },
                ].map((step, index) => (
                  <div key={step.n} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${step.color} text-xs font-black text-white shadow-md`}
                      >
                        {step.n}
                      </div>
                      {index < 3 && (
                        <div className="my-1 min-h-5 w-px flex-1 bg-gradient-to-b from-blue-200 to-indigo-100" />
                      )}
                    </div>

                    <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                      <p className="font-extrabold text-slate-800">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <p className="text-sm font-bold text-blue-900">
                  A clearer way to explore your options.
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Research, compare and verify before making admission choices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Why CollegePredictor?"
          title="Less confusion. More informed choices."
          text="Engineering admission research can involve many colleges, branches, categories and counselling rounds. CollegePredictor brings available information into one organised experience to help students investigate their options."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: "◎",
              title: "The challenge",
              text: "Finding and comparing relevant admission information across multiple sources can be time-consuming.",
              style: "from-blue-500 to-cyan-400",
            },
            {
              icon: "⌕",
              title: "The solution",
              text: "Use filters and historical cutoff records to discover options and focus on colleges worth researching.",
              style: "from-indigo-500 to-violet-500",
            },
            {
              icon: "✦",
              title: "The benefit",
              text: "Build a more organised shortlist and have better-informed conversations with family and counsellors.",
              style: "from-violet-500 to-fuchsia-400",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${item.style} text-2xl font-black text-white shadow-lg transition group-hover:scale-105`}
              >
                {item.icon}
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* VISUAL SEARCH FLOW */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Your journey"
            title="From percentile to a confident shortlist"
            text="Follow a simple visual journey to explore available options, understand historical records and organise your college research."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                n: "01",
                icon: "⌁",
                title: "Set preferences",
                text: "Choose your percentile, category, branch, city, year and CAP round.",
                tint: "from-blue-600 to-cyan-500",
              },
              {
                n: "02",
                icon: "◉",
                title: "Discover options",
                text: "Explore matching colleges and review the cutoff information available.",
                tint: "from-indigo-600 to-violet-500",
              },
              {
                n: "03",
                icon: "⇄",
                title: "Compare colleges",
                text: "Review available details and identify options worth researching further.",
                tint: "from-violet-600 to-fuchsia-500",
              },
              {
                n: "04",
                icon: "✓",
                title: "Plan your shortlist",
                text: "Organise your research and download results where supported.",
                tint: "from-emerald-600 to-teal-500",
              },
            ].map((step, index) => (
              <article
                key={step.n}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${step.tint} text-2xl font-black text-white shadow-lg`}
                >
                  {step.icon}
                </div>
                <p className="mt-6 text-xs font-black tracking-[0.18em] text-slate-400">
                  STEP {step.n}
                </p>
                <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.text}
                </p>
                {index < 3 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-8 hidden text-2xl text-blue-300 md:block"
                  >
                    →
                  </span>
                )}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${step.tint}`}
                />
              </article>
            ))}
          </div>

          {/* FILTER INFOGRAPHIC */}
          <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 text-white sm:p-9">
            <div className="grid items-center gap-7 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">
                  A search shaped around you
                </p>
                <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                  Your preferences guide the search.
                </h3>
                <p className="mt-3 text-sm leading-7 text-blue-100">
                  Narrow the available records using relevant admission
                  preferences, then review the matching options carefully.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["01", "Percentile"],
                  ["02", "Category"],
                  ["03", "Branch"],
                  ["04", "City"],
                  ["05", "CAP round"],
                  ["06", "Academic year"],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <p className="text-xs font-black tracking-widest text-cyan-300">
                      {number}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Explore the platform"
          title="Powerful tools for smarter college research"
          text="Discover the key features that help students search, understand, compare and organise engineering college options in one student-focused experience."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${feature.light} text-2xl font-black transition group-hover:scale-105`}
                >
                  {feature.icon}
                </div>
                <span className="text-xs font-black tracking-widest text-slate-300">
                  {feature.number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
              <div
                className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${feature.color} transition-all group-hover:w-24`}
              />
            </article>
          ))}
        </div>
      </section>

      {/* RESPONSIBLE USE */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-2xl text-amber-700">
              !
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Use predictions as guidance, not a guarantee
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                Historical cutoffs can help you understand previous admission
                patterns, but they cannot guarantee a future seat. Actual
                outcomes depend on the current admission rules, seat
                availability, category, preferences and counselling rounds.
                Always verify important information through official admission
                sources before making final choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Looking ahead"
            title="Building a better admission experience"
            text="The roadmap highlights areas for future improvement. Planned ideas are not a claim that those features are already available."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {roadmap.map((item, index) => (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 pl-7 shadow-sm transition hover:shadow-lg sm:p-7"
              >
                <div
                  className={`absolute bottom-0 left-0 top-0 w-1.5 ${
                    index === 0
                      ? "bg-gradient-to-b from-emerald-500 to-teal-400"
                      : "bg-gradient-to-b from-blue-600 to-violet-500"
                  }`}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.phase === "Continuous"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {item.phase}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#102b68] via-blue-800 to-indigo-700 px-6 py-12 text-white shadow-2xl shadow-blue-900/15 sm:px-10 sm:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5"
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Your next step starts here
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Explore your possibilities. Plan your future.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100">
                Start exploring engineering college options, compare available
                information and prepare a shortlist that reflects your
                preferences.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/#predict"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-blue-800 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Predict Colleges →
              </Link>
              <Link
                href="/student-guide"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Student Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs leading-5 text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © 2026 CollegePredictor · Built to support informed college research.
          </p>
          <p>Historical cutoffs are guidance, not admission guarantees.</p>
        </div>
      </footer>
    </main>
  );
}