import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import JobsList from "@/pages/JobsList";
import JobDetail from "@/pages/JobDetail";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import JobApplications from "@/pages/JobApplications";
import AdminDashboard from "@/pages/AdminDashboard";
import SeekerApplications from "@/pages/SeekerApplications";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen"
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/jobs" component={JobsList} />
          <Route path="/jobs/:id" component={JobDetail} />
          
          {/* Protected Roles */}
          <Route path="/recruiter/jobs" component={RecruiterDashboard} />
          <Route path="/recruiter/job/:id/applications" component={JobApplications} />
          <Route path="/seeker/applications" component={SeekerApplications} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
