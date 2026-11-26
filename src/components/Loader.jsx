function Loader({
  message = "Please wait...",
  submessage = "We are processing your request.",
}) {
  return (
    <div className="loading-overlay pointer-events-auto flex fixed inset-0 z-9999 items-center justify-center bg-zinc-950/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white"></div>

          <div className="absolute inset-2 animate-pulse rounded-full bg-white/10"></div>
        </div>

        <div className="text-center">
          <p className="loading-message text-sm font-medium text-white">
            {message}
          </p>

          <p className="loading-submessage mt-1 text-xs text-white/60">
            {submessage}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loader;
