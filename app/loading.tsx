import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F6F5EF] px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B3638] text-white shadow-md animate-bounce">
          <Wrench className="h-7 w-7 text-[#F4B740]" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#152C2B]">FixMate Workshop</div>
          <p className="text-xs text-[#526564] mt-0.5">Calibrating diagnostics and loading services...</p>
        </div>
      </div>
    </div>
  );
}
