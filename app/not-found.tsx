import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
        404
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        The repair page or resource you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition inline-block"
        >
          Back to FixMate Home
        </Link>
      </div>
    </div>
  );
}
