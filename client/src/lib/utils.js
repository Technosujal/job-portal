import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function calculateMatchScore(
  userSkills, 
  jobSkills,
  userTitle,
  jobTitle
) {
  let totalScore = 0;
  let weightsUsed = 0;

  // 1. Skill Matching (Weight: 80)
  if (jobSkills && jobSkills.length > 0) {
    weightsUsed += 80;
    if (userSkills && userSkills.length > 0) {
      const userSkillsLower = userSkills.map(s => s.toLowerCase());
      const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
      const matches = jobSkillsLower.filter(skill => 
        userSkillsLower.some(uSkill => uSkill.includes(skill) || skill.includes(uSkill))
      );
      totalScore += (matches.length / jobSkillsLower.length) * 80;
    }
  }

  // 2. Title Matching (Weight: 20)
  if (userTitle && jobTitle) {
    weightsUsed += 20;
    const ut = userTitle.toLowerCase();
    const jt = jobTitle.toLowerCase();
    
    // Check for title overlap
    const utWords = ut.split(/\s+/).filter(w => w.length > 2);
    const jtWords = jt.split(/\s+/).filter(w => w.length > 2);
    const titleMatches = jtWords.filter(jWord => utWords.some(uWord => uWord.includes(jWord) || jWord.includes(uWord)));
    
    if (titleMatches.length > 0) {
      totalScore += 20;
    } else if (ut.includes(jt) || jt.includes(ut)) {
      totalScore += 20;
    }
  }

  if (weightsUsed === 0) return 0;
  
  // Normalize score to 100 if we used all weights, or relative to what we had
  return Math.round((totalScore / weightsUsed) * 100);
}
