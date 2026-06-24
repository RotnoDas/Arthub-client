"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!sessionData?.user) {
        router.push("/login");
      } else {
        const role = sessionData.user.role;
        if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "artist") {
          router.push("/dashboard/artist");
        } else {
          router.push("/dashboard/user");
        }
      }
    }
  }, [sessionData, isPending, router]);

  return (
    <div className="flex w-full h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-slate-400 animate-pulse">Routing to your dashboard...</p>
      </div>
    </div>
  );
}
