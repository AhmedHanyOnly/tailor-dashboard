"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
interface ProtectedAuthProps {
  children:ReactNode
}
export default function ProtectedAuth({ children }: ProtectedAuthProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const localToken = localStorage.getItem("token");

    if (token || localToken) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return <>{children}</>;
}
