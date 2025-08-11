import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Key, Clock, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { z } from "zod";

const apiApplicationSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(100, "Project name too long"),
  projectDescription: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  projectType: z.enum(["web", "mobile", "desktop", "server", "other"], {
    required_error: "Please select a project type",
  }),
  expectedUsage: z.enum(["low", "medium", "high"], {
    required_error: "Please select expected usage",
  }),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  additionalInfo: z.string().max(1000, "Additional info too long").optional(),
});

type ApiApplicationForm = z.infer<typeof apiApplicationSchema>;

interface ApiApplication {
  id: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  expectedUsage: string;
  website?: string;
  additionalInfo?: string;
  status: "pending" | "approved" | "rejected";
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApiApplication() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const form = useForm<ApiApplicationForm>({
    resolver: zodResolver(apiApplicationSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      projectType: undefined,
      expectedUsage: undefined,
      website: "",
      additionalInfo: "",
    },
  });

  // Fetch user's API applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: ApiApplicationForm) => {
      return apiRequest("/api/applications", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Application Submitted",
        description: "Your API application has been submitted for review.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application.",
        variant: "destructive",
      });
    },
  });

  const copyApiKey = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedKey(apiKey);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy API key to clipboard",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ApiApplicationForm) => {
    applicationMutation.mutate(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
        </div>
        
        <Navbar />
        
        <div className="container mx-auto px-4 pt-32 relative z-10 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-xl text-muted-foreground mb-8">Please sign in to access the API application system.</p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
      </div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-foreground">API Application Center</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Apply for OAuth 3 API access to integrate our authentication services into your projects
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Application Form */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
              <Card className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur border border-border/50 rounded-3xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                <CardHeader className="space-y-4 text-center p-8">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    New API Application
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Submit your project details to request API access
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Project Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="My Awesome Project"
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Project Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Describe your project and how you plan to use OAuth 3..."
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Project Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="web">Web Application</SelectItem>
                                  <SelectItem value="mobile">Mobile App</SelectItem>
                                  <SelectItem value="desktop">Desktop Application</SelectItem>
                                  <SelectItem value="server">Server/Backend</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="expectedUsage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Expected Usage</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200">
                                    <SelectValue placeholder="Select usage" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low (&lt; 1K requests/month)</SelectItem>
                                  <SelectItem value="medium">Medium (1K-10K requests/month)</SelectItem>
                                  <SelectItem value="high">High (&gt; 10K requests/month)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Website (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="url"
                                placeholder="https://yourproject.com"
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Additional Information (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Any additional details about your project or specific requirements..."
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={applicationMutation.isPending}
                        className="w-full py-3 bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white dark:text-black font-semibold transition-all duration-300"
                      >
                        {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
              <Card className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur border border-border/50 rounded-3xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                <CardHeader className="space-y-4 text-center p-8">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Your Applications
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Track the status of your API applications
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : applications && Array.isArray(applications) && applications.length > 0 ? (
                    <div className="space-y-4">
                      {(applications as ApiApplication[]).map((app: ApiApplication) => (
                        <div key={app.id} className="p-4 border border-border/50 rounded-lg backdrop-blur-sm">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{app.projectName}</h3>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(app.status)}
                              <span className={`text-sm font-medium capitalize ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{app.projectDescription}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Type: {app.projectType}</span>
                            <span>Usage: {app.expectedUsage}</span>
                          </div>
                          {app.status === "approved" && app.apiKey && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">API Key:</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyApiKey(app.apiKey!)}
                                  className="h-6 px-2"
                                >
                                  {copiedKey === app.apiKey ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                              <code className="text-xs text-muted-foreground block mt-1 break-all">
                                {app.apiKey}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No applications yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Submit your first application to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}