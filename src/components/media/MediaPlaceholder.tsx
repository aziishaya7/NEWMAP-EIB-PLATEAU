import { Leaf } from "lucide-react";

export default function MediaPlaceholder({
  label = "No image",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 ${className}`}
      aria-hidden={label ? undefined : true}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(21,128,61,0.12) 0, transparent 45%), radial-gradient(circle at 80% 70%, rgba(5,150,105,0.1) 0, transparent 40%)",
        }}
      />
      <Leaf className="relative h-12 w-12 text-green-700/50" strokeWidth={1.25} />
      {label ? (
        <span className="relative mt-3 text-sm font-medium text-green-800/60">
          {label}
        </span>
      ) : null}
    </div>
  );
}
