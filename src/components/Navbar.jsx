"use client";

import { useState, memo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [badgeAnimating, setBadgeAnimating] = useState(false);
  const { cartCount } = useCart();
  const prevCartCountRef = useRef(cartCount);

  // Animate badge when cart count increases
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setBadgeAnimating(true);
      const timer = setTimeout(() => setBadgeAnimating(false), 400);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  // Memoized toggle handler
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                ShopVibe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 font-medium"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 font-medium"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-violet-50 dark:hover:bg-violet-900/20"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>

            {/* Cart Button */}
            <Link href="/cart" prefetch={true}>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <Badge className={`
                    absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 
                    bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs border-0
                    ${badgeAnimating ? 'animate-bounce-in' : ''}
                  `}>
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="hidden sm:flex bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 ring-2 ring-violet-500/30 hover:ring-violet-500/50 transition-all",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Your Orders"
                    labelIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    }
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) =>
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 font-medium"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    className="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 font-medium"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="mt-4 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="mt-4 flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 ring-2 ring-violet-500/30 hover:ring-violet-500/50 transition-all",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Your Orders"
                        labelIcon={
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        }
                        href="/orders"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Export memoized Navbar to prevent unnecessary re-renders
export default memo(Navbar);
