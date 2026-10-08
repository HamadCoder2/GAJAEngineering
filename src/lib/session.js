const KEY = "gaja-demo-session";

export function readSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(
      sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY) ?? "null"
    );
  } catch {
    return null;
  }
}

export function saveSession(value, remember) {
  if (remember) localStorage.setItem(KEY, JSON.stringify(value));
  else sessionStorage.setItem(KEY, JSON.stringify(value));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
