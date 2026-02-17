import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Briefcase, Search, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: user } = useUser();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container px-4 md:px-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center space-y-8"
          >
            <motion.div variants={item} className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-foreground bg-clip-text">
                Find your dream job <br/>
                <span className="text-primary">build your future</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Connect with top companies and startups. Whether you're a developer, designer, or marketer, your next opportunity awaits.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Button>
              </Link>
              {!user && (
                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                    Create Profile
                  </Button>
                </Link>
              )}
            </motion.div>
            
            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
              <div className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">5,000+</h3>
                <p className="text-muted-foreground">Active Jobs</p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">10k+</h3>
                <p className="text-muted-foreground">Companies</p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">120+</h3>
                <p className="text-muted-foreground">Countries</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">For Job Seekers</h2>
              <p className="text-lg text-muted-foreground">
                Create a profile that stands out. Upload your resume, showcase your skills, and apply to jobs with a single click.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>One-click applications</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Track application status</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Direct messaging with recruiters</span>
                </li>
              </ul>
              <Link href="/register">
                <Button>Start Your Search</Button>
              </Link>
            </div>
            
            <div className="relative h-[400px] rounded-2xl bg-gradient-to-br from-primary/20 to-secondary overflow-hidden flex items-center justify-center">
               {/* stock image of office worker smiling at laptop */}
               <img 
                 src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80" 
                 alt="Person working on laptop"
                 className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
               />
               <div className="relative z-10 bg-background/90 backdrop-blur p-6 rounded-xl shadow-xl max-w-sm mx-4">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                     JD
                   </div>
                   <div>
                     <h4 className="font-bold">John Doe</h4>
                     <p className="text-sm text-muted-foreground">Senior Developer</p>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="h-2 bg-muted rounded w-3/4" />
                   <div className="h-2 bg-muted rounded w-1/2" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
