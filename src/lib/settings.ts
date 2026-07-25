import { createClient } from "@/lib/supabase/server";

export async function isRegistrationOpen(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("registration_open")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return true;
    return Boolean(data.registration_open);
  } catch {
    return true;
  }
}
