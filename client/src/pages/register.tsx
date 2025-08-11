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
import { UserPlus, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import { z } from "zod";

// Extended schema with password confirmation - excluding username and company from form
const registerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Remove confirmPassword before sending to server
      const { confirmPassword, ...registerData } = data;
      // Auto-generate username from email
      const username = registerData.email.split('@')[0];
      // Ensure company field is not sent if not in form
      const finalData = {
        ...registerData,
        username,
        company: undefined
      };
      return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(finalData),
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

  const onSubmit = (data: RegisterFormData) => {
    console.log("Submitting registration form:", data);
    console.log("Form errors:", form.formState.errors);
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients matching main page */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
      </div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Main register card with glassmorphism effect matching main page */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
            <Card className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur border border-border/50 rounded-3xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
              <CardHeader className="space-y-4 text-center p-8">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Join OAuth 3
                  </CardTitle>
                  <CardDescription className="text-base mt-2 text-muted-foreground">
                    Create your OAuth 3 authentication account
                  </CardDescription>
                </div>
              </CardHeader>

            <CardContent className="p-8 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John"
                              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
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
                          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Doe"
                              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
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
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter at least 8 characters"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold text-base border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4 text-black" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>


            </CardContent>
            </Card>
          </div>




        </div>
      </div>
    </div>
  );
}