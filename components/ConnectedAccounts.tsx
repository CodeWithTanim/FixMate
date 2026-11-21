"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage, getOAuthErrorMessage } from "@/lib/auth-errors";

export default function ConnectedAccounts() {
  const searchParams = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(() => getOAuthErrorMessage(searchParams.get("error")));

  useEffect(() => {
    let active = true;
    authClient.listAccounts().then(result => {
      if (!active) return;
      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Could not check connected accounts. Please refresh this page."));
      } else {
        setConnected(result.data.some(account => account.providerId === "google"));
      }
    }).catch(() => {
      if (active) setError("Could not check connected accounts. Please refresh this page.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function connectGoogle() {
    setConnecting(true);
    setError("");
    try {
      const result = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/dashboard/profile",
        errorCallbackURL: "/dashboard/profile",
        disableRedirect: true,
      });
      if (result.error) throw new Error(getAuthErrorMessage(result.error, "Could not connect Google. Please try again."));
      if (!result.data?.url) throw new Error("Could not connect Google. Please try again.");
      window.location.assign(result.data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not connect Google. Please try again.");
      setConnecting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#DCE5DF] bg-white p-5 sm:p-6 space-y-4" aria-labelledby="google-sign-in-title">
      <div>
        <h3 id="google-sign-in-title" className="text-sm font-bold text-[#152C2B]">Google Sign In</h3>
        <p className="mt-1 text-xs text-[#526564]">
          {connected ? "Google is connected. You can use Google to sign in to this account." : "Connect the Google account with the same email address to use it for future sign-ins."}
        </p>
      </div>
      {error && <p role="alert" className="text-xs text-rose-700">{error}</p>}
      <button
        type="button"
        onClick={connectGoogle}
        disabled={loading || connecting || connected}
        className="inline-flex items-center gap-2 rounded-xl border border-[#DCE5DF] px-4 py-2.5 text-sm font-semibold text-[#18756B] hover:bg-[#F6F5EF] disabled:opacity-60 disabled:cursor-default cursor-pointer"
      >
        {loading || connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : connected ? <CheckCircle2 className="h-4 w-4" /> : null}
        {loading ? "Checking Google connection..." : connecting ? "Connecting..." : connected ? "Google Connected" : "Connect Google"}
      </button>
    </section>
  );
}
