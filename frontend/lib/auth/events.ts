export const AUTH_EVENTS = {
  LOGOUT: 'auth:logout',
} as const;

export function dispatchAuthEvent(event: keyof typeof AUTH_EVENTS, detail?: unknown) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS[event], { detail }));
  }
}

export function onAuthEvent(event: keyof typeof AUTH_EVENTS, handler: (detail?: unknown) => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_EVENTS[event], handler as EventListener);
    return () => window.removeEventListener(AUTH_EVENTS[event], handler as EventListener);
  }
  return () => {};
}