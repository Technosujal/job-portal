import { Navbar } from "@/components/Navbar.jsx";
import { useApplications } from "@/hooks/use-applications.js";
import { useUser } from "@/hooks/use-auth.js";
import { Badge } from "@/components/ui/badge.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Calendar, Building2, MapPin, ChevronRight, Sparkles, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { StatusStepper } from "@/components/StatusStepper.jsx";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function SeekerApplications() {
  const { data: user } = useUser();
  const { data: applications, isLoading } = useApplications();

  if (user?.role !== "job_seeker") return <div>Access Denied</div>;

  const getStatusVariant = (status) => {
    switch(status) {
      case 'offered': return 'default'; 
      case 'rejected': return 'destructive';
      case 'interview': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />
      
      <div className="container px-4 md:px-6 py-24 md:py-32 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-primary">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Career Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-tight">
              My <span className="animated-gradient-text">Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground font-semibold opacity-70">
              Track your real-time application progress and next steps
            </p>
          </motion.div>
          
          <Badge variant="outline" className="px-6 py-2.5 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary text-sm font-black tracking-widest gap-3 shadow-xl shadow-primary/5">
            <Sparkles className="h-4 w-4" />
            {applications?.length || 0} APPLICATIONS
          </Badge>
        </header>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-[3rem] border-2 bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-10">
            <AnimatePresence>
              {applications?.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden rounded-[3rem] p-10 glass-card border-white/20 dark:border-white/5 shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                    <div className="flex flex-col gap-10">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                          <Link href={`/jobs/${app.job?.id}`}>
                            <h3 className="text-3xl font-display font-black tracking-tighter group-hover:text-primary transition-colors cursor-pointer flex items-center gap-4 group/title">
                              {app.job?.title}
                              <div className="p-2 rounded-xl bg-primary/5 group-hover/title:bg-primary group-hover/title:text-primary-foreground transition-all duration-300 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                                <ChevronRight className="h-5 w-5" />
                              </div>
                            </h3>
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-sm text-muted-foreground font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                              </div>
                              <span className="text-foreground tracking-tight">{app.job?.company}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <span className="tracking-tight">{app.job?.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                <Calendar className="h-5 w-5" />
                              </div>
                              <span className="tracking-tight">
                                {app.appliedAt && format(new Date(app.appliedAt), "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge variant={getStatusVariant(app.status)} className="px-8 py-3 rounded-2xl text-xs font-black tracking-[0.2em] shadow-xl">
                          {app.status}
                        </Badge>
                      </div>

                      <div className="bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-4 md:p-8 border border-white/10 shadow-inner">
                        <StatusStepper status={app.status} />
                      </div>
                      
                      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        <div className="flex items-center gap-4">
                          <span className="bg-white/5 px-4 py-2 rounded-xl">REF: {app.id.toString().padStart(6, '0')}</span>
                        </div>
                        <Link href={`/jobs/${app.job?.id}`}>
                          <button className="flex items-center gap-2 text-primary hover:text-accent font-black transition-colors group/btn">
                            Full Job Spec
                            <ChevronRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {applications?.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 glass-card rounded-[4rem] border-dashed border-4 border-muted/30"
              >
                <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8">
                  <Calendar className="h-12 w-12 text-muted-foreground opacity-30" />
                </div>
                <h3 className="font-black text-3xl mb-4 font-display tracking-tight">Destiny awaits</h3>
                <p className="text-muted-foreground font-semibold max-w-sm mx-auto mb-10 opacity-70">
                  Your application history is currently empty. Start applying to open roles and track your journey here.
                </p>
                <Link href="/jobs">
                  <button className="bg-primary text-primary-foreground px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 transition-all">
                    Explore Opportunities
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

