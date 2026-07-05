"use client";

import { useActionState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FormAlert } from "@/components/auth/form-alert";
import { AppNavbar } from "@/components/layout/app-navbar";
import { getSession, getSessionSnapshot, subscribeSession, updateProfile } from "@/lib/auth-dummy";

interface SaveState {
  ok: boolean;
  error: string | null;
}

export function ProfileView() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => null);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
    }
  }, [router]);

  const [state, save, isSaving] = useActionState<SaveState, FormData>(
    async (_prev, formData) => {
      try {
        await updateProfile(String(formData.get("name")));
        return { ok: true, error: null };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Terjadi kesalahan." };
      }
    },
    { ok: false, error: null },
  );

  return (
    <div className="min-h-dvh">
      <AppNavbar user={user} />

      <main className="mx-auto w-full max-w-[42rem] px-5 py-10 sm:px-8">
        {!user ? (
          <div className="flex flex-col gap-6">
            <div className="h-8 w-48 animate-pulse rounded-md bg-overlay" />
            <div className="h-56 animate-pulse rounded-lg bg-overlay" />
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-enter">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">Profil</h1>
              <p className="text-[15px] text-muted">Kelola informasi akunmu di Mimir.</p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-6 shadow-[var(--elevation-1)]">
              <div className="flex items-center gap-4 border-b border-line-subtle pb-6">
                <Avatar name={user.name} />
                <div className="flex flex-col gap-1">
                  <p className="font-display text-lg font-medium text-ink">{user.name}</p>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-0.5 text-xs font-medium text-success-text">
                    <ShieldCheck className="size-3.5" />
                    Akun terverifikasi
                  </span>
                </div>
              </div>

              <form action={save} className="flex flex-col gap-4 pt-6">
                <TextField label="Nama lengkap" name="name" required defaultValue={user.name} icon={<User />} />
                <TextField label="Email" name="email" type="email" value={user.email} readOnly disabled icon={<Mail />} />

                {state.ok && <FormAlert tone="success">Profil berhasil diperbarui.</FormAlert>}
                {state.error && <FormAlert tone="danger">{state.error}</FormAlert>}

                <Button type="submit" isLoading={isSaving} className="mt-1 w-auto self-start px-6">
                  Simpan perubahan
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
