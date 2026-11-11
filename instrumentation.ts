export async function register() {
  await import("@/config/client");
  await import("@/config/server");

  if (process.env.NODE_ENV === "production" && !process.env.RAFT_DATABASE_URL) {
    console.warn("[raft] RAFT_DATABASE_URL is not set - errors will not be quarantined");
  }
}
