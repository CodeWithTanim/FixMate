export function getAuthConfiguration(env: Record<string, string | undefined>) {
  const originOf = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    try {
      const url = new URL(value.trim());
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return undefined;
      return url.origin;
    } catch {
      return undefined;
    }
  };

  const productionOrigin = originOf(env.BETTER_AUTH_URL)
    || originOf(env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
  const localOrigins = env.NODE_ENV === "production" ? [] : ["http://localhost:3000", "http://127.0.0.1:3000"];
  const origins = [...new Set([
    productionOrigin,
    originOf(env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined),
    ...(env.BETTER_AUTH_TRUSTED_ORIGINS || "").split(",").map(originOf),
    ...localOrigins,
  ].filter((value): value is string => Boolean(value)))];

  if (!origins.length) throw new Error("Configure BETTER_AUTH_URL before starting authentication.");

  return {
    trustedOrigins: origins,
    baseURL: {
      allowedHosts: origins.map(origin => new URL(origin).host),
      fallback: productionOrigin || origins[0],
      protocol: "auto" as const,
    },
    googleConfigured: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  };
}
