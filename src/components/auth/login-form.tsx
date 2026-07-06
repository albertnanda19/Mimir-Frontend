"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, LockPassword, ArrowRight, Google } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { AuthHeading } from "@/components/auth/auth-heading";
import { FormAlert } from "@/components/auth/form-alert";
import { OrDivider } from "@/components/auth/or-divider";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";

export function LoginForm() {
  const router = useRouter();
  const [isGooglePending, startGoogle] = useTransition();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const [error, submit, isPending] = useActionState(async (_prev: string | null, formData: FormData) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    if (error) return authErrorMessage(error);
    router.push("/dashboard");
    router.refresh();
    return null;
  }, null);

  function handleGoogle() {
    setGoogleError(null);
    startGoogle(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) setGoogleError(authErrorMessage(error));
    });
  }

  const alertMessage = error ?? googleError;

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

        {alertMessage && <FormAlert tone="danger">{alertMessage}</FormAlert>}

        <Button type="submit" isLoading={isPending} className="mt-1">
          Masuk
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <OrDivider />

      <Button variant="outline" onClick={handleGoogle} isLoading={isGooglePending} leadingIcon={<Google className="size-[18px]" />}>
        Lanjut dengan Google
      </Button>

      <p className="text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-brand-text transition-colors hover:text-brand-hover">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
