import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEWMAP-EIB Plateau State",
  description:
    "Nigeria Erosion and Watershed Management Project supported by European Investment Bank in Plateau State.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  let displayName = user?.email?.split("@")[0] ?? "User";

  if (user) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.display_name) displayName = data.display_name;
    } catch {
      // profiles table may not exist yet during setup
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Navbar
          user={
            user
              ? {
                  email: user.email ?? "",
                  displayName,
                  isAdmin: isAdmin(user),
                }
              : null
          }
        />
        <main className="flex-1 bg-gray-50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
