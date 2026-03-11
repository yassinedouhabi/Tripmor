"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const role = session?.user?.role;

  const dashboardHref =
    role === "admin" ? "/admin" : role === "provider" ? "/provider" : "/account";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Trip<span className="text-teal-700">mor</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/trips" className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors">
              Browse Trips
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors">
              How It Works
            </Link>
            <Link href="/become-a-provider" className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors">
              Become a Provider
            </Link>
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                    <User size={14} className="text-teal-700" />
                  </div>
                  <span>{session.user.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href={dashboardHref}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-semibold bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          <Link href="/trips" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            Browse Trips
          </Link>
          <Link href="/how-it-works" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            How It Works
          </Link>
          <Link href="/become-a-provider" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            Become a Provider
          </Link>
          <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
            {session ? (
              <>
                <Link href={dashboardHref} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-center text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Log in
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm font-semibold text-center text-white bg-teal-700 rounded-lg hover:bg-teal-800">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
