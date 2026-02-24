import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { username, password },
      {
        onSuccess: () => setLocation("/"),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/20 dark:border-white/10 overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-4 text-center pt-10 px-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto p-4 bg-primary/20 rounded-2xl w-fit mb-2 shadow-xl shadow-primary/10"
            >
              <Briefcase className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-display font-extrabold tracking-tight">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Enter your credentials to access your account</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-sm font-semibold ml-1">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" title="password" className="text-sm font-semibold">Password</Label>
                  <Link href="#" className="text-xs text-primary font-bold hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all group" disabled={isPending}>
                  {isPending ? "Logging in..." : (
                    <span className="flex items-center gap-2">
                      Log In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center text-sm text-muted-foreground font-medium"
            >
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-bold decoration-2 underline-offset-4">
                Sign up
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
