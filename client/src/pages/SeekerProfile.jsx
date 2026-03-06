import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar.jsx";
import { useUser, useUpdateProfile } from "@/hooks/use-auth.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
  User,
  Mail,
  Briefcase,
  Code2,
  FileText,
  Edit3,
  Save,
  X,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  BookOpen,
  Link as LinkIcon,
  Upload,
  Loader2,
  MapPin,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function SeekerProfile() {
  const { data: user } = useUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    title: "",
    skills: [],
    experience: "",
    resumeUrl: "",
    avatarUrl: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        title: user.title || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        experience: user.experience || "",
        resumeUrl: user.resumeUrl || "",
        avatarUrl: user.avatarUrl || "",
        location: user.location || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
      });
    }
  }, [user]);

  if (!user || user.role !== "job_seeker") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      title: user.title || "",
      skills: Array.isArray(user.skills) ? user.skills : [],
      experience: user.experience || "",
      resumeUrl: user.resumeUrl || "",
      avatarUrl: user.avatarUrl || "",
      location: user.location || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      portfolio: user.portfolio || "",
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };
 
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await response.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      setFormData(prev => ({ ...prev, resumeUrl: objectPath }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await response.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      setFormData(prev => ({ ...prev, avatarUrl: objectPath }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const completionScore = (() => {
    let filled = 0;
    const total = 6;
    if (formData.name) filled++;
    if (formData.email) filled++;
    if (formData.title) filled++;
    if (formData.bio) filled++;
    if (formData.skills.length > 0) filled++;
    if (formData.resumeUrl) filled++;
    if (formData.avatarUrl) filled++;
    return Math.round((filled / total) * 100);
  })();

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />

      <div className="container px-4 md:px-6 py-24 md:py-32 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">
                Your Identity
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-tight">
              My <span className="animated-gradient-text">Profile</span>
            </h1>
            <p className="text-lg text-muted-foreground font-semibold opacity-70">
              Your professional identity, visible to recruiters when you apply
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Completion Badge */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                Profile Strength
              </span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      completionScore >= 80
                        ? "bg-emerald-500"
                        : completionScore >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-black ${
                    completionScore >= 80
                      ? "text-emerald-500"
                      : completionScore >= 50
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}
                >
                  {completionScore}%
                </span>
              </div>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="h-12 px-6 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="h-12 px-5 rounded-2xl font-black flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="h-12 px-5 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT: Identity Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 space-y-6"
          >
            {/* Avatar + Name Card */}
            <Card className="glass-card rounded-[3rem] border-white/20 overflow-hidden shadow-2xl">
              <div className="h-24 bg-gradient-to-br from-primary/30 via-accent/20 to-purple-500/20" />
              <CardContent className="pt-0 px-8 pb-8">
                <div className="-mt-12 mb-6">
                  <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-primary/30 border-4 border-background overflow-hidden">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl.startsWith("http") ? formData.avatarUrl : `/objects/${formData.avatarUrl}`} alt={formData.name} className="h-full w-full object-cover" />
                    ) : (
                      (formData.name || user.username || "?")[0].toUpperCase()
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                       <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploading}
                        />
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors">
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                        Full Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                        Headline
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g. Senior Frontend Developer"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                        Location
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g. San Francisco, CA"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                        Profile Photo URL
                      </label>
                      <Input
                        value={formData.avatarUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, avatarUrl: e.target.value })
                        }
                        placeholder="Link to your photo..."
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-black tracking-tighter">
                      {formData.name || (
                        <span className="text-muted-foreground/40 font-bold text-base italic">
                          No name set
                        </span>
                      )}
                    </h2>
                    {formData.title && (
                      <p className="text-sm font-bold text-primary uppercase tracking-widest">
                        {formData.title}
                      </p>
                    )}
                    {formData.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {formData.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                      <User className="h-3.5 w-3.5" />
                      <span>@{user.username}</span>
                    </div>
                    {formData.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {formData.location}
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      {formData.linkedin && (
                        <a href={formData.linkedin.startsWith("http") ? formData.linkedin : `https://${formData.linkedin}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {formData.github && (
                        <a href={formData.github.startsWith("http") ? formData.github : `https://${formData.github}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {formData.portfolio && (
                        <a href={formData.portfolio.startsWith("http") ? formData.portfolio : `https://${formData.portfolio}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume Card */}
            <Card className="glass-card rounded-[2.5rem] border-white/20 shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Resume</h3>
              </div>
              {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                    <Input
                      value={formData.resumeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, resumeUrl: e.target.value })
                      }
                      placeholder="Paste resume URL or path..."
                      className="rounded-xl h-11 text-sm flex-1"
                    />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isUploading}
                        className="h-11 px-4 rounded-xl font-bold flex items-center gap-2"
                        asChild
                      >
                        <div>
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </div>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground/60">
                    Upload your resume (PDF/DOC) or paste a link (Google Drive, Dropbox, etc.)
                  </p>
                  </div>
              ) : formData.resumeUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    Resume on file
                  </div>
                  <a
                    href={formData.resumeUrl.startsWith("http") || formData.resumeUrl.startsWith("/objects/") ? formData.resumeUrl : `/objects/${formData.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl flex items-center gap-2 font-bold"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      View Resume
                    </Button>
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/60 italic">
                  No resume uploaded yet. Edit your profile to add one.
                </p>
              )}
            </Card>
          </motion.div>

          {/* RIGHT: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-8"
          >
            {/* About */}
            <Card className="glass-card rounded-[3rem] border-white/20 shadow-2xl p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tighter">
                    About Me
                  </h3>
                  <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">
                    Your professional story
                  </p>
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell recruiters who you are, what you're passionate about, and what you're looking for..."
                  className="h-36 rounded-2xl text-sm leading-relaxed resize-none"
                />
              ) : (
                <p className="text-foreground/80 leading-relaxed font-medium text-base">
                  {formData.bio || (
                    <span className="text-muted-foreground/40 italic">
                      No bio added yet. Click "Edit Profile" to introduce
                      yourself to recruiters.
                    </span>
                  )}
                </p>
              )}
            </Card>

            {/* Social Links (Edit Mode) */}
            {isEditing && (
              <Card className="glass-card rounded-[3rem] border-white/20 shadow-2xl p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tighter">
                      Social & Portfolio
                    </h3>
                    <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">
                      Your online presence
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                      LinkedIn URL
                    </label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      placeholder="linkedin.com/in/username"
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                      GitHub URL
                    </label>
                    <Input
                      value={formData.github}
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                      placeholder="github.com/username"
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                      Portfolio / Website URL
                    </label>
                    <Input
                      value={formData.portfolio}
                      onChange={(e) =>
                        setFormData({ ...formData, portfolio: e.target.value })
                      }
                      placeholder="https://yourportfolio.com"
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Skills */}
            <Card className="glass-card rounded-[3rem] border-white/20 shadow-2xl p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tighter">
                    Skills & Technologies
                  </h3>
                  <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">
                    What you bring to the table
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {formData.skills.length > 0 ? (
                  <motion.div className="flex flex-wrap gap-3 mb-6">
                    {formData.skills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="secondary"
                          className="px-4 py-2 rounded-2xl font-bold text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors group/skill"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 opacity-50 hover:opacity-100 group-hover/skill:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-sm text-muted-foreground/40 italic mb-6">
                    No skills listed yet.
                  </p>
                )}
              </AnimatePresence>

              {isEditing && (
                <div className="flex gap-3">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill (press Enter)..."
                    className="rounded-xl h-11 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    className="h-11 px-4 rounded-xl font-bold flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              )}
            </Card>

            {/* Experience */}
            <Card className="glass-card rounded-[3rem] border-white/20 shadow-2xl p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tighter">
                    Experience
                  </h3>
                  <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">
                    Your career journey
                  </p>
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  placeholder={`List your work experience:\n\nSenior Frontend Developer @ Acme Corp (2022–Present)\n- Built React applications serving 100k+ users\n- Led a team of 3 engineers\n\nFrontend Developer @ StartupXYZ (2020–2022)\n- Developed mobile-first web experiences`}
                  className="h-48 rounded-2xl text-sm leading-relaxed resize-none font-mono"
                />
              ) : (
                <div className="whitespace-pre-line text-foreground/80 leading-relaxed font-medium text-sm">
                  {formData.experience || (
                    <span className="text-muted-foreground/40 italic text-base">
                      No experience added yet. Share your career story with
                      recruiters.
                    </span>
                  )}
                </div>
              )}
            </Card>

            {/* Profile Completion Tips */}
            {completionScore < 100 && !isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2.5rem] p-8 border-2 border-dashed border-primary/20 bg-primary/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="font-black text-lg tracking-tight text-primary">
                    Boost Your Profile
                  </h4>
                </div>
                <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
                  {!formData.name && (
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                      Add your full name
                    </li>
                  )}
                  {!formData.title && (
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                      Add a professional headline
                    </li>
                  )}
                  {!formData.bio && (
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                      Write a short bio
                    </li>
                  )}
                  {formData.skills.length === 0 && (
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                      List at least 3 skills
                    </li>
                  )}
                  {!formData.resumeUrl && (
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                      Upload or link your resume
                    </li>
                  )}
                </ul>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 h-11 px-6 rounded-xl font-black"
                >
                  Complete My Profile
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
