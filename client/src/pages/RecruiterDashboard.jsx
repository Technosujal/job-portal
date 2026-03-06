import { useState } from "react";
import { format } from "date-fns";

import { Navbar } from "@/components/Navbar.jsx";
import { useJobs, useCreateJob, useUpdateJob } from "@/hooks/use-jobs.js";
import { useRecruiterStats } from "@/hooks/use-stats.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Plus, Pencil, Eye, Ban, TrendingUp, Users, Briefcase, PieChart as PieChartIcon, FileText } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-auth.js";
import { useApplications } from "@/hooks/use-applications.js";
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
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];


export default function RecruiterDashboard() {
  const { data: user } = useUser();
  const { data: jobs } = useJobs({ includeClosed: true, recruiterId: user?.id });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createJob(
      { ...formData, recruiterId: user.id },
      { onSuccess: () => setIsDialogOpen(false) }
    );
  };

  const handleCloseJob = (id) => {
    if (confirm("Are you sure you want to close this job listing?")) {
      updateJob({ id, status: "closed" });
    }
  };

  const myJobs = jobs?.filter((job) => job.recruiterId === user.id);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />
      
      <div className="container px-4 md:px-6 py-24 md:py-32 space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-primary">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Employer HQ</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-tight">
              Recruiter <span className="animated-gradient-text">Studio</span>
            </h1>
            <p className="text-lg text-muted-foreground font-semibold opacity-70">
              Manage your talent pipelines and optimize your job reach
            </p>
          </motion.div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1.5 transition-all gap-3 bg-primary group">
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Post New Opening
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background/80 backdrop-blur-2xl border-white/20 rounded-[3rem] p-10 overflow-y-auto max-h-[90vh]">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-black tracking-tighter">Draft Job Opening</DialogTitle>
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

                <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 mt-4">Confirm & Publish</Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="p-8 rounded-[2.5rem] glass-card border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group relative overflow-hidden">
                <div className="absolute -top-4 -right-4 bg-primary/20 h-24 w-24 rounded-full blur-3xl" />
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-inner">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest">OVERVIEW</Badge>
                </div>
                <div className="text-5xl font-black tracking-tighter mb-2">{stats.totalJobs}</div>
                <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                  Total Listings <span className="text-primary ml-2">{stats.activeListings} Active</span>
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="p-8 rounded-[2.5rem] glass-card border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group relative overflow-hidden">
                <div className="absolute -top-4 -right-4 bg-emerald-500/20 h-24 w-24 rounded-full blur-3xl" />
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 shadow-inner">
                    <Users className="h-6 w-6" />
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] tracking-widest">NETWORK</Badge>
                </div>
                <div className="text-5xl font-black tracking-tighter mb-2">{stats.totalApplications}</div>
                <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                  Applicants Found <span className="text-emerald-500 ml-2">Growing</span>
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="p-8 rounded-[2.5rem] glass-card border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors group relative overflow-hidden">
                <div className="absolute -top-4 -right-4 bg-blue-500/20 h-24 w-24 rounded-full blur-3xl" />
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500 shadow-inner">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-500 border-none font-black text-[10px] tracking-widest">VELOCITY</Badge>
                </div>
                <div className="text-5xl font-black tracking-tighter mb-2">
                  {stats.totalJobs > 0 ? (stats.totalApplications / stats.totalJobs).toFixed(1) : 0}
                </div>
                <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                  Avg Applicants <span className="text-blue-500 ml-2">Per Post</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}


        <Tabs defaultValue="listings" className="space-y-12">
          <TabsList className="bg-muted/10 backdrop-blur-3xl p-2 rounded-[2rem] border-2 border-white/10 w-fit mx-auto md:mx-0">
            <TabsTrigger value="listings" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg active:scale-95 transition-all">Listings</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg active:scale-95 transition-all">Candidates</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg active:scale-95 transition-all">Analytics</TabsTrigger>
          </TabsList>


          <TabsContent value="listings">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border-2 border-white/20 bg-white/5 backdrop-blur-2xl shadow-3xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 border-b-2 border-white/10 hover:bg-white/10">
                    <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Position</TableHead>
                    <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</TableHead>
                    <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Applications</TableHead>
                    <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myJobs?.map((job) => (
                    <TableRow key={job.id} className="border-b border-white/5 hover:bg-primary/5 transition-all duration-300 group">
                      <TableCell className="py-8 px-10">
                        <div className="font-display font-black text-xl tracking-tight group-hover:text-primary transition-colors">{job.title}</div>
                        <div className="text-xs font-bold text-muted-foreground/60 mt-1 uppercase tracking-widest">
                          Posted on {job.postedAt && format(new Date(job.postedAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={job.status === 'open' ? 'default' : 'outline'} className="shadow-lg">
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/recruiter/job/${job.id}/applications`}>
                          <Button variant="outline" className="h-12 px-6 rounded-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs font-black uppercase tracking-widest gap-2">
                            <Users className="h-4 w-4" />
                            {stats?.topJobs.find(tj => tj.title === job.title)?.count || 0} APPLICANTS
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="py-8 px-10 text-right space-x-2">
                        <Button size="icon" variant="ghost" asChild className="h-12 w-12 rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-all shadow-xl">
                          <Link href={`/jobs/${job.id}`}>
                            <Eye className="h-5 w-5" />
                          </Link>
                        </Button>
                        {job.status === 'open' && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleCloseJob(job.id)}
                            className="h-12 w-12 rounded-xl bg-white/5 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                          >
                            <Ban className="h-5 w-5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!myJobs || myJobs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-32 text-muted-foreground h-40">
                        <div className="flex flex-col items-center gap-6">
                          <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
                            <Briefcase className="h-10 w-10 opacity-30" />
                          </div>
                          <p className="text-xl font-black font-display tracking-tight">No active listings yet</p>
                          <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="rounded-2xl font-black">Publish first job</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </motion.div>
          </TabsContent>


          <TabsContent value="applications">
            <RecruiterApplications recruiterId={user.id} />
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

function RecruiterApplications({ recruiterId }) {
  const { data: applications, isLoading } = useApplications();
  
  if (isLoading) return <div className="p-32 text-center text-muted-foreground font-black uppercase tracking-widest text-xs opacity-50 animate-pulse">Scanning Applications...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border-2 border-white/20 bg-white/5 backdrop-blur-2xl shadow-3xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/10 border-b-2 border-white/10 hover:bg-white/10">
            <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Candidate</TableHead>
            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Role</TableHead>
            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</TableHead>
            <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((app) => (
            <TableRow key={app.id} className="border-b border-white/5 hover:bg-primary/5 transition-all duration-300 group">
              <TableCell className="py-8 px-10">
                <div className="font-display font-black text-xl tracking-tight group-hover:text-primary transition-colors">{app.candidate?.name}</div>
                <div className="text-xs font-bold text-muted-foreground/60 mt-1 lowercase tracking-widest">{app.candidate?.email}</div>
              </TableCell>
              <TableCell>
                <div className="font-black text-xs uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-xl w-fit">
                  {app.job?.title}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="shadow-lg">
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell className="py-8 px-10 text-right">
                <Link href={`/recruiter/job/${app.jobId}/applications`}>
                  <Button className="h-12 px-8 rounded-2xl font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <FileText className="h-4 w-4" />
                    Review Profile
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {(!applications || applications.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-32 text-muted-foreground h-40">
                <div className="flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
                    <Users className="h-10 w-10 opacity-30" />
                  </div>
                  <p className="text-xl font-black font-display tracking-tight">No incoming talent yet</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}

