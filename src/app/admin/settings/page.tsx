import RegistrationToggle from "@/components/admin/RegistrationToggle";
import { isRegistrationOpen } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const open = await isRegistrationOpen();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Control how people join the platform.
        </p>
      </div>
      <RegistrationToggle initialOpen={open} />
    </div>
  );
}
