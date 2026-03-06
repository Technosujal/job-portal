import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar.jsx";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications.js";
import { useJob } from "@/hooks/use-jobs.js";
import { useUpdateNotes, useScheduleInterview, useBulkUpdateStatus } from "@/hooks/use-features.js";
import {
  Card,
} from "@/components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { FileText, User, Target, Mail, Briefcase, Users, Code2, BookOpen, ExternalLink, ChevronDown, ChevronUp, StickyNote, CalendarClock, CheckSquare } from "lucide-react";
import { calculateMatchScore } from "@/lib/utils.js";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";




function ApplicationCard({ app, job, index, selected, onSelect }) {
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { mutate: saveNotes } = useUpdateNotes();
  const { mutate: scheduleInterview } = useScheduleInterview();
  const [expanded, setExpanded] = useState(false);
  const [notesValue, setNotesValue] = useState(app.notes || "");
  const [showInterview, setShowInterview] = useState(false);
  const [interviewDate, setInterviewDate] = useState(
    app.interviewDate ? new Date(app.interviewDate * 1000 || app.interviewDate).toISOString().slice(0, 16) : ""
  );
  const matchScore = calculateMatchScore(
    app.candidate?.skills,
    job?.skills,
    app.candidate?.title,
    job?.title
  );
  const candidate = app.candidate || {};
  const initials = (candidate.name || candidate.username || "?")[0].toUpperCase();

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    reviewed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    interview: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    offered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <motion.div
      key={app.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden rounded-[3rem] glass-card border-white/20 dark:border-white/5 shadow-2xl hover:shadow-primary/5 transition-all duration-500">
        <div className="p-8 md:p-10 space-y-8">
          {/* Candidate Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative h-20 w-20 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-primary/20 border-2 border-white/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                {candidate.avatarUrl ? (
                  <img src={candidate.avatarUrl} alt={candidate.name} className="h-full w-full object-cover" />
                ) : initials}
                {matchScore > 0 && (
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-black text-primary">{matchScore}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter group-hover:text-primary transition-colors">
                    {candidate.name || candidate.username || "Unknown Candidate"}
                  </h3>
                  {matchScore >= 80 && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] tracking-widest">
                      ⚡ ELITE MATCH
                    </Badge>
                  )}
                  <Badge className={`text-[10px] font-black tracking-widest border px-3 py-1 rounded-full ${statusColors[app.status] || ""}`}>
                    {app.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-primary/70 uppercase tracking-widest">
                  {candidate.title || "Professional Candidate"}
                </p>
                {candidate.email && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Mail className="h-3.5 w-3.5" />
                    {candidate.email}
                  </div>
                )}
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Update Stage</span>
              <Select
                defaultValue={app.status}
                onValueChange={(val) => updateStatus({ id: app.id, status: val })}
              >
                <SelectTrigger className="w-full md:w-[180px] h-14 rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-xl font-black text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-white/20 backdrop-blur-3xl p-2">
                  <SelectItem value="pending" className="rounded-xl font-bold py-3">Pending</SelectItem>
                  <SelectItem value="reviewed" className="rounded-xl font-bold py-3">Reviewed</SelectItem>
                  <SelectItem value="interview" className="rounded-xl font-bold py-3">Interview</SelectItem>
                  <SelectItem value="offered" className="rounded-xl font-bold py-3">Offered</SelectItem>
                  <SelectItem value="rejected" className="rounded-xl font-bold py-3 text-rose-500">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills */}
          {candidate.skills?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50 flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 font-bold text-xs hover:bg-primary/20 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50 flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" />
                Cover Letter
              </h4>
              <div className="bg-white/5 dark:bg-black/20 p-6 rounded-3xl border border-white/10 shadow-inner">
                <p className="italic text-foreground/80 leading-relaxed font-medium text-sm">
                  {app.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Expandable — Bio & Experience */}
          {(candidate.bio || candidate.experience) && (
            <div className="space-y-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-primary/70 hover:text-primary transition-colors"
              >
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {expanded ? "Hide" : "Show"} Full Profile
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    {candidate.bio && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50 flex items-center gap-2">
                          <User className="h-3.5 w-3.5" />
                          About
                        </h4>
                        <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                          {candidate.bio}
                        </p>
                      </div>
                    )}

                    {candidate.experience && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50 flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5" />
                          Experience
                        </h4>
                        <div className="whitespace-pre-line text-sm font-medium text-foreground/80 leading-relaxed bg-white/5 dark:bg-black/20 p-6 rounded-3xl border border-white/10">
                          {candidate.experience}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Resume Link */}
          {candidate.resumeUrl && (
            <a
              href={candidate.resumeUrl.startsWith("http") ? candidate.resumeUrl : `/objects/${candidate.resumeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="h-11 px-5 rounded-2xl border-primary/30 font-black text-xs tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Open Resume
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}

          {/* Recruiter Notes */}
          <div className="space-y-3 border-t border-white/10 pt-6">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50 flex items-center gap-2">
              <StickyNote className="h-3.5 w-3.5" />
              Private Notes
            </h4>
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              onBlur={() => saveNotes({ id: app.id, notes: notesValue })}
              placeholder="Add private notes about this candidate..."
              className="rounded-2xl bg-white/5 dark:bg-black/20 border-white/10 text-sm resize-none focus:ring-primary/30 font-medium"
              rows={3}
            />
          </div>

          {/* Interview Scheduling */}
          <div className="space-y-3">
            <button
              onClick={() => setShowInterview(!showInterview)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-primary/70 hover:text-primary transition-colors"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              {app.interviewDate ? `Interview: ${new Date(app.interviewDate * 1000 || app.interviewDate).toLocaleDateString()}` : "Schedule Interview"}
              {showInterview ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <AnimatePresence>
              {showInterview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-3 items-center overflow-hidden"
                >
                  <Input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="rounded-2xl border-primary/20 bg-primary/5 font-medium text-sm flex-1"
                  />
                  <Button
                    size="sm"
                    className="rounded-2xl h-10 px-4 font-black text-xs"
                    onClick={() => {
                      if (interviewDate) {
                        scheduleInterview({ id: app.id, interviewDate });
                        setShowInterview(false);
                      }
                    }}
                  >
                    Confirm
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-6 right-6">
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            className="h-5 w-5 border-2 border-white/20 data-[state=checked]:bg-primary"
          />
        </div>
      </Card>
    </motion.div>
  );
}

export default function JobApplications() {
  const [, params] = useRoute("/recruiter/job/:id/applications");
  const jobId = params?.id || "0";
  const { data: job } = useJob(jobId);
  const { data: applications, isLoading } = useApplications(jobId);
  const { mutate: bulkUpdate } = useBulkUpdateStatus();
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("reviewed");

  const toggleSelect = (id) => setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const handleBulkAction = () => {
    if (selectedIds.length === 0) return;
    bulkUpdate({ ids: selectedIds, status: bulkStatus });
    setSelectedIds([]);
  };

  // Sort by match score descending
  const sortedApps = applications
    ? [...applications].sort((a, b) => {
        const scoreA = calculateMatchScore(a.candidate?.skills, job?.skills, a.candidate?.title, job?.title);
        const scoreB = calculateMatchScore(b.candidate?.skills, job?.skills, b.candidate?.title, job?.title);
        return scoreB - scoreA;
      })
    : [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading applications...</div>;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />

      {/* Bulk Action Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 glass-card rounded-3xl border border-primary/20 shadow-2xl shadow-primary/20 backdrop-blur-xl"
          >
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-black">{selectedIds.length} selected</span>
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="w-36 h-10 rounded-xl border border-primary/20 bg-primary/5 font-bold text-sm text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="rounded-xl h-10 px-4 font-black text-xs" onClick={handleBulkAction}>
              Apply to All
            </Button>
            <Button size="sm" variant="ghost" className="rounded-xl h-10 px-3 text-xs" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container px-4 md:px-6 py-24 md:py-32 space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-primary">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Candidate Pipeline</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-tight">
              Talent <span className="animated-gradient-text">Roster</span>
            </h1>
            <p className="text-lg text-muted-foreground font-semibold opacity-70">
              Evaluating prospects for <span className="text-foreground">{job?.title}</span>
            </p>
          </motion.div>

          <Badge variant="outline" className="px-6 py-2.5 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary text-sm font-black tracking-widest gap-3 shadow-xl shadow-primary/5">
            <Users className="h-4 w-4" />
            {applications?.length || 0} APPLICANTS
          </Badge>
        </header>

        <div className="grid gap-10">
          <AnimatePresence>
            {sortedApps.map((app, index) => (
              <ApplicationCard
                key={app.id}
                app={app}
                job={job}
                index={index}
                selected={selectedIds.includes(app.id)}
                onSelect={() => toggleSelect(app.id)}
              />
            ))}
          </AnimatePresence>

          {sortedApps.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 glass-card rounded-[4rem] border-dashed border-4 border-muted/30"
            >
              <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8">
                <Users className="h-12 w-12 text-muted-foreground opacity-30" />
              </div>
              <h3 className="font-black text-3xl mb-4 font-display tracking-tight">Empty Roster</h3>
              <p className="text-muted-foreground font-semibold max-w-sm mx-auto opacity-70">
                No candidates have applied for this position yet. Check back soon or promote your listing!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

