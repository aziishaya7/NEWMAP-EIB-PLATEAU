import StaffManager from "@/components/admin/StaffManager";
import { listAllStaff } from "@/lib/staff";

export default async function AdminStaffPage() {
  const members = await listAllStaff();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Staff</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add, update, or remove people shown on the public staff page. Hide
          someone to take them off the site without deleting their record.
        </p>
      </div>
      <StaffManager initialStaff={members} />
    </div>
  );
}
