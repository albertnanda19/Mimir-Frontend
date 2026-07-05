"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, LockPassword, ArrowRight, Google, Check } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { AuthHeading } from "@/components/auth/auth-heading";
import { FormAlert } from "@/components/auth/form-alert";
import { OrDivider } from "@/components/auth/or-divider";
import { signUp, signInWithGoogle } from "@/lib/auth-dummy";

export function RegisterForm() {
  const router = useRouter();
  const [isGooglePending, startGoogle] = useTransition();

  const [error, submit, isPending] = useActionState(async (_prev: string | null, formData: FormData) => {
    const password = String(formData.get("password"));
    if (password !== String(formData.get("confirm"))) {
      return "Konfirmasi kata sandi tidak cocok.";
    }
    try {
      await signUp(String(formData.get("name")), String(formData.get("email")));
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
      <AuthHeading title="Buat akun Mimir" subtitle="Mulai bangun form pintar pertamamu dalam hitungan detik." />

      <form action={submit} className="flex flex-col gap-4">
        <TextField label="Nama lengkap" name="name" required autoComplete="name" placeholder="Nama kamu" icon={<User />} />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="kamu@email.com"
          icon={<Mail />}
        />
        <TextField
          label="Kata sandi"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          icon={<LockPassword />}
        />
        <TextField
          label="Konfirmasi kata sandi"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          icon={<LockPassword />}
        />

        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-muted">
          <span className="relative mt-0.5 size-4 shrink-0">
            <input
              type="checkbox"
              name="terms"
              required
              className="peer size-4 cursor-pointer appearance-none rounded-[4px] border border-line bg-surface transition-colors checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            <Check className="pointer-events-none absolute inset-0 hidden size-4 text-white peer-checked:block" />
          </span>
          <span>
            Saya setuju dengan{" "}
            <span className="font-medium text-brand-text">Ketentuan Layanan</span> dan{" "}
            <span className="font-medium text-brand-text">Kebijakan Privasi</span>.
          </span>
        </label>

        {error && <FormAlert tone="danger">{error}</FormAlert>}

        <Button type="submit" isLoading={isPending} className="mt-1">
          Buat akun
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <OrDivider />

      <Button variant="outline" onClick={handleGoogle} isLoading={isGooglePending} leadingIcon={<Google className="size-[18px]" />}>
        Daftar dengan Google
      </Button>

      <p className="text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-brand-text transition-colors hover:text-brand-hover">
          Masuk
        </Link>
      </p>
    </div>
  );
}
