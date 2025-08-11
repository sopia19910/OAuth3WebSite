import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  googleId: string;
  username?: string;
  isAdmin?: boolean;
}

export function useAuth() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await apiRequest("/api/auth/me");
      return response.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "로그아웃 실패",
        description: error.message || "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}