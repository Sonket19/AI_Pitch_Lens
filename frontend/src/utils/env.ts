const processEnv: Record<string, string | undefined> | undefined =
  typeof process !== "undefined" ? (process.env as Record<string, string | undefined>) : undefined;

const metaEnv: Record<string, string | undefined> | undefined =
  typeof import.meta !== "undefined"
    ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    : undefined;

export function getEnvValue(
  keys: string[],
  options?: { fallback?: string; trimTrailingSlash?: boolean },
): string {
  for (const key of keys) {
    const value = processEnv?.[key] ?? metaEnv?.[key];
    if (value !== undefined && value !== "") {
      return options?.trimTrailingSlash ? value.replace(/\/+$/, "") : value;
    }
  }

  if (options?.fallback !== undefined) {
    return options.trimTrailingSlash ? options.fallback.replace(/\/+$/, "") : options.fallback;
  }

  const message =
    keys.length > 1
      ? `Missing environment variables: ${keys.join(", ")}`
      : `Missing environment variable: ${keys[0]}`;
  throw new Error(message);
}
