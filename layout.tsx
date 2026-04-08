import Link from "next/link";
import { PortalFab } from "@/components/portal-fab";
import { LogoutButton } from "@/components/logout-button";
import { requireBusinessUser } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireBusinessUser();
  const initials = user.businessName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-6 lg:px-10">
          <nav className="flex flex-col gap-4 rounded-full border border-black/6 bg-white/60 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--panel)] text-[var(--surface-strong)] shadow-[0_18px_40px_rgba(13,25,35,0.18)]">
                <span className="font-heading text-lg font-semibold tracking-[0.12em]">
                  SE
                </span>
              </div>
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.22em] text-[var(--foreground)]">
                  Sfera Express Delivery
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Paneli i biznesit: {user.businessName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/portal"
                className="rounded-full border border-black/8 px-4 py-2 text-[var(--foreground)] transition hover:bg-white"
              >
                Dashboard
              </Link>
              <Link
                href="/portal/create"
                className="rounded-full border border-black/8 px-4 py-2 text-[var(--foreground)] transition hover:bg-white"
              >
                Dergese e re
              </Link>
              <Link
                href="/portal/profile"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--panel)] px-3 py-2 text-[var(--surface-strong)] transition hover:bg-[var(--panel-soft)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/12 font-semibold">
                  {initials}
                </span>
                <span>Profili</span>
              </Link>
              <LogoutButton />
            </div>
          </nav>

          {children}
        </div>
      </main>
      <PortalFab />
    </>
  );
}
