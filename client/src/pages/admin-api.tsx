import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Play, 
  Pause, 
  Ban, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp,
  Download,
  Settings,
  Users,
  Zap,
  Shield,
  Activity,
  BarChart3,
  Clock
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project, ApiKey, Transfer, UsageMetric, AuditLog, Chain } from "@shared/schema";

export default function AdminApi() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [activeTab, setActiveTab] = useState("projects");

  // Data queries
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: transfers = [], isLoading: transfersLoading } = useQuery<Transfer[]>({
    queryKey: [`/api/transfers?timeRange=${timeRange}`],
  });

  const { data: metrics = [], isLoading: metricsLoading } = useQuery<UsageMetric[]>({
    queryKey: [`/api/usage-metrics?timeRange=${timeRange}`],
  });

  const { data: auditLogs = [], isLoading: auditLoading } = useQuery<AuditLog[]>({
    queryKey: [`/api/audit-logs?timeRange=${timeRange}`],
  });

  const { data: chainsData, isLoading: chainsLoading } = useQuery<{ success: boolean; chains: Chain[] }>({
    queryKey: ["/api/chains"],
  });
  
  const chains = chainsData?.chains || [];

  // Mutations
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      return await apiRequest(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully" });
    },
  });

  const retryTransferMutation = useMutation({
    mutationFn: async (transferId: string) => {
      return await apiRequest(`/api/transfers/${transferId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "pending" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/transfers?timeRange=${timeRange}`] });
      toast({ title: "Transfer retry initiated" });
    },
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      suspended: "secondary",
      deleted: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getTransferStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
      confirmed: { variant: "default", icon: CheckCircle },
      pending: { variant: "secondary", icon: Clock },
      failed: { variant: "destructive", icon: XCircle },
      cancelled: { variant: "outline", icon: Ban },
    };
    const { variant, icon: Icon } = config[status] || { variant: "outline", icon: AlertTriangle };
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">API Management Console</h1>
            <p className="text-muted-foreground">Manage projects, monitor usage, and oversee API operations</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.filter(p => p.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfers ({timeRange})</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transfers.length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(transfers.filter(t => t.status === "confirmed").length / transfers.length * 100) || 0}% success rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.reduce((sum, m) => sum + m.requestCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(metrics.reduce((sum, m) => sum + m.successCount, 0) / metrics.reduce((sum, m) => sum + m.requestCount, 1) * 100)}% success
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(metrics.reduce((sum, m) => sum + m.avgLatency, 0) / metrics.length) || 0}ms
              </div>
              <p className="text-xs text-muted-foreground">P95 response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="usage">Usage & Throttling</TabsTrigger>
            <TabsTrigger value="transfers">Transfers Monitor</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="audit">Audit & Logs</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-80"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Manage API projects, keys, and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.purpose}</div>
                          </div>
                        </TableCell>
                        <TableCell>{project.owner}</TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {chains.find(c => c.chainId === project.defaultChainId)?.networkName || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={project.riskScore > 70 ? "destructive" : project.riskScore > 40 ? "secondary" : "default"}>
                            {project.riskScore}/100
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Project Details: {project.name}</DialogTitle>
                                  <DialogDescription>
                                    Manage project settings, API keys, and policies
                                  </DialogDescription>
                                </DialogHeader>
                                <ProjectDetailModal project={project} chains={chains} />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateProjectMutation.mutate({
                                id: project.id,
                                data: { status: project.status === "active" ? "suspended" : "active" }
                              })}
                            >
                              {project.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage & Throttling Tab */}
          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Request Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.slice(0, 5).map((metric, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{metric.endpoint}</div>
                          <div className="text-sm text-muted-foreground">
                            {metric.requestCount} requests
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{Math.round(metric.successCount / metric.requestCount * 100)}%</div>
                          <div className="text-sm text-muted-foreground">{metric.avgLatency}ms</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Global Rate Limit</Label>
                      <div className="flex items-center space-x-2">
                        <Input className="w-20" defaultValue="1000" />
                        <span className="text-sm text-muted-foreground">req/min</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Per Project Limit</Label>
                      <div className="flex items-center space-x-2">
                        <Input className="w-20" defaultValue="100" />
                        <span className="text-sm text-muted-foreground">req/min</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Per IP Limit</Label>
                      <div className="flex items-center space-x-2">
                        <Input className="w-20" defaultValue="60" />
                        <span className="text-sm text-muted-foreground">req/min</span>
                      </div>
                    </div>
                    <Button className="w-full">Update Limits</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transfers Monitor Tab */}
          <TabsContent value="transfers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Transfer Monitor</CardTitle>
                <CardDescription>Monitor and manage blockchain transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transfer ID</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Chain</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tx Hash</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transfers.slice(0, 20).map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className="font-mono text-xs">
                            {transfer.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {projects.find(p => p.id === transfer.projectId)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {chains.find(c => c.chainId === transfer.chainId)?.networkName || transfer.chainId}
                          </TableCell>
                          <TableCell>
                            {transfer.amount} {transfer.tokenAddress ? 'Token' : 'ETH'}
                          </TableCell>
                          <TableCell>{getTransferStatusBadge(transfer.status)}</TableCell>
                          <TableCell>
                            {transfer.txHash ? (
                              <a 
                                href={`${chains.find(c => c.chainId === transfer.chainId)?.explorerUrl}/tx/${transfer.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-mono text-xs"
                              >
                                {transfer.txHash.substring(0, 10)}...
                              </a>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {transfer.status === "failed" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => retryTransferMutation.mutate(transfer.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Default Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Default Transfer Limit</Label>
                    <Input defaultValue="100" type="number" />
                  </div>
                  <div>
                    <Label>Default Amount Limit</Label>
                    <Input defaultValue="1000" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="gas-sponsor" />
                    <Label htmlFor="gas-sponsor">Enable Gas Sponsoring by Default</Label>
                  </div>
                  <Button>Save Defaults</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">High Value Transfer</div>
                        <div className="text-sm text-muted-foreground">Amount &gt; $10,000</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">Rapid Transfers</div>
                        <div className="text-sm text-muted-foreground">&gt;10 transfers/hour</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">New Project Activity</div>
                        <div className="text-sm text-muted-foreground">Project age &lt; 7 days</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add New Rule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit & Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Track all administrative actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.slice(0, 20).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{log.actor}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {JSON.stringify(log.details)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Project Detail Modal Component
function ProjectDetailModal({ project, chains }: { project: Project; chains: Chain[] }) {
  const [activeSection, setActiveSection] = useState("info");

  return (
    <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Basic Info</TabsTrigger>
        <TabsTrigger value="keys">API Keys</TabsTrigger>
        <TabsTrigger value="limits">Limits & Policies</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Project Name</Label>
            <Input defaultValue={project.name} />
          </div>
          <div>
            <Label>Owner</Label>
            <Input defaultValue={project.owner} />
          </div>
          <div>
            <Label>Purpose</Label>
            <Select defaultValue={project.purpose}>
              <SelectTrigger>
                <SelectValue />
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
            <Label>Status</Label>
            <Select defaultValue={project.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label>Description</Label>
          <Textarea defaultValue={project.description || ""} />
        </div>
        
        <div>
          <Label>Internal Notes</Label>
          <Textarea defaultValue={project.notes || ""} placeholder="Internal notes for this project..." />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </TabsContent>

      <TabsContent value="keys" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">API Keys</h3>
          <Button>Generate New Key</Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <div className="font-medium">Production Key</div>
              <div className="text-sm text-muted-foreground font-mono">
                pk_live_1234...****
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="default">Active</Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="limits" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Daily Transfer Limit</Label>
            <Input type="number" defaultValue={project.dailyTransferLimit} />
          </div>
          <div>
            <Label>Daily Amount Limit (USD)</Label>
            <Input defaultValue={project.dailyAmountLimit} />
          </div>
          <div>
            <Label>Gas Daily Limit (USD)</Label>
            <Input defaultValue={project.gasDailyLimit} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch defaultChecked={project.gasSponsorEnabled} />
            <Label>Gas Sponsoring Enabled</Label>
          </div>
        </div>
        
        <div>
          <Label>Allowed Chains</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {chains.map((chain) => (
              <div key={chain.chainId} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`chain-${chain.chainId}`}
                  defaultChecked={project.allowedChains?.includes(chain.chainId)}
                />
                <Label htmlFor={`chain-${chain.chainId}`} className="text-sm">
                  {chain.networkName}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Button>Update Limits</Button>
      </TabsContent>

      <TabsContent value="webhooks" className="space-y-4 mt-4">
        <div>
          <Label>Webhook URL</Label>
          <Input defaultValue={project.webhookUrl || ""} placeholder="https://api.example.com/webhook" />
        </div>
        
        <div>
          <Label>Webhook Secret</Label>
          <Input defaultValue={project.webhookSecret || ""} placeholder="Auto-generated signing secret" />
        </div>
        
        <div className="space-y-2">
          <Label>Event Types</Label>
          <div className="space-y-2">
            {["transfer.confirmed", "transfer.failed", "account.created", "payment.received"].map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <input type="checkbox" id={event} defaultChecked />
                <Label htmlFor={event} className="text-sm">{event}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Button>Save Webhook Settings</Button>
      </TabsContent>
    </Tabs>
  );
}