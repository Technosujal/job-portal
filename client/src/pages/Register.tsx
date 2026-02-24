import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ObjectUploader } from "@/components/ObjectUploader";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, ArrowRight, Upload, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "job_seeker" as "job_seeker" | "recruiter",
    title: "",
    resumeUrl: ""
  });
  
  const { mutate: register, isPending } = useRegister();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData, {
      onSuccess: () => setLocation("/"),
    });
  };

  const handleUploadParameters = async (file: any) => {
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
      method: "PUT" as const,
      url: uploadURL,
      headers: { "Content-Type": file.type },
      objectPath
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="glass-card border-white/20 dark:border-white/10 overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-4 text-center pt-10 px-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto p-4 bg-primary/20 rounded-2xl w-fit mb-2 shadow-xl shadow-primary/10"
            >
              <UserPlus className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-display font-extrabold tracking-tight">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Join our community of professionals and companies</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-semibold ml-1">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </motion.div>
                <motion.div 
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="space-y-2"
                >
                  <Label htmlFor="username" className="text-sm font-semibold ml-1">Username</Label>
                  <Input
                    id="username"
                    placeholder="janedoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </motion.div>
              </div>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-semibold ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="space-y-2"
              >
                <Label htmlFor="password" title="password" className="text-sm font-semibold ml-1">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="space-y-2"
              >
                <Label htmlFor="role" className="text-sm font-semibold ml-1">Joining as</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val: any) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/20 backdrop-blur-xl">
                    <SelectItem value="job_seeker" className="rounded-lg">Job Seeker</SelectItem>
                    <SelectItem value="recruiter" className="rounded-lg">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <AnimatePresence mode="wait">
                {formData.role === "job_seeker" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold ml-1">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Engineer"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="h-12 px-4 rounded-xl border-white/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Resume (Optional)</Label>
                      <ObjectUploader
                        onGetUploadParameters={async (file) => {
                          const params = await handleUploadParameters(file);
                          // @ts-ignore
                          setFormData(prev => ({ ...prev, resumeUrl: params.objectPath }));
                          return params;
                        }}
                        onComplete={() => console.log("Upload complete")}
                        buttonClassName="w-full h-12 rounded-xl bg-background/30 border-dashed border-white/30 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center justify-center gap-2">
                           <Upload className="h-4 w-4" />
                           {formData.resumeUrl ? "Change Resume" : "Upload Resume (PDF)"}
                        </div>
                      </ObjectUploader>
                      {formData.resumeUrl && (
                        <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold ml-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Resume uploaded successfully!
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all group mt-2" disabled={isPending}>
                  {isPending ? "Creating Account..." : (
                    <span className="flex items-center gap-2">
                      Get Started <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center text-sm text-muted-foreground font-medium"
            >
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold decoration-2 underline-offset-4">
                Log in
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
