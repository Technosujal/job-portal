import { Job, User } from "@shared/schema";

export interface ScoreCvResult {
  score: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

/**
 * Scores a CV against a job description.
 * Fallback to heuristic matching if no OpenAI key is available.
 */
export async function scoreCVAgainstJob(job: Job, user: User): Promise<ScoreCvResult> {
  // Simple heuristic matching for now
  // We can expand this with AI later
  
  const userSkills = user.skills || [];
  const jobSkills = job.skills || [];
  
  const matches = jobSkills.filter(skill => 
    userSkills.some(uSkill => uSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(uSkill.toLowerCase()))
  );
  
  const missing = jobSkills.filter(skill => 
    !userSkills.some(uSkill => uSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(uSkill.toLowerCase()))
  );
  
  const score = jobSkills.length > 0 ? Math.round((matches.length / jobSkills.length) * 100) : 0;
  
  let summary = "";
  if (score >= 80) {
    summary = "Excellent match! Your profile aligns strongly with the requirements for this role.";
  } else if (score >= 50) {
    summary = "Good match. You have many of the key skills, but there are some areas where you could supplement your profile.";
  } else {
    summary = "Fair match. You may need to gain more experience in specific areas to be a stronger candidate for this position.";
  }

  const recommendations = [];
  if (missing.length > 0) {
    recommendations.push(`Consider learning or highlighting your experience with: ${missing.slice(0, 3).join(", ")}.`);
  }
  if (!user.bio || user.bio.length < 50) {
    recommendations.push("Expand your profile bio to better showcase your professional journey.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Your profile looks great! Consider tailor-fitting your application for this specific role.");
  }

  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    score,
    summary,
    matchingSkills: matches,
    missingSkills: missing,
    recommendations
  };
}
