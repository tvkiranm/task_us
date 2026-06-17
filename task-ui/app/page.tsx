import Link from "next/link";

const topNav = [
  { label: "Features", href: "#" },
  { label: "Tools", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3fb] text-[#191947]">
      <div className="mx-auto flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/80 bg-[#fbf9ff]/95 shadow-[0_30px_120px_rgba(53,37,120,0.08)] backdrop-blur">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ece7f7] px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-[#191947]"
            >
              MINI JIRA
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {topNav.map((item) => (
                <Link
                  className="text-sm font-medium uppercase tracking-[0.16em] text-[#44416d] transition hover:text-[#191947]"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                className="text-sm font-semibold uppercase tracking-[0.12em] text-[#191947] transition hover:opacity-70"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full bg-[#1d1a52] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(29,26,82,0.22)] transition hover:-translate-y-0.5"
                href="/dashboard"
              >
                Get Started
              </Link>
            </div>
          </header>

          <section className="relative overflow-hidden px-5 pb-6 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_20%_20%,rgba(140,126,224,0.12),transparent_26%),radial-gradient(circle_at_80%_15%,rgba(104,190,255,0.12),transparent_24%),radial-gradient(circle_at_50%_60%,rgba(239,211,255,0.14),transparent_30%)]" />
            <div className="relative mx-auto max-w-5xl text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.4em] text-[#1d1a52]">
                Smart tools for smart teams
              </p>
              <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[#191947] sm:text-6xl lg:text-7xl">
                One place to manage your entire workspace
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#57557d] sm:text-lg">
                Mini Jira combines landing page clarity with a clean product
                shell. Keep the homepage editorial and send users straight into
                the dashboard when they are ready.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  className="rounded-full bg-[#1d1a52] px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_32px_rgba(29,26,82,0.22)] transition hover:-translate-y-0.5"
                  href="/dashboard"
                >
                  Get Started
                </Link>
                <Link
                  className="rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#1d1a52] shadow-[0_10px_24px_rgba(29,26,82,0.08)] ring-1 ring-[#ece7f7] transition hover:-translate-y-0.5"
                  href="/register"
                >
                  Book a Demo
                </Link>
              </div>
            </div>

            <div className="relative mt-10 grid gap-5 lg:mt-14 lg:grid-cols-[0.95fr_1.2fr_0.95fr] lg:items-end">
              <div className="space-y-5 lg:pb-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d1a52] text-white shadow-[0_16px_30px_rgba(29,26,82,0.22)]">
                  +
                </div>
                <div className="max-w-xs">
                  <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.04em] text-[#191947]">
                    Get organized. Get moving. Get paid.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#57557d]">
                    Request a demo now and turn the workspace into a focused
                    product story instead of a cluttered board.
                  </p>
                </div>

                <Link
                  className="inline-flex text-sm font-semibold text-[#1d1a52] underline decoration-[#1d1a52]/30 underline-offset-4 transition hover:opacity-70"
                  href="/dashboard"
                >
                  Request a demo now
                </Link>

                <div className="rounded-[1.75rem] border border-[#ece7f7] bg-white p-5 shadow-[0_16px_36px_rgba(29,26,82,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#fff4d5] text-2xl">
                      12K+
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#191947]">
                        12K+ customers
                      </p>
                      <p className="mt-1 text-sm text-[#57557d]">
                        freelancers and businesses helped
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="absolute left-6 top-16 z-10 rounded-2xl bg-white px-4 py-3 shadow-[0_14px_36px_rgba(29,26,82,0.12)]">
                  <div className="flex items-center gap-2 text-[#191947]">
                    <span className="text-yellow-400">Star</span>
                    <span className="text-lg font-bold">4.9</span>
                  </div>
                </div>

                <div className="absolute -right-2 top-24 z-10 h-20 w-20 rounded-full border-[10px] border-[#ffd9ea] bg-[#ff82b2]/90 shadow-[0_16px_36px_rgba(255,130,178,0.25)]" />

                <div className="rounded-[2.5rem] bg-[#cc93f5] p-4 shadow-[0_24px_70px_rgba(122,86,192,0.18)]">
                  <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f3e6ff_0%,#ffeef9_34%,#fff5df_72%,#fff0d2_100%)]">
                    <div className="flex min-h-[520px] flex-col justify-end bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_52%)] px-6 pb-0 pt-6">
                      <div className="mx-auto flex h-[400px] w-full max-w-[330px] items-end justify-center rounded-t-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#fdf4ff_100%)]">
                        <div className="relative h-[360px] w-[280px] rounded-[2.2rem] bg-[linear-gradient(180deg,#fde9f4_0%,#fff4d5_48%,#ffe3b0_100%)] shadow-[0_24px_60px_rgba(29,26,82,0.12)]">
                          <div className="absolute left-1/2 top-[-14px] h-8 w-24 -translate-x-1/2 rounded-full bg-[#f2d4e9]" />
                          <div className="absolute left-1/2 top-10 h-40 w-36 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#c7a8ff_0%,#8d5dd8_100%)] opacity-90 blur-[1px]" />
                          <div className="absolute bottom-0 left-1/2 h-[270px] w-[220px] -translate-x-1/2 rounded-t-[8rem] bg-[linear-gradient(180deg,#f9d7b5_0%,#ffd76a_32%,#f8cf59_100%)]" />
                          <div className="absolute left-1/2 top-[92px] h-[210px] w-[176px] -translate-x-1/2 rounded-[6rem] bg-[radial-gradient(circle_at_50%_25%,#fce7d5_0%,#d9a17f_34%,#c87d58_64%,#8f5235_100%)] shadow-[0_24px_60px_rgba(29,26,82,0.18)]" />
                          <div className="absolute left-1/2 top-[124px] h-[84px] w-[118px] -translate-x-1/2 rounded-full bg-[#f2c7b4]" />
                          <div className="absolute left-1/2 top-[144px] h-20 w-20 -translate-x-[88px] rounded-full bg-[#f2c7b4] shadow-[0_0_0_10px_rgba(255,255,255,0.12)]" />
                          <div className="absolute left-1/2 top-[144px] h-20 w-20 translate-x-[12px] rounded-full bg-[#f2c7b4] shadow-[0_0_0_10px_rgba(255,255,255,0.12)]" />
                          <div className="absolute left-1/2 top-[168px] h-[92px] w-[140px] -translate-x-1/2 rounded-[3rem] bg-[linear-gradient(180deg,#6d54d7_0%,#4c38b6_100%)]" />
                          <div className="absolute left-1/2 top-[200px] h-24 w-[86px] -translate-x-[36px] rotate-[-10deg] rounded-[2rem] bg-[#ffe08a] shadow-[0_8px_20px_rgba(29,26,82,0.12)]" />
                          <div className="absolute left-1/2 top-[202px] h-24 w-[88px] translate-x-[10px] rotate-[12deg] rounded-[2rem] bg-[#ffd059] shadow-[0_8px_20px_rgba(29,26,82,0.12)]" />
                          <div className="absolute left-1/2 top-[240px] h-[110px] w-[88px] -translate-x-[64px] rotate-[10deg] rounded-[2rem] bg-[#ffe16a] shadow-[0_8px_20px_rgba(29,26,82,0.12)]" />
                          <div className="absolute left-1/2 top-[242px] h-[110px] w-[88px] translate-x-[12px] rotate-[-8deg] rounded-[2rem] bg-[#ffd24f] shadow-[0_8px_20px_rgba(29,26,82,0.12)]" />
                          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_14px_30px_rgba(29,26,82,0.14)]">
                            <div className="h-10 w-10 rounded-full bg-[linear-gradient(180deg,#ff8b6d,#ff5d4a)]" />
                            <div className="h-10 w-10 rounded-full bg-[linear-gradient(180deg,#a89cff,#7d6ef2)]" />
                            <div className="h-10 w-10 rounded-full bg-[linear-gradient(180deg,#7cd6ff,#5bb6ff)]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5 lg:pb-16">
                <div className="rounded-[1.75rem] border border-[#d7f4fb] bg-[#bfeeff] p-5 shadow-[0_16px_36px_rgba(29,26,82,0.08)]">
                  <div className="flex items-center justify-between text-sm text-[#4b516d]">
                    <span>Paid amount</span>
                    <span>/week</span>
                  </div>
                  <p className="mt-4 text-5xl font-black tracking-[-0.05em] text-[#191947]">
                    $7,245
                  </p>
                  <div className="mt-6 flex items-end gap-3">
                    <span className="h-8 w-8 rounded-xl bg-[#191947]" />
                    <span className="h-16 w-8 rounded-xl bg-white/45" />
                    <span className="h-28 w-8 rounded-xl bg-white/65" />
                    <span className="h-18 w-8 rounded-xl bg-white/55" />
                    <span className="h-36 w-8 rounded-xl bg-[#191947]" />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#ece7f7] bg-[#d8d8ff] p-5 shadow-[0_16px_36px_rgba(29,26,82,0.08)]">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#191947]">
                      Analyze your earnings
                    </p>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#57557d]">
                      New
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#57557d]">
                    Keep revenue and performance insights in the same product
                    rhythm.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-[#efe6c8] bg-[#f4da7a] p-5 shadow-[0_16px_36px_rgba(29,26,82,0.08)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-black tracking-[-0.05em] text-[#191947]">
                        12K+
                      </p>
                      <p className="mt-2 max-w-[180px] text-sm font-medium text-[#47405f]">
                        freelancers and businesses helped
                      </p>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-2xl shadow-[0_12px_28px_rgba(29,26,82,0.12)]">
                      AC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
