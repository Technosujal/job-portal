import { Navbar } from "@/components/Navbar";
import { useApplications } from "@/hooks/use-applications";
import { useUser } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";

export default function SeekerApplications() {
  const { data: user } = useUser();
  const { data: applications, isLoading } = useApplications();

  if (user?.role !== "job_seeker") return <div>Access Denied</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'offered': return 'bg-green-500 hover:bg-green-600';
      case 'rejected': return 'bg-red-500 hover:bg-red-600';
      case 'interview': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-6">
            {applications?.map(app => (
              <Card key={app.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row border-l-4 border-l-primary">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl mb-1">{app.job?.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {app.job?.company}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(app.status)} capitalize`}>
                        {app.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                      <Calendar className="h-4 w-4" />
                      Applied on {app.appliedAt && format(new Date(app.appliedAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {applications?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
                <p>Start applying to jobs to track them here!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
