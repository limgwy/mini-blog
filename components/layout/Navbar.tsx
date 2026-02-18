"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const NAV = [
  { label: "Blogs", href: "/blogs" },
  { label: "Cuisines", href: "/cuisines" },
  { label: "Curated Lists", href: "/lists" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const linkClass = (href: string) => {
    const isActive =
      href === "/blogs"
        ? pathname.startsWith("/blogs")
        : href === "/cuisines"
          ? pathname.startsWith("/cuisines")
          : href === "/lists"
            ? pathname.startsWith("/lists")
            : href === "/about"
              ? pathname.startsWith("/about")
              : false;

    return [
      "text-sm font-medium transition",
      isHome
        ? "text-white/90 hover:text-white"
        : isActive
          ? "text-gray-900"
          : "text-gray-700 hover:text-gray-900",
    ].join(" ");
  };

  return (
    <header
      className={[
        "z-50",
        isHome
          ? "absolute inset-x-0 top-6 bg-transparent"
          : // ✅ non-home: sticky + subtle border + blur + tint
            "sticky top-0 border-b border-black/5 bg-[#f6ebd4]/80 backdrop-blur",
      ].join(" ")}
    >
      <div
        className={[
          // ✅ match your /blogs spacing (bigger left/right)
          "mx-auto flex h-16 max-w-6xl items-center justify-between",
          isHome ? "px-6" : "px-8 sm:px-10 lg:px-14",
        ].join(" ")}
      >
        {/* LEFT — LOGO */}
        <Link
          href="/"
          className={[
            "text-lg font-bold tracking-tight",
            isHome ? "text-white" : "text-gray-900",
          ].join(" ")}
        >
          GUSTO
        </Link>

        {/* CENTER — NAV LINKS */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={linkClass(item.href)}
            >
              {item.label}
              {/* ✅ non-home active underline */}
              {!isHome &&
                ((item.href === "/blogs" && pathname.startsWith("/blogs")) ||
                  (item.href === "/cuisines" &&
                    pathname.startsWith("/cuisines")) ||
                  (item.href === "/lists" && pathname.startsWith("/lists")) ||
                  (item.href === "/about" &&
                    pathname.startsWith("/about"))) && (
                  <span className="mt-1 block h-[2px] w-full rounded-full bg-gray-900/80" />
                )}
            </Link>
          ))}
        </nav>

        {/* RIGHT — AUTH */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className={[
                  "rounded-xl border px-5 py-2.5 text-sm font-semibold transition",
                  isHome
                    ? "border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/15"
                    : "border-black/10 bg-white/70 text-gray-900 hover:bg-white",
                ].join(" ")}
              >
                Login
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                className={[
                  "rounded-xl px-5 py-2.5 text-sm font-semibold transition",
                  isHome
                    ? "bg-white text-gray-900 hover:bg-white/90"
                    : "bg-gray-900 text-white hover:bg-gray-800",
                ].join(" ")}
              >
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
  <div
    className={[
      "rounded-xl border px-2 py-2",
      isHome
        ? "border-white/70 bg-white/10 backdrop-blur"
        : "border-black/10 bg-white/70 backdrop-blur",
    ].join(" ")}
  >
    <UserButton afterSignOutUrl="/">
  <UserButton.MenuItems>
    <UserButton.Link
      label="My Posts"
      href="/my-posts"
      labelIcon={<span className="text-base">📝</span>}
    />
  </UserButton.MenuItems>
</UserButton>

  </div>
</SignedIn>

        </div>
      </div>
    </header>
  );
}
