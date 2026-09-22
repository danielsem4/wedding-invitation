import { CornerFlorals } from "@/components/Florals";
import { Envelope } from "@/components/Envelope";

export default function Home() {
  return (
    <main className="scene-bg relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-4 py-10">
      <CornerFlorals />

      <div className="relative z-10 w-full">
        <Envelope />
      </div>
    </main>
  );
}
