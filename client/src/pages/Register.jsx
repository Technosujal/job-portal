import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@/hooks/use-auth.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { ObjectUploader } from "@/components/ObjectUploader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, ArrowRight, Upload, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "job_seeker",
    title: "",
    resumeUrl: ""
  });
  
  const { mutate: register, isPending } = useRegister();
  const [, setLocation] = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData, {
      onSuccess: () => setLocation("/"),
    });
  };

  const handleUploadParameters = async (file) => {
    const res = await fetch("/api/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type,
      }),
    });
    const { uploadURL, objectPath } = await res.json();
    return {
      method: "PUT",
      url: uploadURL,
      headers: { "Content-Type": file.type },
      objectPath
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16 relative overflow-hidden selection:bg-primary/30">
      {/* Premium Gradient Mesh Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-[30%] left-[20%] w-[15%] h-[15%] bg-primary/20 blur-[100px] rounded-full floating" />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="glass-card border-white/40 dark:border-white/10 overflow-hidden rounded-[3rem] p-6">
          <CardHeader className="space-y-6 text-center pt-8 px-6">
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 10 }}
              className="mx-auto p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] w-fit mb-2 shadow-2xl shadow-primary/10 hover:scale-110 transition-transform"
            >
              <UserPlus className="h-10 w-10 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-display font-black tracking-tighter">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground font-semibold opacity-70">Join our community of professionals and companies</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label htmlFor="name" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium border-2"
                  />
                </motion.div>
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="space-y-3"
                >
                  <Label htmlFor="username" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Username</Label>
                  <Input
                    id="username"
                    placeholder="janedoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium border-2"
                  />
                </motion.div>
              </div>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="space-y-3"
              >
                <Label htmlFor="email" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium border-2"
                />
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="space-y-3"
              >
                <Label htmlFor="password" title="password" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium border-2"
                />
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="space-y-3"
              >
                <Label htmlFor="role" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Joining as</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-bold border-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/20 backdrop-blur-2xl">
                    <SelectItem value="job_seeker" className="rounded-xl font-bold py-3 transition-colors">Job Seeker</SelectItem>
                    <SelectItem value="recruiter" className="rounded-xl font-bold py-3 transition-colors">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <AnimatePresence mode="wait">
                {formData.role === "job_seeker" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="title" className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Engineer"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="h-14 px-6 rounded-2xl border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-md focus:ring-4 focus:ring-primary/10 transition-all font-medium border-2"
                      />
                    </motion.div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-bold ml-2 uppercase tracking-widest opacity-60">Resume (Optional)</Label>
                      <ObjectUploader
                        onGetUploadParameters={async (file) => {
                          const params = await handleUploadParameters(file);
                          setFormData(prev => ({ ...prev, resumeUrl: params.objectPath }));
                          return params;
                        }}
                        onComplete={() => console.log("Upload complete")}
                        buttonClassName="w-full h-16 rounded-2xl bg-white/5 border-dashed border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex items-center justify-center gap-3 font-bold">
                           <Upload className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                           {formData.resumeUrl ? "Change Resume" : "Upload Resume (PDF)"}
                        </div>
                      </ObjectUploader>
                      {formData.resumeUrl && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 text-sm text-emerald-500 font-black ml-2 py-2"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Resume uploaded successfully!
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button type="submit" className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1.5 active:scale-95 transition-all group mt-4 relative overflow-hidden" disabled={isPending}>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isPending ? "Connecting..." : (
                      <>
                        Create Account <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </motion.div>
            </form>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 text-center text-sm font-bold text-muted-foreground/60"
            >
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors underline decoration-2 underline-offset-8">
                Log in now
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/20 animate-bounce" style={{ animationDuration: "3s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-accent/20 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
    </div>
  );
}

