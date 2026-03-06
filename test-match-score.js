import { calculateMatchScore } from "./client/src/lib/utils.js";

const testCases = [
  {
    user: ["React", "TypeScript", "Node.js"],
    job: ["React", "TypeScript"],
    expected: 100
  },
  {
    user: ["React"],
    job: ["React", "TypeScript"],
    expected: 50
  },
  {
    user: ["Python"],
    job: ["React", "TypeScript"],
    expected: 0
  },
  {
    user: [],
    job: ["React"],
    expected: 0
  }
];

testCases.forEach((tc, i) => {
  const result = calculateMatchScore(tc.user, tc.job);
  console.log(`Test Case ${i + 1}: Expected ${tc.expected}%, Got ${result}% - ${tc.expected === result ? "PASSED" : "FAILED"}`);
});
