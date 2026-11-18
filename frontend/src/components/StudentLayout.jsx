
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      <StudentSidebar />

      <main className="flex-1 min-w-0 p-6 md:p-10">
        <Outlet />
      </main>

    </div>
  );
}
