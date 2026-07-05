"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, MailOpen } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { AuthHeading } from "@/components/auth/auth-heading";
import { FormAlert } from "@/components/auth/form-alert";
import { requestPasswordReset } from "@/lib/auth-dummy";

interface ResetState {
  sentTo: string | null;
  error: string | null;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [state, submit, isPending] = useActionState<ResetState, FormData>(
    async (_prev, formData) => {
      const email = String(formData.get("email"));
      try {
        await requestPasswordReset(email);
        return { sentTo: email, error: null };
      } catch (err) {
        return { sentTo: null, error: err instanceof Error ? err.message : "Terjadi kesalahan." };
      }
    },
    { sentTo: null, error: null },
  );

  if (state.sentTo) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-subtle text-brand animate-pop">
          <MailOpen className="size-7" />
        </span>
        <AuthHeading title="Cek email kamu" subtitle="Kami sudah mengirim tautan untuk mengatur ulang kata sandi." />
        <p className="text-sm text-muted">
          Tautan dikirim ke <span className="font-mono text-ink">{state.sentTo}</span>. Belum masuk? Cek folder spam
          atau coba lagi.
        </p>
        <Button variant="outline" onClick={() => router.push("/login")} leadingIcon={<ArrowLeft className="size-4" />}>
          Kembali ke halaman masuk
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <AuthHeading title="Lupa kata sandi?" subtitle="Masukkan email akunmu, kami akan kirim tautan untuk meresetnya." />

      <form action={submit} className="flex flex-col gap-4">
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="kamu@email.com"
          icon={<Mail />}
        />

        {state.error && <FormAlert tone="danger">{state.error}</FormAlert>}

        <Button type="submit" isLoading={isPending} className="mt-1">
          Kirim tautan reset
        </Button>
      </form>

      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Kembali ke halaman masuk
      </Link>
    </div>
  );
}
