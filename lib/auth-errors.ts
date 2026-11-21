export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;
  const value = error as { status?: number; statusCode?: number; message?: string };
  const status = value.status ?? value.statusCode;
  if (status && status >= 500) return "The sign-in service is temporarily unavailable. Please try again shortly.";
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  return typeof value.message === "string" && value.message.trim() ? value.message : fallback;
}

export function getOAuthErrorMessage(code: string | null): string {
  if (!code) return "";
  if (code === "access_denied") return "Google sign-in was cancelled. You can try again.";
  if (code === "account_not_linked") {
    return "This email already has an account. Sign in with your password, then connect Google in your profile.";
  }
  if (code === "email_does_not_match" || code === "account_already_linked_to_different_user") {
    return "Choose the Google account with the same email address as your FixMate account.";
  }
  if (["state_not_found", "state_mismatch", "invalid_state", "state_expired", "request_not_found"].includes(code)) {
    return "Your Google sign-in request expired. Please try again from this page.";
  }
  return "Google sign-in could not be completed. Please try again.";
}
