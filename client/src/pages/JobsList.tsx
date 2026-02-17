import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsList() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: ""
  });
  
  const { data: jobs, isLoading } = useJobs(filters);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-muted/30 border-b py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-display font-bold mb-6">Browse Jobs</h1>
          
          <div className="grid md:grid-cols-[1fr,1fr,auto] gap-4 p-4 bg-background rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 px-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Job title or keywords..." 
                className="border-0 shadow-none focus-visible:ring-0"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2 px-2 border-l">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="City, state, or remote" 
                className="border-0 shadow-none focus-visible:ring-0"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <Select 
              value={filters.type} 
              onValueChange={(val) => setFilters(prev => ({ ...prev, type: val === "all" ? "" : val }))}
            >
              <SelectTrigger className="w-[180px] border-0 bg-secondary/50">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container px-4 md:px-6 mt-8">
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-xl border bg-card p-6">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs?.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
