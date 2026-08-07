import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { isRegistrationOpen } from "@/lib/settings";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const open = await isRegistrationOpen();
  if (!open) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Register to upload project progress and manage your profile.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <RegisterForm closed={false} />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
