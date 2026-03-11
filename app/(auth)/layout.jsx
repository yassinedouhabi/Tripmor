import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center">
          <span className="text-white text-sm font-bold">T</span>
        </div>
        <span className="text-xl font-bold text-gray-900">
          Trip<span className="text-teal-700">mor</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
