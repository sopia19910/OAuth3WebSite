import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, RefreshCw, ExternalLink, Code, Zap, Shield } from "lucide-react";
import { insertProjectSchema, type InsertProject, type Chain } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

export default function DevelopersApply() {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "success">("form");
  const [projectResult, setProjectResult] = useState<any>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [createSandbox, setCreateSandbox] = useState(true);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      owner: "",
      purpose: "web",
      callbackDomains: [],
      ipWhitelist: [],
      defaultChainId: 1,
      gasSponsorEnabled: false,
      gasDailyLimit: "0",
      dailyTransferLimit: 100,
      dailyAmountLimit: "1000",
      allowedChains: [1],
      webhookUrl: "",
    },
  });

  const { data: chainsData, isLoading: chainsLoading } = useQuery<{ success: boolean; chains: Chain[] }>({
    queryKey: ["/api/chains"],
  });
  
  const chains = chainsData?.chains || [];

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject & { acceptedTerms: boolean; createSandbox: boolean }) => {
      return await apiRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setProjectResult(data);
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created Successfully",
        description: "Your API key has been generated. Make sure to copy it now!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const regenerateKeyMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return await apiRequest(`/api/projects/${projectId}/regenerate-key`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      setProjectResult({ ...projectResult, apiKey: data.apiKey });
      toast({
        title: "API Key Regenerated",
        description: "New API key generated successfully",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({
      ...data,
      acceptedTerms,
      createSandbox,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "API key copied successfully",
    });
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">🎉 Project Created Successfully!</CardTitle>
              <CardDescription>
                Your OAuth3 API project has been set up. Here are your credentials and next steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Display */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">API Key (Save this now!)</Label>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This is the only time you'll see the full API key. Make sure to copy and store it securely.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center space-x-2">
                  <Input
                    value={showApiKey ? projectResult?.apiKey : `${projectResult?.apiKey?.substring(0, 8)}${"*".repeat(32)}`}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(projectResult?.apiKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => regenerateKeyMutation.mutate(projectResult?.project?.id)}
                    disabled={regenerateKeyMutation.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 ${regenerateKeyMutation.isPending ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project ID</Label>
                  <p className="font-mono text-sm">{projectResult?.project?.id}</p>
                </div>
                <div>
                  <Label>Project Name</Label>
                  <p>{projectResult?.project?.name}</p>
                </div>
              </div>

              {/* Sandbox Account */}
              {createSandbox && projectResult?.sandboxAccount && (
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Sandbox Account Created</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-mono text-sm">{projectResult.sandboxAccount.address}</p>
                    <p className="text-muted-foreground text-sm">Use this account for testing</p>
                  </div>
                </div>
              )}

              {/* Quickstart Guide */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Quick Start (3 Steps)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge variant="outline">1</Badge>
                        Create Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">Set up a new OAuth3 account for your users</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Code className="h-3 w-3 mr-1" />
                        Code Example
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge variant="outline">2</Badge>
                        Send Transfer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">Execute your first blockchain transfer</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Zap className="h-3 w-3 mr-1" />
                        Try Now
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge variant="outline">3</Badge>
                        Setup Webhooks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">Receive real-time notifications</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep("form")}>
                  Create Another Project
                </Button>
                <Button variant="outline" asChild>
                  <a href="/developers/docs" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">OAuth3 Account & Transfer API</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Build the next generation of blockchain applications with hybrid authentication
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" asChild>
              <a href="/developers/docs">
                <Code className="h-4 w-4 mr-2" />
                Quickstart Guide
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/developers/pricing">
                <Zap className="h-4 w-4 mr-2" />
                Pricing & Limits
              </a>
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Free Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 1,000 API calls/month</li>
                <li>• 100 transfers/day</li>
                <li>• $1,000 daily limit</li>
                <li>• Basic support</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multi-Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Ethereum Mainnet</li>
                <li>• Base Network</li>
                <li>• Polygon</li>
                <li>• More coming soon</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Zero-Knowledge Proofs</li>
                <li>• Smart Contract Security</li>
                <li>• IP Whitelisting</li>
                <li>• Webhook Signatures</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Fill out the form below to generate your API credentials and start building.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="limits">Limits & Gas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Project Name *</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="My Awesome DApp"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="owner">Email Address *</Label>
                      <Input
                        id="owner"
                        type="email"
                        {...form.register("owner")}
                        placeholder="developer@example.com"
                      />
                      {form.formState.errors.owner && (
                        <p className="text-sm text-red-500">{form.formState.errors.owner.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      placeholder="Brief description of your project..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purpose">Purpose *</Label>
                      <Select
                        value={form.watch("purpose")}
                        onValueChange={(value) => form.setValue("purpose", value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web Application</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                          <SelectItem value="server">Server/Backend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="defaultChainId">Default Chain *</Label>
                      <Select
                        value={form.watch("defaultChainId")?.toString()}
                        onValueChange={(value) => form.setValue("defaultChainId", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select chain" />
                        </SelectTrigger>
                        <SelectContent>
                          {chainsLoading ? (
                            <SelectItem value="loading" disabled>Loading chains...</SelectItem>
                          ) : chains.map((chain) => (
                            <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                              {chain.networkName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <div>
                    <Label htmlFor="callbackDomains">Callback Domains (Optional)</Label>
                    <Textarea
                      id="callbackDomains"
                      placeholder="https://example.com&#10;https://app.example.com"
                      onChange={(e) => {
                        const domains = e.target.value.split('\n').filter(d => d.trim());
                        form.setValue("callbackDomains", domains);
                      }}
                    />
                    <p className="text-sm text-muted-foreground">One domain per line</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="ipWhitelist">IP Whitelist (Optional)</Label>
                    <Textarea
                      id="ipWhitelist"
                      placeholder="192.168.1.1&#10;10.0.0.0/8"
                      onChange={(e) => {
                        const ips = e.target.value.split('\n').filter(ip => ip.trim());
                        form.setValue("ipWhitelist", ips);
                      }}
                    />
                    <p className="text-sm text-muted-foreground">One IP/CIDR per line</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                    <Input
                      id="webhookUrl"
                      {...form.register("webhookUrl")}
                      placeholder="https://api.example.com/webhook"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="limits" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dailyTransferLimit">Daily Transfer Limit (Count)</Label>
                      <Input
                        id="dailyTransferLimit"
                        type="number"
                        {...form.register("dailyTransferLimit", { valueAsNumber: true })}
                        min="1"
                        max="10000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dailyAmountLimit">Daily Amount Limit (USD)</Label>
                      <Input
                        id="dailyAmountLimit"
                        {...form.register("dailyAmountLimit")}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="gasSponsor"
                        checked={form.watch("gasSponsorEnabled")}
                        onCheckedChange={(checked) => form.setValue("gasSponsorEnabled", checked)}
                      />
                      <Label htmlFor="gasSponsor">Enable Gas Sponsoring</Label>
                    </div>
                    
                    {form.watch("gasSponsorEnabled") && (
                      <div>
                        <Label htmlFor="gasDailyLimit">Daily Gas Limit (USD)</Label>
                        <Input
                          id="gasDailyLimit"
                          {...form.register("gasDailyLimit")}
                          placeholder="100"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Allowed Chains</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {chains.map((chain) => (
                        <div key={chain.chainId} className="flex items-center space-x-2">
                          <Checkbox
                            id={`chain-${chain.chainId}`}
                            checked={form.watch("allowedChains")?.includes(chain.chainId)}
                            onCheckedChange={(checked) => {
                              const current = form.watch("allowedChains") || [];
                              if (checked) {
                                form.setValue("allowedChains", [...current, chain.chainId]);
                              } else {
                                form.setValue("allowedChains", current.filter(id => id !== chain.chainId));
                              }
                            }}
                          />
                          <Label htmlFor={`chain-${chain.chainId}`} className="text-sm">
                            {chain.networkName}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="createSandbox"
                    checked={createSandbox}
                    onCheckedChange={setCreateSandbox}
                  />
                  <Label htmlFor="createSandbox">Create Sandbox Account (Recommended)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={setAcceptedTerms}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createProjectMutation.isPending || !acceptedTerms}
                >
                  {createProjectMutation.isPending ? "Creating Project..." : "Create Project & Generate API Key"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}