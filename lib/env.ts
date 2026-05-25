const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'NEXTAUTH_SECRET',
] as const;

type EnvVar = typeof requiredEnvVars[number];

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
} as const;

function validateEnv() {
  const missing: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    const isProduction = env.NODE_ENV === 'production';
    const message = `Missing required environment variables: ${missing.join(', ')}`;

    if (isProduction) {
      throw new Error(message);
    } else {
      console.warn(`⚠️  ${message}`);
    }
  }
}

if (typeof window === 'undefined') {
  validateEnv();
}

export { env, validateEnv };
