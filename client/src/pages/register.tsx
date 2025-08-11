import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Link } from "wouter";
import { ArrowLeft, UserPlus, Shield, Check } from "lucide-react";
import Navbar from "@/components/navbar";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      company: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate auth queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      toast({
        title: "회원가입 성공",
        description: "OAuth3 계정이 성공적으로 생성되었습니다. 로그인해주세요.",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Back to home link */}
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Link>

          <Card className="border-2 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  OAuth3 회원가입
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  블록체인 인증 플랫폼에 가입하세요
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">이름</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="홍길동"
                              className="h-12 border-2 focus:border-purple-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">성</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="김"
                              className="h-12 border-2 focus:border-purple-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">사용자명</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="사용자명을 입력하세요"
                            className="h-12 border-2 focus:border-purple-500 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">이메일</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="h-12 border-2 focus:border-purple-500 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="8자 이상 입력하세요"
                            className="h-12 border-2 focus:border-purple-500 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">회사 (선택사항)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="회사명을 입력하세요"
                            className="h-12 border-2 focus:border-purple-500 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold text-base shadow-lg transition-all duration-200"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>계정 생성 중...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>계정 생성</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-muted-foreground">또는</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                    로그인하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 space-y-4">
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
              OAuth3와 함께 얻는 혜택
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>블록체인 기반 보안 인증</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>API 키 관리 및 모니터링</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>멀티체인 지원</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>실시간 트랜잭션 추적</span>
              </div>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 모든 개인정보는 암호화되어 안전하게 보관됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}