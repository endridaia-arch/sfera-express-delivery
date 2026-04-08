import { notFound } from "next/navigation";
import { LiveTrackingPanel } from "@/components/live-tracking-panel";
import { getShipmentByTrackingCode } from "@/lib/store";

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const snapshot = await getShipmentByTrackingCode(code);

  if (!snapshot) {
    notFound();
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10">
        <section className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-[var(--accent)]">
            Tracking code
          </p>
          <h1 className="mt-5 font-heading text-5xl font-semibold leading-[1.04] text-[var(--foreground)]">
            Ndiq produktin ne kohe reale.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Biznesi dhe klienti final mund te perdorin te njejtin kod gjurmimi. Lokacioni
            dhe statusi rifreskohen automatikisht nga qendra operative ose nga telemetry API.
          </p>
        </section>

        <LiveTrackingPanel trackingCode={code.toUpperCase()} initialSnapshot={snapshot} />
      </div>
    </main>
  );
}
