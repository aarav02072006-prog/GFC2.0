function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

export function getDatabaseUrl(): string {
  return required("DATABASE_URL");
}

export function getSessionSecret(): string {
  return required("SESSION_SECRET");
}
