
function Loader({ message = "Please wait..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-xl bg-white px-8 py-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />

          <p className="text-sm font-medium text-slate-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loader;
