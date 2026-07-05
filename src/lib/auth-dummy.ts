export interface DummyUser {
  id: string;
  name: string;
  email: string;
}

const SESSION_KEY = "mimir.session";

export const DEMO_CREDENTIALS = {
  email: "odin@mimir.app",
  password: "mimir123",
  name: "Odin Borrson",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const listeners = new Set<() => void>();

let snapshotRaw: string | null = null;
let snapshotValue: DummyUser | null = null;

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSessionSnapshot(): DummyUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshotValue = raw ? (JSON.parse(raw) as DummyUser) : null;
  }
  return snapshotValue;
}

export function getSession(): DummyUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as DummyUser) : null;
}

function persist(user: DummyUser): DummyUser {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  listeners.forEach((listener) => listener());
  return user;
}

export async function signIn(email: string, password: string): Promise<DummyUser> {
  await wait(900);
  if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
    throw new Error("Email atau kata sandi salah.");
  }
  return persist({ id: "u_odin", name: DEMO_CREDENTIALS.name, email });
}

export async function signInWithGoogle(): Promise<DummyUser> {
  await wait(1100);
  return persist({ id: "u_google", name: "Freya Vanadis", email: "freya@mimir.app" });
}

export async function signUp(name: string, email: string): Promise<DummyUser> {
  await wait(1100);
  if (email === DEMO_CREDENTIALS.email) {
    throw new Error("Email sudah terdaftar. Silakan masuk.");
  }
  return persist({ id: `u_${Date.now()}`, name, email });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await wait(900);
  if (!email) {
    throw new Error("Masukkan email yang terdaftar.");
  }
}

export async function updateProfile(name: string): Promise<DummyUser> {
  await wait(700);
  const current = getSession();
  if (!current) {
    throw new Error("Sesi berakhir. Silakan masuk kembali.");
  }
  return persist({ ...current, name });
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
  snapshotRaw = null;
  snapshotValue = null;
  listeners.forEach((listener) => listener());
}
