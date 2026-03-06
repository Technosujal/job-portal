import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin } from "@/hooks/use-auth.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();
  const [, setLocation] = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(
      { username, password },
      {
        onSuccess: () => setLocation("/"),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden selection:bg-primary/30">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-primary/20 blur-[100px] rounded-full floating" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-white/40 dark:border-white/10 overflow-hidden rounded-[3rem] p-4">
          <CardHeader className="space-y-6 text-center pt-8 px-6">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
              className="mx-auto p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] w-fit mb-2 shadow-2xl shadow-primary/10 transition-transform hover:scale-110 hover:rotate-3 cursor-default"
            >
              <Briefcase className="h-10 w-10 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-display font-black tracking-tighter text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground font-semibold opacity-70">Enter your credentials to access your account</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label htmlFor="username" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/50 border-2"
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between ml-2">
                    <Label htmlFor="password" title="password" className="text-sm font-bold uppercase tracking-widest opacity-60">Password</Label>
                    <Link href="#" className="text-xs text-primary font-black hover:opacity-80 transition-opacity">
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/50 border-2"
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all group overflow-hidden relative" disabled={isPending}>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isPending ? "Connecting..." : (
                      <>
                        Sign In <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </motion.div>
            </form>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 text-center text-sm font-bold text-muted-foreground/60"
            >
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 transition-colors underline decoration-2 underline-offset-8">
                Sign up now
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Foreground decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-primary/20 animate-bounce" style={{ animationDuration: "3s" }} />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-accent/20 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
    </div>
  );
}

