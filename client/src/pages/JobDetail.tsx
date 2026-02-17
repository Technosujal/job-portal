import { useRoute, Link } from "wouter";
import { useJob } from "@/hooks/use-jobs";
import { useUser } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, MapPin, Banknote, Calendar, Globe } from "lucide-react";
import { format } from "date-fns";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const id = parseInt(params?.id || "0");
  const { data: job, isLoading } = useJob(id);
  const { data: user } = useUser();

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
      <div className="bg-muted/30 border-b py-8">
        <div className="container px-4 md:px-6">
          <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <Badge variant="secondary">{job.type}</Badge>
                {job.status === 'closed' && <Badge variant="destructive">Closed</Badge>}
              </div>
            </div>

            {user?.role === 'job_seeker' && job.status === 'open' && (
              <ApplicationDialog jobId={job.id} jobTitle={job.title} />
            )}
            {!user && (
              <Link href="/login">
                <Button size="lg">Log in to Apply</Button>
              </Link>
            )}
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
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg">Job Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salary</p>
                  <p className="font-semibold">${job.salary.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posted Date</p>
                  <p className="font-semibold">
                    {job.postedAt && format(new Date(job.postedAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location Type</p>
                  <p className="font-semibold">{job.location.toLowerCase().includes('remote') ? 'Remote' : 'On-site'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
