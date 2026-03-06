import { Navbar } from "@/components/Navbar.jsx";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-auth.js";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Users, Briefcase, FileText, Shield, PieChart, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";
import { format } from "date-fns";


export default function AdminDashboard() {
  const { data: user } = useUser();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    },
  });


  if (user?.role !== "admin") return <div>Access Denied</div>;

  const chartData = [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Jobs', value: stats?.totalJobs || 0 },
    { name: 'Applications', value: stats?.totalApplications || 0 },
  ];

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
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Command Center</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-tight">
              Control <span className="animated-gradient-text">Panel</span>
            </h1>
            <p className="text-lg text-muted-foreground font-semibold opacity-70">
              Platform-wide health and distribution metrics
            </p>
          </motion.div>
          
          <Badge variant="outline" className="px-6 py-2.5 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary text-sm font-black tracking-widest gap-3 shadow-xl shadow-primary/5">
            <Activity className="h-4 w-4 animate-pulse" />
            LIVE SYSTEM DATA
          </Badge>
        </header>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="p-10 rounded-[2.5rem] glass-card border-white/10 bg-white/5 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="h-20 w-20" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-8">Registered Users</h3>
               <div className="text-6xl font-black tracking-tighter mb-2 font-display">{stats?.totalUsers || 0}</div>
               <p className="text-xs font-bold text-primary uppercase tracking-widest">Active Accounts</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="p-10 rounded-[2.5rem] glass-card border-white/10 bg-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="h-20 w-20" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-8">Market Listings</h3>
               <div className="text-6xl font-black tracking-tighter mb-2 font-display">{stats?.activeJobs || 0}</div>
               <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live Openings</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="p-10 rounded-[2.5rem] glass-card border-white/10 bg-white/5 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="h-20 w-20" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-8">System Traffic</h3>
               <div className="text-6xl font-black tracking-tighter mb-2 font-display">{stats?.totalApplications || 0}</div>
               <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Applications Sent</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-[3rem] border-2 border-white/20 bg-white/5 backdrop-blur-3xl p-12 shadow-3xl"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <PieChart className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-display font-black tracking-tighter">Volume Analytics</h3>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Cross-Entity Distribution</p>
            </div>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700 }}
                  dx={-20}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 16 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(20px)',
                    padding: '20px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 900, fontSize: '14px' }}
                />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[16, 16, 4, 4]} barSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

