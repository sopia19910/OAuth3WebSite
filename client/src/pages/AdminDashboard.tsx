import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface User {
  id: number;
  username: string;
  email: string;
  isBlocked?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiApplication {
  id: string;
  name: string;
  owner: string;
  selectedPlan: string;
  approvalStatus: string;
  purpose: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  
  // 관리자 권한 확인
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "접근 권한 없음",
        description: "관리자 권한이 필요합니다.",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation, toast]);

  // 사용자 목록 조회
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await apiRequest("/api/admin/users");
      return response.users || [];
    },
    enabled: !!user?.isAdmin,
  });

  // API 신청 목록 조회
  const { data: applications = [], isLoading: appsLoading, refetch: refetchApplications } = useQuery<ApiApplication[]>({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const response = await apiRequest("/api/admin/applications");
      return response.applications || [];
    },
    enabled: !!user?.isAdmin,
  });

  // 사용자 차단/차단 해제
  const blockUserMutation = useMutation({
    mutationFn: async ({ userId, block }: { userId: number; block: boolean }) => {
      return apiRequest(`/api/admin/users/${userId}/block`, {
        method: "POST",
        body: JSON.stringify({ block }),
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.block ? "사용자 차단됨" : "차단 해제됨",
        description: variables.block 
          ? "사용자가 차단되었습니다." 
          : "사용자 차단이 해제되었습니다.",
      });
      refetchUsers();
    },
    onError: (error: Error) => {
      toast({
        title: "오류 발생",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // API 신청 승인/거부
  const approveApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      return apiRequest(`/api/admin/applications/${applicationId}/approve`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.status === "approved" ? "승인 완료" : "거부 완료",
        description: variables.status === "approved" 
          ? "API 신청이 승인되었습니다." 
          : "API 신청이 거부되었습니다.",
      });
      refetchApplications();
    },
    onError: (error: Error) => {
      toast({
        title: "오류 발생",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/dashboard")}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                관리자 대쉬보드
              </h1>
            </div>
            <Badge variant="outline" className="text-purple-500 border-purple-500">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              관리자
            </Badge>
          </div>
          <p className="text-muted-foreground">시스템 사용자 및 API 신청을 관리합니다.</p>
        </div>

        {/* 탭 메뉴 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              회원 관리
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <KeyIcon className="h-4 w-4" />
              API 관리
            </TabsTrigger>
          </TabsList>

          {/* 회원 관리 탭 */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>회원 목록</CardTitle>
                <CardDescription>등록된 사용자를 관리하고 차단할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    등록된 사용자가 없습니다.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>사용자명</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>가입일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              {user.username}
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.isVerified && (
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  인증됨
                                </Badge>
                              )}
                              {user.isBlocked && (
                                <Badge variant="outline" className="text-red-500 border-red-500">
                                  <NoSymbolIcon className="h-3 w-3 mr-1" />
                                  차단됨
                                </Badge>
                              )}
                              {!user.isVerified && !user.isBlocked && (
                                <Badge variant="outline" className="text-gray-500 border-gray-500">
                                  일반
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.createdAt), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={user.isBlocked ? "default" : "destructive"}
                              onClick={() => blockUserMutation.mutate({ 
                                userId: user.id, 
                                block: !user.isBlocked 
                              })}
                              disabled={blockUserMutation.isPending}
                            >
                              {user.isBlocked ? (
                                <>
                                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                                  차단 해제
                                </>
                              ) : (
                                <>
                                  <NoSymbolIcon className="h-4 w-4 mr-1" />
                                  차단
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API 관리 탭 */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>API 신청 목록</CardTitle>
                <CardDescription>API 사용 신청을 검토하고 승인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {appsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    API 신청이 없습니다.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>프로젝트명</TableHead>
                        <TableHead>신청자</TableHead>
                        <TableHead>플랜</TableHead>
                        <TableHead>용도</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>신청일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <KeyIcon className="h-4 w-4 text-muted-foreground" />
                              {app.name}
                            </div>
                          </TableCell>
                          <TableCell>{app.owner}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-purple-500 border-purple-500">
                              {app.selectedPlan || "Free"}
                            </Badge>
                          </TableCell>
                          <TableCell>{app.purpose}</TableCell>
                          <TableCell>
                            {app.approvalStatus === "pending" && (
                              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                대기 중
                              </Badge>
                            )}
                            {app.approvalStatus === "approved" && (
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                승인됨
                              </Badge>
                            )}
                            {app.approvalStatus === "rejected" && (
                              <Badge variant="outline" className="text-red-500 border-red-500">
                                <XCircleIcon className="h-3 w-3 mr-1" />
                                거부됨
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(app.createdAt), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell className="text-right">
                            {app.approvalStatus === "pending" && (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => approveApplicationMutation.mutate({ 
                                    applicationId: app.id, 
                                    status: "approved" 
                                  })}
                                  disabled={approveApplicationMutation.isPending}
                                >
                                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                                  승인
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => approveApplicationMutation.mutate({ 
                                    applicationId: app.id, 
                                    status: "rejected" 
                                  })}
                                  disabled={approveApplicationMutation.isPending}
                                >
                                  <XCircleIcon className="h-4 w-4 mr-1" />
                                  거부
                                </Button>
                              </div>
                            )}
                            {app.approvalStatus === "approved" && (
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                승인 완료
                              </Badge>
                            )}
                            {app.approvalStatus === "rejected" && (
                              <Badge variant="outline" className="text-red-500 border-red-500">
                                거부됨
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}