"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, LockPassword, ArrowRight, Google, Check, MailOpen } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { AuthHeading } from "@/components/auth/auth-heading";
import { OrDivider } from "@/components/auth/or-divider";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";
import { toast } from "@/lib/toast";

interface RegisterState {
  confirmationSentTo: string | null;
}

export function RegisterForm() {
  const router = useRouter();
  const [isGooglePending, startGoogle] = useTransition();

  const [state, submit, isPending] = useActionState<RegisterState, FormData>(
    async (_prev, formData) => {
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      if (password !== String(formData.get("confirm"))) {
        toast.warning("Konfirmasi kata sandi tidak cocok.");
        return { confirmationSentTo: null };
      }
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: String(formData.get("name")) } },
      });
      if (error) {
        toast.error(authErrorMessage(error));
        return { confirmationSentTo: null };
      }
      if (!data.session) {
        toast.info(`Tautan konfirmasi dikirim ke ${email}.`);
        return { confirmationSentTo: email };
      }
      toast.success("Akun berhasil dibuat. Selamat datang di Mimir!");
      router.push("/dashboard");
      router.refresh();
      return { confirmationSentTo: null };
    },
    { confirmationSentTo: null },
  );

  function handleGoogle() {
    startGoogle(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) toast.error(authErrorMessage(error));
    });
  }

  if (state.confirmationSentTo) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-subtle text-brand animate-pop">
          <MailOpen className="size-7" />
        </span>
        <AuthHeading title="Cek email kamu" subtitle="Kami sudah mengirim tautan konfirmasi untuk mengaktifkan akunmu." />
        <p className="text-sm text-muted">
          Tautan dikirim ke <span className="font-mono text-ink">{state.confirmationSentTo}</span>. Belum masuk? Cek
          folder spam.
        </p>
        <Button variant="outline" onClick={() => router.push("/login")}>
          Kembali ke halaman masuk
        </Button>
      </div>
    );
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
