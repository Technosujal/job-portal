import { Check, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ApplicationStatus = "pending" | "reviewed" | "interview" | "offered" | "rejected";

interface StatusStepperProps {
  status: ApplicationStatus;
}

const STEPS = [
  { id: "pending", label: "Applied" },
  { id: "reviewed", label: "Reviewed" },
  { id: "interview", label: "Interview" },
  { id: "decision", label: "Decision" },
];

export function StatusStepper({ status }: StatusStepperProps) {
  const getStepIndex = (s: ApplicationStatus) => {
    if (s === "pending") return 0;
    if (s === "reviewed") return 1;
    if (s === "interview") return 2;
    if (s === "offered" || s === "rejected") return 3;
    return 0;
  };

  const currentIndex = getStepIndex(status);
  const isRejected = status === "rejected";

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />
        <div 
          className={cn(
            "absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-500",
            isRejected && currentIndex === 3 ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={cn(
                  "h-8 w-8 rounded-full border-2 flex items-center justify-center bg-background transition-colors duration-300",
                  isCompleted ? (isRejected && isLast ? "border-destructive bg-destructive text-white" : "border-primary bg-primary text-white") :
                  isCurrent ? (isRejected ? "border-destructive text-destructive" : "border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]") :
                  "border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : isCurrent && isRejected ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <Circle className={cn("h-2 w-2 fill-current", isCurrent ? "animate-pulse" : "opacity-20")} />
                )}
              </div>
              <span 
                className={cn(
                  "absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300",
                  isCurrent ? (isRejected ? "text-destructive" : "text-primary") :
                  isCompleted ? "text-foreground/70" : "text-muted-foreground"
                )}
              >
                {isLast && status === "offered" ? "Offered" : 
                 isLast && status === "rejected" ? "Rejected" : 
                 step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
