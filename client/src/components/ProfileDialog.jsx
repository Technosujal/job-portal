import { useState, useEffect } from "react";
import { useUpdateProfile } from "@/hooks/use-auth.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { ObjectUploader } from "@/components/ObjectUploader.jsx";
import { Loader2 } from "lucide-react";

export function ProfileDialog({ user, trigger, open: controlledOpen, onOpenChange: setControlledOpen }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    title: user.title || "",
    skills: user.skills || [],
    resumeUrl: user.resumeUrl || "",
    companyLogo: user.companyLogo || "",
    companyWebsite: user.companyWebsite || "",
  });

  const [skillsString, setSkillsString] = useState((user.skills || []).join(", "));

  useEffect(() => {
    if (open) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        title: user.title || "",
        skills: user.skills || [],
        resumeUrl: user.resumeUrl || "",
        companyLogo: user.companyLogo || "",
        companyWebsite: user.companyWebsite || "",
      });
      setSkillsString((user.skills || []).join(", "));
    }
  }, [open, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const skills = skillsString.split(",").map(s => s.trim()).filter(Boolean);
    updateProfile({ ...formData, skills }, {
      onSuccess: () => setOpen(false),
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
      headers: { "Content-Type": file.type || "application/octet-stream" },
      objectPath
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">{user.role === "recruiter" ? "Professional Title" : "Job Title / Headline"}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={user.role === "recruiter" ? "e.g. Talent Acquisition Manager" : "e.g. Senior Software Engineer"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              className="h-24"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
            />
          </div>

          {user.role === "job_seeker" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  placeholder="React, TypeScript, Node.js..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Resume</Label>
                <ObjectUploader
                  onGetUploadParameters={async (file) => {
                    const params = await handleUploadParameters(file);
                    setFormData(prev => ({ ...prev, resumeUrl: params.objectPath }));
                    return params;
                  }}
                  onComplete={() => console.log("Upload complete")}
                  buttonClassName="w-full"
                >
                  {formData.resumeUrl ? "Change Resume" : "Upload Resume (PDF)"}
                </ObjectUploader>
                {formData.resumeUrl && (
                  <p className="text-xs text-green-600 font-medium">Resume uploaded successfully!</p>
                )}
              </div>
            </>
          )}

          {user.role === "recruiter" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <ObjectUploader
                    onGetUploadParameters={async (file) => {
                      const params = await handleUploadParameters(file);
                      setFormData(prev => ({ ...prev, companyLogo: params.objectPath }));
                      return params;
                    }}
                    onComplete={() => console.log("Upload complete")}
                    buttonClassName="w-full"
                  >
                    {formData.companyLogo ? "Change Logo" : "Upload Logo"}
                  </ObjectUploader>
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full mt-6" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
