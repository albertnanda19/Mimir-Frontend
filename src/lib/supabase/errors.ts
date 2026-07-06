import { isAuthError } from "@supabase/supabase-js";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Email atau kata sandi salah.",
  user_already_exists: "Email sudah terdaftar. Silakan masuk.",
  email_exists: "Email sudah terdaftar. Silakan masuk.",
  weak_password: "Kata sandi terlalu lemah. Minimal 6 karakter.",
  over_email_send_rate_limit: "Terlalu banyak permintaan. Coba lagi beberapa saat.",
  same_password: "Kata sandi baru harus berbeda dari yang lama.",
  email_not_confirmed: "Email belum dikonfirmasi. Cek kotak masuk kamu.",
};

export function authErrorMessage(err: unknown): string {
  if (isAuthError(err) && err.code && MESSAGES[err.code]) return MESSAGES[err.code];
  if (err instanceof Error) return err.message;
  return "Terjadi kesalahan.";
}
