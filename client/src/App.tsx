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
import Demo from "@/pages/demo";
import Dashboard from "@/pages/dashboard";
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
      <Route path="/demo" component={Demo} />
      <Route path="/dashboard" component={Dashboard} />
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
