import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder";

export const createClient = () => {
  const client = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = async (jwt) => {
    try {
      return await originalGetUser(jwt);
    } catch (error) {
      console.error('Supabase client getUser error:', error);
      return { data: { user: null }, error: error as any };
    }
  };

  return client;
};
