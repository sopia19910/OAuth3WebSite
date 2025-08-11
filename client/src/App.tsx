import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import About from "@/pages/about";
import Technology from "@/pages/technology";
import Services from "@/pages/services";
import Resources from "@/pages/resources";
import Whitepaper from "@/pages/whitepaper";
import Contact from "@/pages/contact";
import PersonalService from "@/pages/personalservice";
import Dashboard from "@/pages/dashboard";
import DevelopersApply from "@/pages/developers-apply";
import AdminApi from "@/pages/admin-api";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/technology" component={Technology} />
      <Route path="/services" component={Services} />
      <Route path="/resources" component={Resources} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/contact" component={Contact} />
      <Route path="/personalservice" component={PersonalService} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/developers/apply" component={DevelopersApply} />
      <Route path="/admin/api" component={AdminApi} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
