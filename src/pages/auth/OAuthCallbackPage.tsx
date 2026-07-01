import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { toast } from "sonner";

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google login failed. Please try again.");
      navigate("/login");
      return;
    }

    if (accessToken) {
      // Set the token in the API client first
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Fetch user data using the token
      api
        .get("/auth/me")
        .then((response) => {
          const user = response.data.data;
          // Store user and token in auth store
          useAuthStore.getState().login(user, accessToken);
          toast.success("Logged in with Google!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          toast.error("Failed to load user data");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Signing in with Google...</p>
      </div>
    </div>
  );
}
