import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { query } from "@/lib/db";

import ProfileActions, {
  type AccountAddress,
} from "./ProfileActions";

export default async function AccountPage() {
  const user = await getCurrentUser();

  // Require authentication
  if (!user) {
    redirect("/login");
  }

  // Fetch addresses belonging only to the authenticated user
  const { rows: addresses } = await query<AccountAddress>(
    `SELECT
       id,
       full_name,
       line1,
       city,
       postal_code,
       country
     FROM addresses
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC`,
    [user.id],
  );

  return (
    <main className="min-h-screen w-full min-w-0 bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        {/* Account header */}
        <header className="mb-6 border-b border-slate-200 pb-5 sm:mb-8 sm:pb-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            My Account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Manage your profile, saved addresses, and account security.
          </p>
        </header>

        {/* Account management */}
        <section className="min-w-0">
          <ProfileActions
            initialName={user.name ?? ""}
            email={user.email}
            initialAddresses={addresses}
          />
        </section>

        {/* Sign out at the bottom */}
        <footer className="mt-8 border-t border-slate-200 pt-6 sm:mt-10 sm:pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Sign out
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Sign out of your account on this device.
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <LogoutButton />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}