"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Brain, LogOut, User, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Feed", href: "/" },
    { name: "Dashboard", href: "/dashboard", protected: true },
    { name: "Create", href: "/create", protected: true, icon: <PlusCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                AIBlog
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors flex items-center space-x-1"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              )
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
                <div className="flex items-center space-x-2 text-slate-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name || user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-slate-600 font-medium hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-indigo-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 w-full bg-white border-b border-slate-200 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            (!link.protected || user) && (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          {!user ? (
            <div className="pt-4 flex flex-col space-y-2">
              <Link
                href="/login"
                className="text-center px-4 py-2 text-slate-700 border border-slate-200 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-center px-4 py-2 bg-indigo-600 text-white rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
