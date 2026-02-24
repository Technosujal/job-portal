import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, Sparkles, X, ChevronDown, SlidersHorizontal, Banknote, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-auth";
import { calculateMatchScore } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { type Job } from "@shared/schema";
import { ProfileDialog } from "@/components/ProfileDialog";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CATEGORIES = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Product Management",
  "Finance",
  "Human Resources",
  "Other"
];

interface JobWithScore extends Job {
  matchScore: number;
}

export default function JobsList() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    category: "",
    minSalary: ""
  });
  
  const { data: jobs, isLoading } = useJobs({
    ...filters,
    minSalary: filters.minSalary ? Number(filters.minSalary) : undefined
  });

  const recommendedJobs = useMemo(() => {
    if (!jobs || !user || user.role !== "job_seeker") return [];
    
    return (jobs as Job[])
      .map((job: Job) => ({
        ...job,
        matchScore: calculateMatchScore(user.skills, job.skills, user.title, job.title)
      }))
      .filter((job: JobWithScore) => job.matchScore > 20) // Require at least some skill or title match
      .sort((a: JobWithScore, b: JobWithScore) => b.matchScore - a.matchScore);
  }, [jobs, user]);

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      category: "",
      minSalary: ""
    });
  };

  const FilterPanel = ({ className = "" }: { className?: string }) => (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground h-8 px-2 translate-x-2">
          Reset all
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
          <Select 
            value={filters.category} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, category: val === "all" ? "" : val }))}
          >
            <SelectTrigger className="w-full bg-background border-muted-foreground/20">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Type</label>
          <Select 
            value={filters.type} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, type: val === "all" ? "" : val }))}
          >
            <SelectTrigger className="w-full bg-background border-muted-foreground/20">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min. Annual Salary</label>
          <div className="relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="number"
              placeholder="e.g. 50000"
              className="pl-9 bg-background border-muted-foreground/20"
              value={filters.minSalary}
              onChange={(e) => setFilters(prev => ({ ...prev, minSalary: e.target.value }))}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">Filter by minimum desired yearly pay</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-muted/30 border-b py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-1">Opportunities</h1>
              <p className="text-muted-foreground">Find your next career move from {jobs?.length || 0} open positions</p>
            </div>
            
            <div className="flex items-center gap-4">
              {user?.role === "job_seeker" && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="grid w-64 grid-cols-2 bg-background border shadow-sm h-11 p-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-muted data-[state=active]:shadow-none font-semibold">
                      All Listings
                    </TabsTrigger>
                    <TabsTrigger value="recommended" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-semibold gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Recommended
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="grid md:grid-cols-[1fr,1fr,auto] gap-4 p-2 bg-background rounded-2xl border shadow-lg max-w-4xl mx-auto -mb-[88px] relative z-20">
            <div className="flex items-center gap-3 px-4 py-2">
              <Search className="h-5 w-5 text-primary" />
              <Input 
                placeholder="Job title, keywords, or company..." 
                className="border-0 shadow-none focus-visible:ring-0 text-lg h-12"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2 border-l border-muted/50">
              <MapPin className="h-5 w-5 text-primary" />
              <Input 
                placeholder="City, state, or remote" 
                className="border-0 shadow-none focus-visible:ring-0 text-lg h-12"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="p-1">
              <Button size="lg" className="h-12 px-8 rounded-xl font-bold">
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-10">
          {/* Desktop Filters Side Panel */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <FilterPanel />
              
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Build your profile</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Complete your seeker profile to unlock personalized recommendations and 1-click applications.
                </p>
                {user && (
                  <ProfileDialog 
                    user={user} 
                    trigger={<Button size="sm" variant="outline" className="w-full bg-background">Update Profile</Button>}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="min-w-0">
            {isLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-44 rounded-2xl border bg-card p-6">
                    <div className="flex justify-between mb-4">
                      <div className="space-y-4 w-2/3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : activeTab === "recommended" ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-primary animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">AI Recommended for you</p>
                    <p className="text-sm opacity-90">Matched {recommendedJobs.length} positions based on your unique skill set.</p>
                  </div>
                </div>
                {recommendedJobs.length === 0 ? (
                  <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
                    <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Sparkles className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-foreground/80 mb-2">
                      {(!user?.skills || user.skills.length === 0) && !user?.title 
                        ? "Your profile is empty" 
                        : "No perfect matches yet"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {(!user?.skills || user.skills.length === 0) && !user?.title
                        ? "Add your skills and professional title to your profile so our AI can find the best opportunities for you."
                        : "Try adding more specific skills or adjusting your professional title to get better recommendations."}
                    </p>
                    {user && (
                      <ProfileDialog 
                        user={user} 
                        trigger={<Button variant="outline" className="mt-8 px-8 flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4" />
                          Update Profile
                        </Button>}
                      />
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {recommendedJobs.map((job: JobWithScore) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            ) : jobs?.length === 0 ? (
              <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
                <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Filter className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-2xl font-bold font-display text-foreground/80 mb-2">No jobs matched</h3>
                <p className="text-muted-foreground">We couldn't find any jobs matching your current filters. Try broadening your parameters.</p>
                <Button variant="ghost" onClick={resetFilters} className="mt-4 text-primary font-bold hover:bg-primary/5">Clear all filters</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Showing <span className="text-foreground font-bold">{jobs.length}</span> results
                  </p>
                </div>
                <div className="grid gap-6">
                  {jobs?.map((job: Job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
