import gajaLogo from "@/assets/gaja_logo.jpg";

export function Logo({ className = "", compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="grid shrink-0 place-items-center">
        <img
          src={gajaLogo}
          alt="GAJA Logo"
          className={compact ? "h-15 w-auto object-contain" : "h-20 w-auto object-contain"}
        />
      </div>
    </div>
  );
}
