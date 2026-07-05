"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, LockPassword, ArrowRight, Google } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { AuthHeading } from "@/components/auth/auth-heading";
import { FormAlert } from "@/components/auth/form-alert";
import { OrDivider } from "@/components/auth/or-divider";
import { signIn, signInWithGoogle, DEMO_CREDENTIALS } from "@/lib/auth-dummy";

export function LoginForm() {
  const router = useRouter();
  const [isGooglePending, startGoogle] = useTransition();

  const [error, submit, isPending] = useActionState(async (_prev: string | null, formData: FormData) => {
    try {
      await signIn(String(formData.get("email")), String(formData.get("password")));
      router.push("/profile");
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Terjadi kesalahan.";
    }
  }, null);

  function handleGoogle() {
    startGoogle(async () => {
      await signInWithGoogle();
      router.push("/profile");
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <AuthHeading title="Selamat datang kembali" subtitle="Masuk untuk melanjutkan ke ruang kerjamu." />

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
        <div className="flex flex-col gap-1.5">
          <TextField
            label="Kata sandi"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            icon={<LockPassword />}
          />
          <Link
            href="/forgot-password"
            className="self-end text-[13px] font-medium text-brand-text transition-colors hover:text-brand-hover"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {error && <FormAlert tone="danger">{error}</FormAlert>}

        <Button type="submit" isLoading={isPending} className="mt-1">
          Masuk
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <OrDivider />

      <Button variant="outline" onClick={handleGoogle} isLoading={isGooglePending} leadingIcon={<Google className="size-[18px]" />}>
        Lanjut dengan Google
      </Button>

      <p className="rounded-md bg-subtle px-3.5 py-2.5 text-[13px] text-muted">
        Demo: <span className="font-mono text-ink">{DEMO_CREDENTIALS.email}</span> ·{" "}
        <span className="font-mono text-ink">{DEMO_CREDENTIALS.password}</span>
      </p>

      <p className="text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-brand-text transition-colors hover:text-brand-hover">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
