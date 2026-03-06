import { Button } from "@/components/ui/button.jsx";
import { Link } from "wouter";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] floating" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass-card rounded-[4rem] p-16 md:p-24 border-white/20 shadow-3xl text-center relative z-10"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-32 h-32 rounded-[2.5rem] bg-rose-500/10 flex items-center justify-center mb-12 shadow-2xl shadow-rose-500/10"
        >
          <AlertCircle className="h-16 w-16 text-rose-500" />
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter mb-6 leading-none">
          404
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-8 leading-tight">
          Page <span className="animated-gradient-text">Lost in Space</span>
        </h2>
        
        <p className="text-lg text-muted-foreground font-semibold mb-12 max-w-md mx-auto opacity-70">
          The coordinates you entered don't exist in our talent nebula. Let's get you back to safety.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/">
            <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1.5 transition-all gap-3 w-full md:w-auto">
              <Home className="h-5 w-5" />
              Portal Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="h-16 px-10 rounded-2xl font-black text-lg border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all gap-3 w-full md:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous Sector
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

