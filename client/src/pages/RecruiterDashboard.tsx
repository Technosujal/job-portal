import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useJobs, useCreateJob, useUpdateJob } from "@/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Eye, Ban } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-auth";

export default function RecruiterDashboard() {
  const { data: user } = useUser();
  const { data: jobs } = useJobs(); // In real app, filter by recruiterId on backend
  const { mutate: createJob } = useCreateJob();
  const { mutate: updateJob } = useUpdateJob();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    salary: 0,
    location: "",
    type: "Full-time"
  });

  if (user?.role !== "recruiter") return <div>Access Denied</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob(
      { ...formData, recruiterId: user.id },
      { onSuccess: () => setIsDialogOpen(false) }
    );
  };

  const handleCloseJob = (id: number) => {
    if (confirm("Are you sure you want to close this job listing?")) {
      updateJob({ id, status: "closed" });
    }
  };

  // Filter jobs created by this recruiter (client-side for now, ideally backend filtered)
  const myJobs = jobs?.filter(job => job.recruiterId === user.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Manage Jobs</h1>
            <p className="text-muted-foreground">Track listings and view applications</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Job Listing</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input 
                      required 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input 
                      required 
                      value={formData.company} 
                      onChange={e => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      required 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary (Annual)</label>
                    <Input 
                      type="number" 
                      required 
                      value={formData.salary} 
                      onChange={e => setFormData({...formData, salary: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    required 
                    className="h-32"
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements</label>
                  <Textarea 
                    required 
                    className="h-32"
                    value={formData.requirements} 
                    onChange={e => setFormData({...formData, requirements: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full">Create Job</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myJobs?.map(job => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    {job.postedAt && new Date(job.postedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/recruiter/job/${job.id}/applications`}>
                      <Button variant="link" size="sm">View Applicants</Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/jobs/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {job.status === 'open' && (
                      <Button size="icon" variant="ghost" onClick={() => handleCloseJob(job.id)}>
                        <Ban className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!myJobs || myJobs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No jobs posted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
