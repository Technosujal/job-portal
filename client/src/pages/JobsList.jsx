import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar.jsx";
import { useJobs } from "@/hooks/use-jobs.js";
import { useRecommendedJobs } from "@/hooks/use-features.js";
import { JobCard } from "@/components/JobCard.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, MapPin, Filter, Sparkles, X, ChevronDown, SlidersHorizontal, Banknote, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { useUser } from "@/hooks/use-auth.js";
import { calculateMatchScore } from "@/lib/utils.js";
import { Badge } from "@/components/ui/badge.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.jsx";
import { ProfileDialog } from "@/components/ProfileDialog.jsx";

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

export default function JobsList() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    category: "",
    minSalary: "",
    maxSalary: "",
  });

  const { data: jobs, isLoading } = useJobs({
    ...filters,
    minSalary: filters.minSalary ? Number(filters.minSalary) : undefined
  });

  const { data: backendRecommended, isLoading: recLoading } = useRecommendedJobs();

  const recommendedJobs = useMemo(() => {
    // Use backend recommendations if available (for authenticated seekers)
    if (backendRecommended && backendRecommended.length > 0) return backendRecommended;
    // Fallback: client-side scoring
    if (!jobs || !user || user.role !== "job_seeker") return [];
    return jobs
      .map((job) => ({
        ...job,
        matchScore: calculateMatchScore(user.skills, job.skills, user.title, job.title)
      }))
      .filter((job) => job.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, user, backendRecommended]);

  // Apply maxSalary filter client-side
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    if (!filters.maxSalary) return jobs;
    return jobs.filter(j => !j.salaryMax || j.salaryMax <= Number(filters.maxSalary));
  }, [jobs, filters.maxSalary]);

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      category: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const FilterPanel = ({ className = "" }) => (
    <div className={`space-y-10 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-black text-xl flex items-center gap-3 uppercase tracking-tighter">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          Filter Jobs
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary font-black h-8 px-4 bg-primary/5 hover:bg-primary/10 rounded-xl">
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Category</label>
          <Select 
            value={filters.category} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, category: val === "all" ? "" : val }))}
          >
            <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-white/20 bg-background/50 backdrop-blur-md focus:ring-4 focus:ring-primary/10 font-bold">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/20 backdrop-blur-2xl">
              <SelectItem value="all" className="font-bold">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Job Type</label>
          <Select
            value={filters.type}
            onValueChange={(val) => setFilters(prev => ({ ...prev, type: val === "all" ? "" : val }))}
          >
            <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-white/20 bg-background/50 backdrop-blur-md focus:ring-4 focus:ring-primary/10 font-bold">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/20 backdrop-blur-2xl">
              <SelectItem value="all" className="font-bold">All Types</SelectItem>
              <SelectItem value="Full-time" className="font-bold">Full-time</SelectItem>
              <SelectItem value="Part-time" className="font-bold">Part-time</SelectItem>
              <SelectItem value="Contract" className="font-bold">Contract</SelectItem>
              <SelectItem value="Internship" className="font-bold">Internship</SelectItem>
              <SelectItem value="Remote" className="font-bold">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Min. Salary</label>
          <div className="relative group">
            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:scale-110 transition-transform" />
            <Input
              type="number"
              placeholder="e.g. 50000"
              className="h-14 pl-12 rounded-2xl border-2 border-white/20 bg-background/50 backdrop-blur-md focus:ring-4 focus:ring-primary/10 font-bold placeholder:font-medium"
              value={filters.minSalary}
              onChange={(e) => setFilters(prev => ({ ...prev, minSalary: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Max. Salary</label>
          <div className="relative group">
            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent group-focus-within:scale-110 transition-transform" />
            <Input
              type="number"
              placeholder="e.g. 150000"
              className="h-14 pl-12 rounded-2xl border-2 border-white/20 bg-background/50 backdrop-blur-md focus:ring-4 focus:ring-primary/10 font-bold placeholder:font-medium"
              value={filters.maxSalary}
              onChange={(e) => setFilters(prev => ({ ...prev, maxSalary: e.target.value }))}
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider ml-1">Annual salary in USD</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Search Header */}
      <div className="relative overflow-hidden pt-36 pb-48 bg-muted/20 border-b">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9]">
                Find your <br/><span className="animated-gradient-text">next move</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium opacity-70">
                Browse {jobs?.length || 0} premium career opportunities
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {user?.role === "job_seeker" && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border-2 border-white/20 shadow-2xl h-16 p-2 rounded-[2rem]">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black px-8 rounded-[1.5rem] h-full transition-all text-sm uppercase tracking-widest">
                      All Jobs
                    </TabsTrigger>
                    <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black px-8 rounded-[1.5rem] h-full transition-all text-sm uppercase tracking-widest gap-2">
                      <Sparkles className="h-4 w-4" />
                      Matches
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden h-16 w-16 rounded-[2rem] border-2">
                    <Filter className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] rounded-l-[3rem] border-none backdrop-blur-3xl bg-white/80 dark:bg-black/80">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-3xl font-display font-black tracking-tighter">FILTERS</SheetTitle>
                  </SheetHeader>
                  <FilterPanel />
                </SheetContent>
              </Sheet>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-[1fr,1fr,auto] gap-6 p-4 bg-white/70 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] border-2 border-white/30 shadow-3xl max-w-5xl mx-auto -mb-[120px] relative z-20"
          >
            <div className="flex items-center gap-4 px-6 py-2">
              <Search className="h-6 w-6 text-primary shrink-0" />
              <Input 
                placeholder="Title, company, keywords..." 
                className="border-0 shadow-none focus-visible:ring-0 text-xl font-bold h-14 bg-transparent p-0 placeholder:font-medium placeholder:opacity-50"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-4 px-6 py-2 md:border-l-2 border-muted/30">
              <MapPin className="h-6 w-6 text-accent shrink-0" />
              <Input 
                placeholder="City or remote" 
                className="border-0 shadow-none focus-visible:ring-0 text-xl font-bold h-14 bg-transparent p-0 placeholder:font-medium placeholder:opacity-50"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="p-2">
              <Button size="lg" className="h-16 px-12 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 transition-all">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 md:px-6 pt-40 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] gap-16">
          {/* Desktop Filters Side Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block"
          >
            <div className="sticky top-32 space-y-12">
              <FilterPanel />
              
              <div className="p-8 rounded-[3rem] glass-card border-primary/20 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <Sparkles className="h-20 w-20 text-primary" />
                </div>
                <h4 className="font-black text-xl mb-3 tracking-tight">AI Matching</h4>
                <p className="text-sm text-muted-foreground font-semibold leading-relaxed mb-6 opacity-70">
                  Keep your profile updated for 100% accurate AI job recommendations.
                </p>
                {user && (
                  <ProfileDialog 
                    user={user} 
                    trigger={<Button size="lg" variant="outline" className="w-full text-sm font-black rounded-2xl border-primary/30 bg-background/50 hover:bg-primary/5">Refresh Profile</Button>}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Area */}
          <div className="min-w-0">
            {isLoading ? (
              <div className="grid gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-56 rounded-[2.5rem] border bg-card/40 backdrop-blur-sm p-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 w-2/3">
                        <Skeleton className="h-10 w-3/4 rounded-xl" />
                        <Skeleton className="h-6 w-1/2 rounded-lg" />
                      </div>
                      <Skeleton className="h-16 w-32 rounded-2xl" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-4 w-24 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "recommended" ? (
              <div className="space-y-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-6 p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-white/20 rounded-[3rem] shadow-3xl shadow-primary/5"
                >
                  <div className="h-16 w-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter">Tailored for you</h2>
                    <p className="text-muted-foreground font-semibold">We found {recommendedJobs.length} matches syncing with your expertise.</p>
                  </div>
                </motion.div>
                
                {recommendedJobs.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 glass-card rounded-[3rem] border-dashed border-4 border-muted/50"
                  >
                    <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-8">
                      <Sparkles className="h-12 w-12 text-muted-foreground opacity-30" />
                    </div>
                    <h3 className="text-3xl font-black font-display tracking-tight text-foreground/80 mb-4">
                      No matches yet
                    </h3>
                    <p className="text-muted-foreground font-semibold max-w-md mx-auto mb-10 px-6">
                      Add more skills, keywords, and a detailed profile title to trigger our AI recommendation engine.
                    </p>
                    {user && (
                      <ProfileDialog 
                        user={user} 
                        trigger={<Button size="lg" className="px-12 rounded-2xl font-black shadow-2xl shadow-primary/20">
                          Complete Profile
                        </Button>}
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="grid gap-8">
                    <AnimatePresence>
                      {recommendedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ) : filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 glass-card rounded-[3rem] border-dashed border-4 border-muted/50"
              >
                <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-8">
                  <Filter className="h-12 w-12 text-muted-foreground opacity-30" />
                </div>
                <h3 className="text-3xl font-black font-display tracking-tight text-foreground/80 mb-4">No results found</h3>
                <p className="text-muted-foreground font-semibold px-6">We couldn't find any roles matching your search criteria. Try broadening your scope.</p>
                <Button variant="ghost" onClick={resetFilters} className="mt-8 text-primary font-black text-lg bg-primary/5 px-10 rounded-2xl">Reset Search</Button>
              </motion.div>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center justify-between px-4">
                  <p className="text-lg text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-60">
                    Showing <span className="text-primary font-black text-base">{filteredJobs.length}</span> verified roles
                  </p>
                </div>
                <div className="grid gap-8">
                  <AnimatePresence>
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
