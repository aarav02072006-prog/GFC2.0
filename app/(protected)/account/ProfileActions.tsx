"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  LockKeyhole,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

export type AccountAddress = {
  id: string;
  full_name: string;
  line1: string;
  city: string;
  postal_code: string;
  country: string;
};

type AddressFields = Omit<AccountAddress, "id">;
type DialogKind =
  | "name"
  | "password"
  | "delete-account"
  | "create-address"
  | "edit-address"
  | "delete-address";

type ProfileActionsProps = {
  initialName: string;
  email: string;
  initialAddresses: AccountAddress[];
};

const emptyAddress = (): AddressFields => ({
  full_name: "",
  line1: "",
  city: "",
  postal_code: "",
  country: "IN",
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAccountAddress(value: unknown): value is AccountAddress {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.full_name === "string" &&
    typeof value.line1 === "string" &&
    typeof value.city === "string" &&
    typeof value.postal_code === "string" &&
    typeof value.country === "string"
  );
}

export default function ProfileActions({
  initialName,
  email,
  initialAddresses,
}: ProfileActionsProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const [activeAddress, setActiveAddress] = useState<AccountAddress | null>(
    null,
  );
  const [addressDraft, setAddressDraft] =
    useState<AddressFields>(emptyAddress);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function resetDialog() {
    setDialog(null);
    setActiveAddress(null);
    setAddressDraft(emptyAddress());
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setConfirmation("");
    setError("");
  }

  function openDialog(kind: DialogKind) {
    setError("");
    if (kind === "name") setName(initialName);
    setDialog(kind);
  }

  function openAddressDialog(address?: AccountAddress) {
    setError("");
    setActiveAddress(address ?? null);
    setAddressDraft(
      address
        ? {
            full_name: address.full_name,
            line1: address.line1,
            city: address.city,
            postal_code: address.postal_code,
            country: address.country,
          }
        : emptyAddress(),
    );
    setDialog(address ? "edit-address" : "create-address");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!dialog) return;

    if (dialog === "password" && newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    if (dialog === "delete-account" && confirmation !== "DELETE") {
      setError("Type DELETE to confirm account deletion.");
      return;
    }

    const requestBody: Record<string, unknown> =
      dialog === "name"
        ? { action: "update-name", name }
        : dialog === "password"
          ? { action: "change-password", currentPassword, newPassword }
          : dialog === "delete-account"
            ? {
                action: "delete-account",
                password: currentPassword,
                confirmation,
              }
            : dialog === "create-address"
              ? { action: "create-address", ...addressDraft }
              : dialog === "edit-address"
                ? {
                    action: "update-address",
                    id: activeAddress?.id,
                    ...addressDraft,
                  }
                : { action: "delete-address", id: activeAddress?.id };

    setBusy(true);
    try {
      const response = await fetch("/account/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const responseBody: unknown = await response.json().catch(() => null);
      const result = isRecord(responseBody) ? responseBody : null;

      if (!response.ok) {
        setError(
          typeof result?.error === "string"
            ? result.error
            : "Unable to complete this request. Try again.",
        );
        return;
      }

      if (dialog === "name") {
        setName(name.trim());
      } else if (
        dialog === "create-address" ||
        dialog === "edit-address"
      ) {
        const savedAddress = result?.address;
        if (!isAccountAddress(savedAddress)) {
          setError("The address was saved, but the updated address was not returned.");
          return;
        }
        const savedAddressId = savedAddress.id;
        setAddresses((current) => [
          savedAddress,
          ...current.filter((address) => address.id !== savedAddressId),
        ]);
      } else if (dialog === "delete-address" && activeAddress) {
        setAddresses((current) =>
          current.filter((address) => address.id !== activeAddress.id),
        );
      }

      if (
        dialog === "delete-account" ||
        (dialog === "password" && result?.signedOut === true)
      ) {
        resetDialog();
        router.replace("/login");
        router.refresh();
        return;
      }

      resetDialog();
      router.refresh();
    } catch {
      setError(
        "The request could not reach the server. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const dialogTitle =
    dialog === "name"
      ? "Change name"
      : dialog === "password"
        ? "Change password"
        : dialog === "delete-account"
          ? "Delete account"
          : dialog === "create-address"
            ? "Add address"
            : dialog === "edit-address"
              ? "Edit address"
              : "Delete address";

  return (
    <>
      <div className="mt-8 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <UserRound className="h-8 w-8 text-indigo-600" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-slate-900">
              {name || "Name not set"}
            </h2>
            <p className="break-words text-sm text-slate-500">{email}</p>
          </div>
        </div>

        <section className="mt-6">
          <label
            htmlFor="account-name"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <UserRound className="h-4 w-4" aria-hidden />
            Full name
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="account-name"
              readOnly
              value={name}
              placeholder="Name not set"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
            />
            <button
              type="button"
              onClick={() => openDialog("name")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Change name
            </button>
          </div>
        </section>

        <section className="mt-6">
          <label
            htmlFor="account-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>
          <input
            id="account-email"
            readOnly
            type="email"
            value={email}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
          />
          <p className="mt-2 text-xs text-slate-500">
            Contact support if you need to change your email address.
          </p>
        </section>

        <section className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              <MapPin className="h-5 w-5 text-indigo-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">Saved addresses</h3>
              <p className="text-sm text-slate-500">
                Manage the addresses saved to your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAddressDialog()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
              You have no saved addresses yet.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-slate-100">
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 text-sm text-slate-600">
                    <p className="break-words font-medium text-slate-900">
                      {address.full_name}
                    </p>
                    <p className="break-words">{address.line1}</p>
                    <p className="break-words">
                      {address.city}, {address.postal_code}
                    </p>
                    <p className="break-words">{address.country}</p>
                  </div>
                  <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => openAddressDialog(address)}
                      aria-label={`Edit address for ${address.full_name}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex-none"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAddress(address);
                        setError("");
                        setDialog("delete-address");
                      }}
                      aria-label={`Delete address for ${address.full_name}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <LockKeyhole className="h-5 w-5 text-amber-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">Password</h3>
              <p className="text-sm text-slate-500">
                Keep your account secure.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openDialog("password")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              <KeyRound className="h-4 w-4" aria-hidden />
              Change password
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-red-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-red-700">Delete account</h3>
              <p className="text-sm text-slate-500">
                Deactivate your account and remove saved data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openDialog("delete-account")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 sm:w-auto"
            >
              Delete account
            </button>
          </div>
        </section>
      </div>

      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) resetDialog();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-dialog-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="account-dialog-title"
                className="text-xl font-semibold text-slate-900"
              >
                {dialogTitle}
              </h2>
              <button
                type="button"
                onClick={resetDialog}
                disabled={busy}
                aria-label="Close dialog"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {dialog === "delete-account" && (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This deactivates your account, removes saved addresses and cart
                data, and signs you out. Existing order records are retained for
                transaction history, with your account details anonymized.
              </p>
            )}
            {dialog === "delete-address" && (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Delete the saved address for{" "}
                <span className="font-medium text-slate-900">
                  {activeAddress?.full_name}
                </span>
                ?
              </p>
            )}

            <form onSubmit={submit} className="mt-5 space-y-4">
              {dialog === "name" && (
                <div>
                  <label
                    htmlFor="account-name-input"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="account-name-input"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={1}
                    maxLength={100}
                    autoComplete="name"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}

              {(dialog === "create-address" || dialog === "edit-address") && (
                <>
                  <div>
                    <label
                      htmlFor="address-full-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Full name
                    </label>
                    <input
                      id="address-full-name"
                      type="text"
                      value={addressDraft.full_name}
                      onChange={(event) =>
                        setAddressDraft((current) => ({
                          ...current,
                          full_name: event.target.value,
                        }))
                      }
                      maxLength={100}
                      autoComplete="name"
                      required
                      autoFocus
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address-line1"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Address
                    </label>
                    <input
                      id="address-line1"
                      type="text"
                      value={addressDraft.line1}
                      onChange={(event) =>
                        setAddressDraft((current) => ({
                          ...current,
                          line1: event.target.value,
                        }))
                      }
                      maxLength={250}
                      autoComplete="street-address"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="address-city"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        City
                      </label>
                      <input
                        id="address-city"
                        type="text"
                        value={addressDraft.city}
                        onChange={(event) =>
                          setAddressDraft((current) => ({
                            ...current,
                            city: event.target.value,
                          }))
                        }
                        maxLength={100}
                        autoComplete="address-level2"
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address-postal-code"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Postal code
                      </label>
                      <input
                        id="address-postal-code"
                        type="text"
                        value={addressDraft.postal_code}
                        onChange={(event) =>
                          setAddressDraft((current) => ({
                            ...current,
                            postal_code: event.target.value,
                          }))
                        }
                        maxLength={20}
                        autoComplete="postal-code"
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="address-country"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Country code
                    </label>
                    <input
                      id="address-country"
                      type="text"
                      value={addressDraft.country}
                      onChange={(event) =>
                        setAddressDraft((current) => ({
                          ...current,
                          country: event.target.value.toUpperCase(),
                        }))
                      }
                      minLength={2}
                      maxLength={2}
                      autoComplete="country"
                      required
                      aria-describedby="country-code-hint"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                    <p id="country-code-hint" className="mt-1 text-xs text-slate-500">
                      Use the two-letter country code, for example IN.
                    </p>
                  </div>
                </>
              )}

              {(dialog === "password" || dialog === "delete-account") && (
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Current password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    minLength={8}
                    maxLength={128}
                    autoComplete="current-password"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}

              {dialog === "password" && (
                <>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Use a password between 8 and 128 characters. You will need
                    to sign in again after changing it.
                  </p>
                </>
              )}

              {dialog === "delete-account" && (
                <div>
                  <label
                    htmlFor="delete-confirmation"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Type DELETE to confirm
                  </label>
                  <input
                    id="delete-confirmation"
                    type="text"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              )}

              {error && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={resetDialog}
                  disabled={busy}
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className={
                    dialog === "delete-account" || dialog === "delete-address"
                      ? "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 sm:w-auto"
                      : "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
                  }
                >
                  {busy
                    ? "Saving..."
                    : dialog === "delete-account" || dialog === "delete-address"
                      ? "Delete"
                      : dialog === "name"
                        ? "Save name"
                        : dialog === "password"
                          ? "Change password"
                          : dialog === "edit-address"
                            ? "Save address"
                            : "Add address"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
