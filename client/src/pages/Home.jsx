import { Link } from "wouter";
import { Button } from "@/components/ui/button.jsx";
import { useUser } from "@/hooks/use-auth.js";
import { Navbar } from "@/components/Navbar.jsx";
import { Briefcase, Search, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: user } = useUser();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-accent/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-primary/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="container px-4 md:px-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center space-y-12"
          >
            <motion.div variants={item} className="space-y-6 max-w-4xl">
              <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-foreground leading-[0.95] md:leading-[1]">
                Find your dream job <br/>
                <span className="animated-gradient-text drop-shadow-sm">build your future</span>
              </h1>
              <p className="mx-auto max-w-[750px] text-muted-foreground md:text-2xl font-medium leading-relaxed opacity-80">
                Connect with top companies and startups. Whether you're a developer, designer, or marketer, your next opportunity awaits.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-6">
              <Link href="/jobs">
                <Button size="lg" className="h-16 px-12 text-xl font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1.5 transition-all rounded-2xl group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Search className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Browse Jobs
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </Link>
              {!user && (
                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold rounded-2xl backdrop-blur-md bg-white/10 dark:bg-white/5 border-primary/20 hover:border-primary/50 transition-all hover:bg-primary/5 hover:-translate-y-1">
                    Create Profile
                  </Button>
                </Link>
              )}
            </motion.div>
            
            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 w-full max-w-6xl">
              {[
                { icon: Briefcase, label: "Active Jobs", value: "5,000+", delay: 0 },
                { icon: Users, label: "Companies", value: "10k+", delay: 0.1 },
                { icon: Globe, label: "Countries", value: "120+", delay: 0.2 }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -15, transition: { duration: 0.2 } }}
                  className="flex flex-col items-center p-10 rounded-[3rem] glass-card group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                  <div className="p-5 rounded-2xl bg-primary/10 text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 floating" style={{ animationDelay: `${stat.delay}s` }}>
                    <stat.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-4xl font-black mb-2 tracking-tighter">{stat.value}</h3>
                  <p className="text-muted-foreground font-semibold uppercase tracking-widest text-xs opacity-70">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 -skew-y-3 origin-right scale-110" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-black leading-tight">Empowering your <br/><span className="text-primary italic">career journey</span></h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Create a profile that stands out. Upload your resume, showcase your skills, and apply to jobs with a single click.
                </p>
              </div>
              <ul className="space-y-5">
                {[
                  "One-click applications for speed",
                  "Track application status in real-time",
                  "Direct messaging with top recruiters"
                ].map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="rounded-xl px-10 h-14 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Start Your Search
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative h-[550px] rounded-[3rem] bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/40 overflow-hidden shadow-3xl shadow-primary/10 group"
            >
               <img 
                 src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1000&q=80" 
                 alt="Person working on laptop"
                 className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative h-full flex flex-col justify-end p-12 text-white"
               >
                 <div className="glass-card backdrop-blur-xl p-8 rounded-[2rem] border-white/20">
                   <div className="flex items-center gap-6 mb-6">
                     <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                       JD
                     </div>
                     <div>
                       <h4 className="text-2xl font-bold">John Doe</h4>
                       <p className="text-white/70 font-medium">Senior Developer</p>
                     </div>
                   </div>
                   <p className="italic text-lg text-white/90">"Career Connect helped me land my dream role at TechCorp in less than 2 weeks!"</p>
                 </div>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

