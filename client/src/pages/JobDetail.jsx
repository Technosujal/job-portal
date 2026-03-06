import { useRoute, Link } from "wouter";
import { useJob } from "@/hooks/use-jobs.js";
import { useUser } from "@/hooks/use-auth.js";
import { useApplications } from "@/hooks/use-applications.js";
import { Navbar } from "@/components/Navbar.jsx";
import { ApplicationDialog } from "@/components/ApplicationDialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Banknote, 
  Calendar, 
  Globe, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient.js";
import { motion, AnimatePresence } from "framer-motion";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const id = params?.id; // Removed || "0" to support string ObjectIds
  const { data: job, isLoading } = useJob(id);
  const { data: user } = useUser();
  const { data: applications } = useApplications();
  
  const [scoreResult, setScoreResult] = useState(null);

  const scoringMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/jobs/${id}/score-cv`);
      return res.json();
    },
    onSuccess: (data) => {
      setScoreResult(data);
    }
  });

  const application = applications?.find((a) => (a.jobId || a.job?.id) === id);
  const isApplied = !!application;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 space-y-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16 w-3/4" />
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="col-span-2 h-96" />
            <Skeleton className="col-span-1 h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Header */}
      <div className="relative overflow-hidden pt-36 pb-24 bg-muted/20 border-b">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 blur-[100px] rounded-full" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <Link href="/jobs" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-10 transition-colors group">
            <div className="mr-3 p-2 rounded-xl bg-background border shadow-sm group-hover:scale-110 transition-transform">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Discovery
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight max-w-3xl">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-3 font-bold text-foreground/80">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-lg">{job.company}</span>
                </div>
                <div className="flex items-center gap-3 font-bold opacity-70">
                  <div className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-lg">{job.location}</span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-sm font-black px-4 py-1 rounded-full uppercase tracking-tighter">
                  {job.type}
                </Badge>
                {job.status === 'closed' && (
                  <Badge variant="destructive" className="border-none text-sm font-black px-4 py-1 rounded-full uppercase tracking-tighter">
                    Closed
                  </Badge>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0"
            >
              {user?.role === 'job_seeker' && job.status === 'open' && (
                isApplied ? (
                  <div className="flex flex-col items-end gap-4">
                    <Badge className="px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 shadow-xl" variant="secondary">
                      Applied: {application.status}
                    </Badge>
                    <Link href="/seeker/applications">
                      <Button variant="ghost" className="text-primary font-black hover:bg-primary/5 rounded-xl">
                        View Application Status
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <ApplicationDialog jobId={job.id} jobTitle={job.title} />
                )
              )}
              {!user && (
                <Link href="/login">
                  <Button size="lg" className="h-16 px-12 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20">
                    Log in to Apply
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12 grid md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
              {job.description}
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
              {job.requirements}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] p-10 glass-card border-white/20 shadow-2xl space-y-8"
          >
            <h3 className="font-black text-2xl tracking-tighter uppercase">Overview</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Annual Salary</p>
                  <p className="text-xl font-black text-foreground">
                    {job.salaryMin && job.salaryMax ? (
                      <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                    ) : job.salaryMin || job.salaryMax ? (
                      <span>${(job.salaryMin || job.salaryMax)?.toLocaleString()}</span>
                    ) : (
                      <span className="opacity-40 font-bold">Not specified</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-2xl bg-accent/10 text-accent border border-accent/20 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Posted Date</p>
                  <p className="text-xl font-black text-foreground">
                    {job.postedAt && format(new Date(job.postedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Work Type</p>
                  <p className="text-xl font-black text-foreground">{job.location.toLowerCase().includes('remote') ? 'Fully Remote' : 'On-site Location'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI CV Scorer Card */}
          {user?.role === 'job_seeker' && job.status === 'open' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[1.5rem] p-6 shadow-xl border-primary/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>

              <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                AI CV Scorer
              </h3>
              
              <AnimatePresence mode="wait">
                {!scoreResult ? (
                  <motion.div
                    key="trigger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-muted-foreground">
                      Check how well your profile matches this job description using our AI-powered analyzer.
                    </p>
                    <Button 
                      className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                      onClick={() => scoringMutation.mutate()}
                      disabled={scoringMutation.isPending}
                    >
                      {scoringMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Profile...
                        </>
                      ) : (
                        "Score My Profile"
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Match Score</div>
                      <div className={`text-3xl font-display font-black ${
                        scoreResult.score >= 80 ? 'text-emerald-500' : 
                        scoreResult.score >= 50 ? 'text-amber-500' : 
                        'text-rose-500'
                      }`}>
                        {scoreResult.score}%
                      </div>
                    </div>

                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${scoreResult.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${
                          scoreResult.score >= 80 ? 'bg-emerald-500' : 
                          scoreResult.score >= 50 ? 'bg-amber-500' : 
                          'bg-rose-500'
                        }`}
                      />
                    </div>

                    <p className="text-sm font-medium leading-relaxed italic text-muted-foreground/80">
                      "{scoreResult.summary}"
                    </p>

                    <div className="space-y-4">
                      {scoreResult.matchingSkills.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            KEY MATCHES
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {scoreResult.matchingSkills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {scoreResult.missingSkills.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold flex items-center gap-1.5 text-rose-500">
                            <AlertCircle className="h-3.5 w-3.5" />
                            MISSING SKILLS
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {scoreResult.missingSkills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-rose-500/10 text-rose-500 border-none">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="text-xs font-bold flex items-center gap-1.5 text-primary mb-2">
                          <Lightbulb className="h-3.5 w-3.5" />
                          AI SUGGESTIONS
                        </div>
                        <ul className="text-xs space-y-1.5 text-muted-foreground font-medium">
                          {scoreResult.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full rounded-lg text-xs"
                      onClick={() => setScoreResult(null)}
                    >
                      Re-scan Profile
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
