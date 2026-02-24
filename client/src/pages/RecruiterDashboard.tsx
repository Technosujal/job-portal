import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useJobs, useCreateJob, useUpdateJob } from "@/hooks/use-jobs";
import { useRecruiterStats } from "@/hooks/use-stats";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Eye, Ban, TrendingUp, Users, Briefcase, PieChart as PieChartIcon } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-auth";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function RecruiterDashboard() {
  const { data: user } = useUser();
  const { data: jobs } = useJobs();
  const { data: stats } = useRecruiterStats();
  const { mutate: createJob } = useCreateJob();
  const { mutate: updateJob } = useUpdateJob();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    salaryMin: 0,
    salaryMax: 0,
    location: "",
    type: "Full-time",
    category: "Software Development"
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

  const myJobs = jobs?.filter(job => job.recruiterId === user.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Monitor your listings and candidate pipelines</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
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
                    <label className="text-sm font-medium">Job Category</label>
                    <Input 
                      required 
                      placeholder="e.g. Software Development"
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary (Min)</label>
                    <Input 
                      type="number" 
                      required 
                      value={formData.salaryMin} 
                      onChange={e => setFormData({...formData, salaryMin: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary (Max)</label>
                    <Input 
                      type="number" 
                      required 
                      value={formData.salaryMax} 
                      onChange={e => setFormData({...formData, salaryMax: parseInt(e.target.value)})}
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

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <Briefcase className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">{stats.activeListings} currently active</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">Across all job postings</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalJobs > 0 ? (stats.totalApplications / stats.totalJobs).toFixed(1) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Avg. applicants per job</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="listings">Active Listings</TabsTrigger>
            <TabsTrigger value="insights">Visual Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Job Title</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myJobs?.map(job => (
                    <TableRow key={job.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-semibold">{job.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {job.postedAt && new Date(job.postedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className="capitalize">
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/recruiter/job/${job.id}/applications`}>
                          <Button variant="outline" size="sm" className="h-8">
                            View {stats?.topJobs.find(tj => tj.title === job.title)?.count || 0} Applicants
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                          <Link href={`/jobs/${job.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {job.status === 'open' && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleCloseJob(job.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!myJobs || myJobs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground h-40">
                        <div className="flex flex-col items-center gap-2">
                          <Briefcase className="h-8 w-8 opacity-20" />
                          <p>No jobs posted yet. Start by creating your first listing!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Application Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {stats?.statusDistribution && stats.statusDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.statusDistribution}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="status"
                        >
                          {stats.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      No application data to display
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Top Performing Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {stats?.topJobs && stats.topJobs.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.topJobs} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="title" 
                          type="category" 
                          width={150} 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip />
                        <Bar 
                          dataKey="count" 
                          fill="#3b82f6" 
                          radius={[0, 4, 4, 0]}
                          name="Applications"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      No job data to display
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
