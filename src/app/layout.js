import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/Toast";
import { CartProvider } from "@/hooks/useCart";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

export const metadata = {
  title: "ShopVibe - Premium E-commerce Store",
  description:
    "Discover premium products from the latest tech to timeless fashion. Shop curated collections with exceptional quality and service.",
  keywords: [
    "e-commerce",
    "online shopping",
    "fashion",
    "electronics",
    "premium products",
  ],
  openGraph: {
    title: "ShopVibe - Premium E-commerce Store",
    description:
      "Discover premium products from the latest tech to timeless fashion.",
    type: "website",
  },
};

// Enable viewport meta for responsive design
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <ToastProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
