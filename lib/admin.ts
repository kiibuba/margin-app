// Which signed-in emails count as reviewers. Comma-separated in the
// ADMIN_EMAILS env var, e.g. "you@example.com,teammate@example.com".
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
