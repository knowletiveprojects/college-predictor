import Link from "next/link";

const features = [
  { number: "01", title: "College prediction", text: "Compare a student's entered percentile with available historical cutoff records for the selected category, branch, academic year and CAP round." },
  { number: "02", title: "Flexible search filters", text: "Narrow results by engineering branch and city. Category, year and CAP round help make the search more relevant to the student's preferences." },
  { number: "03", title: "College profiles", text: "Explore college details and available branch information from the project's imported master data. Some fields may not be available for every institute." },
  { number: "04", title: "Side-by-side comparison", text: "Compare shortlisted colleges using the information available in the application, and investigate details before making an admission decision." },
  { number: "05", title: "Save and revisit", text: "Signed-in students can use available saved-college and prediction-history features to keep track of their research." },
  { number: "06", title: "Downloadable results", text: "Export prediction results as a PDF for convenient review and discussion with family, teachers or counsellors." },
];

const roadmap = [
  { phase: "Continuous", title: "Data improvements", text: "Review and update available admission-year data and cutoff records as reliable datasets become available." },
  { phase: "Planned", title: "Richer college insights", text: "Improve college profiles, comparison summaries and visual explanations of historical cutoff trends." },
  { phase: "Planned", title: "Admission assistant", text: "Explore a locally run guidance assistant that can answer common questions using verified project data." },
  { phase: "Planned", title: "Usability and accessibility", text: "Continue improving mobile navigation, accessibility, clearer explanations and the student research journey." },
];

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fc] text-slate-900 antialiased">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="CollegePredictor home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 text-sm font-black text-white shadow-md shadow-blue-900/20">CP</span>
            <span className="text-lg font-black tracking-tight text-slate-950">College<span className="text-blue-700">Predictor</span></span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
            <Link href="/#predict" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:px-3 sm:text-sm">Predict Colleges</Link>
            <Link href="/universities" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex">Universities</Link>
            <Link href="/student-guide" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 md:inline-flex">Student Guide</Link>
            <Link href="/about" aria-current="page" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-bold text-blue-700 sm:px-3 sm:text-sm"><span aria-hidden="true">ⓘ</span> About</Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate border-b border-blue-100 bg-gradient-to-br from-[#eff6ff] via-white to-[#eef2ff]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_15%,rgba(59,130,246,0.16),transparent_38%),radial-gradient(ellipse_at_90%_80%,rgba(99,102,241,0.12),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-800"><span className="h-2 w-2 rounded-full bg-blue-600" /> ABOUT THE PROJECT</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Make your college search <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">clearer and smarter.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">CollegePredictor is a student-focused tool designed to help explore Maharashtra engineering admission options using available MHT-CET CAP cutoff records and college information.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#predict" className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800">Start exploring <span className="ml-2" aria-hidden="true">→</span></Link>
              <Link href="/student-guide" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">Read student guide</Link>
            </div>
            <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-500">This tool supports research and planning. It does not guarantee admission or replace official counselling guidance.</p>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-200/60 to-indigo-200/50 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-3xl border border-white bg-white/90 p-5 shadow-2xl shadow-blue-900/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Your admission research</p><p className="mt-1 text-lg font-black text-slate-900">From details to options</p></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-xl text-blue-700">⌕</span></div>
              <div className="mt-5 space-y-3">
                {[{n:"1",title:"Enter preferences",sub:"Percentile · category · branch · city",color:"bg-blue-600"},{n:"2",title:"Explore historical records",sub:"Academic year · CAP round · cutoffs",color:"bg-indigo-600"},{n:"3",title:"Review your shortlist",sub:"Profiles · comparison · saved options",color:"bg-emerald-600"}].map((item) => <div key={item.n} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color} text-sm font-black text-white`}>{item.n}</span><div><p className="font-bold text-slate-800">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.sub}</p></div><span className="ml-auto text-lg text-slate-300" aria-hidden="true">→</span></div>)}
              </div>
              <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900"><strong>Built around data:</strong> results depend on the records currently imported into the project.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="The purpose" title="Why CollegePredictor exists" text="Choosing an engineering college can involve many variables: entrance percentile, reservation category, preferred branch, location, CAP round and previous cutoff trends. This project brings available information into one place to make that exploration easier to follow." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[{icon:"◎",title:"The challenge",text:"Admission information can be spread across spreadsheets, notices and college websites, making it difficult to compare options quickly."},{icon:"⌘",title:"Our approach",text:"Use search filters and historical records to create a shortlist, then review college profiles and compare the available details."},{icon:"✦",title:"The goal",text:"Help students make more informed questions and decisions—not promise a seat or make the admission decision for them."}].map((item) => <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-700">{item.icon}</span><h3 className="mt-4 text-lg font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p></article>)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Project workflow" title="How the platform works" text="The diagram below shows the typical student journey. Exact results depend on selected filters and the data available in the application." />
          <div className="mt-9 grid gap-3 md:grid-cols-4">
            {[{n:"01",title:"Enter details",text:"Set percentile, category, branch, city and CAP round."},{n:"02",title:"Search records",text:"The app requests matching records from its backend."},{n:"03",title:"Review results",text:"Explore historical cutoff information and chance labels."},{n:"04",title:"Compare options",text:"Inspect profiles, save colleges and export results."}].map((step,index) => <div key={step.n} className="relative rounded-2xl border border-slate-200 bg-[#f8faff] p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-sm font-black text-white">{step.n}</span><span className="text-xs font-bold uppercase tracking-wider text-slate-400">STEP {index+1}</span></div><h3 className="mt-4 font-extrabold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>{index<3 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-700 md:flex" aria-hidden="true">→</span>}</div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Inside the system" title="Technology and architecture" text="The project uses a web frontend, an API backend and a relational database. The frontend sends search requests to the backend, which works with the stored college and cutoff records and returns results for the interface." />
        <div className="mt-9 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mx-auto grid max-w-3xl gap-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center"><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Presentation layer</p><h3 className="mt-1 text-lg font-black text-slate-900">Next.js · React · TypeScript</h3><p className="mt-1 text-sm text-slate-600">Pages, navigation, filters, results and college comparison</p></div>
            <div className="flex justify-center text-2xl font-bold text-slate-400" aria-hidden="true">↕</div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-center"><p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Application layer</p><h3 className="mt-1 text-lg font-black text-slate-900">Python · FastAPI</h3><p className="mt-1 text-sm text-slate-600">API endpoints, query handling and prediction/result logic</p></div>
            <div className="flex justify-center text-2xl font-bold text-slate-400" aria-hidden="true">↕</div>
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center"><p className="text-xs font-bold uppercase tracking-widest text-violet-700">Data layer</p><h3 className="mt-1 text-lg font-black text-slate-900">PostgreSQL</h3><p className="mt-1 text-sm text-slate-600">Structured college, branch and cutoff data</p></div>
          </div>
          <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-slate-500">Architecture summary based on the project stack. Deployment and data-import details may vary by environment.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[{title:"Frontend",text:"Next.js, React, TypeScript and Tailwind CSS"},{title:"Backend",text:"Python and FastAPI endpoints"},{title:"Database",text:"PostgreSQL for structured records"},{title:"Admission data",text:"Imported college master data and available CAP cutoff datasets"},{title:"Student tools",text:"Search, saved colleges, prediction history and PDF export"},{title:"Responsible use",text:"Historical records are guidance, not a guarantee of future admission"}].map((item) => <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5"><h3 className="font-extrabold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div>)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What you can do" title="Key features" text="The current interface is designed to help students move from a broad search to a more organised shortlist." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => <article key={feature.number} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-lg"><p className="text-xs font-black tracking-widest text-blue-700">FEATURE {feature.number}</p><h3 className="mt-3 text-lg font-extrabold text-slate-900">{feature.title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{feature.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Built to evolve" title="Our future roadmap" text="CollegePredictor will continue to improve as reliable data and useful ideas become available. The items below are future directions, not claims that every feature is already live." />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {roadmap.map((item,index) => <article key={item.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 pl-7 shadow-sm"><span className="absolute bottom-6 left-0 top-6 w-1 rounded-r-full bg-gradient-to-b from-blue-600 to-indigo-500"/><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3><span className={`rounded-full px-3 py-1 text-xs font-bold ${index===0?"bg-emerald-50 text-emerald-700":"bg-indigo-50 text-indigo-700"}`}>{item.phase}</span></div><p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p></article>)}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#102b68] via-blue-800 to-indigo-700 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="grid items-center gap-7 md:grid-cols-[1fr_auto]"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Your next step</p><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Start exploring your engineering college options.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">Use the available records as a starting point, then verify current admission rules and details through official sources.</p></div><Link href="/#predict" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 transition hover:-translate-y-0.5 hover:bg-blue-50">Predict colleges <span className="ml-2" aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs leading-5 text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><p>© {new Date().getFullYear()} CollegePredictor · Built to support informed college research.</p><p>Historical cutoffs are guidance, not admission guarantees.</p></div></footer>
    </main>
  );
}
