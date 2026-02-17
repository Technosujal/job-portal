import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useJob } from "@/hooks/use-jobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, User } from "lucide-react";

export default function JobApplications() {
  const [, params] = useRoute("/recruiter/job/:id/applications");
  const jobId = parseInt(params?.id || "0");
  const { data: job } = useJob(jobId);
  const { data: applications, isLoading } = useApplications(jobId);
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Applications</h1>
          <p className="text-muted-foreground">For position: {job?.title}</p>
        </div>

        <div className="grid gap-6">
          {applications?.map(app => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{app.candidate?.name}</CardTitle>
                      <CardDescription>{app.candidate?.title}</CardDescription>
                    </div>
                  </div>
                  
                  <Select 
                    defaultValue={app.status}
                    onValueChange={(val: any) => updateStatus({ id: app.id, status: val })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Cover Letter</h4>
                  <p className="text-sm bg-muted/30 p-4 rounded-lg">{app.coverLetter}</p>
                </div>
                
                {app.candidate?.resumeUrl && (
                  <div>
                    <a 
                      href={`/objects/${app.candidate.resumeUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume
                    </a>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Badge variant="outline">Email: {app.candidate?.email}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {applications?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No applications received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
