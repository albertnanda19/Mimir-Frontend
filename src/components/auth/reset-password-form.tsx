"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { LockPassword, ArrowRight } from "@mynaui/icons-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { AuthHeading } from "@/components/auth/auth-heading";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";
import { toast } from "@/lib/toast";

export function ResetPasswordForm() {
  const router = useRouter();

  const [, submit, isPending] = useActionState(async (_prev: null, formData: FormData) => {
    const password = String(formData.get("password"));
    if (password !== String(formData.get("confirm"))) {
      toast.warning("Konfirmasi kata sandi tidak cocok.");
      return null;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(authErrorMessage(error));
      return null;
    }
    toast.success("Kata sandi berhasil diubah.");
    router.push("/dashboard");
    router.refresh();
    return null;
  }, null);

  return (
    <div className="flex flex-col gap-7">
      <AuthHeading title="Atur ulang kata sandi" subtitle="Masukkan kata sandi baru untuk akunmu." />

      <form action={submit} className="flex flex-col gap-4">
        <TextField
          label="Kata sandi baru"
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
          placeholder="Ulangi kata sandi baru"
          icon={<LockPassword />}
        />

        <Button type="submit" isLoading={isPending} className="mt-1">
          Simpan kata sandi
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  );
}
