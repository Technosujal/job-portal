import { Check, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils.js";

const STEPS = [
  { id: "pending", label: "Applied" },
  { id: "reviewed", label: "Reviewed" },
  { id: "interview", label: "Interview" },
  { id: "decision", label: "Decision" },
];

export function StatusStepper({ status }) {
  const getStepIndex = (s) => {
    if (s === "pending") return 0;
    if (s === "reviewed") return 1;
    if (s === "interview") return 2;
    if (s === "offered" || s === "rejected") return 3;
    return 0;
  };

  const currentIndex = getStepIndex(status);
  const isRejected = status === "rejected";

  return (
    <div className="w-full py-8 md:py-12">
      <div className="relative flex justify-between items-center max-w-2xl mx-auto">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 w-full h-[3px] bg-muted/30 rounded-full" />
        
        {/* Animated Progress Line */}
        <div 
          className={cn(
            "absolute top-5 left-0 h-[3px] rounded-full transition-all duration-1000 ease-out shadow-lg",
            isRejected && currentIndex === 3 ? "bg-rose-500 shadow-rose-500/30" : "bg-primary shadow-primary/30"
          )}
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div 
                className={cn(
                  "h-10 w-10 rounded-2xl border-2 flex items-center justify-center bg-background transition-all duration-500 shadow-xl",
                  isCompleted ? (isRejected && isLast ? "border-rose-500 bg-rose-500 text-white scale-110" : "border-primary bg-primary text-white scale-110") :
                  isCurrent ? (isRejected ? "border-rose-500 text-rose-500 ring-4 ring-rose-500/10" : "border-primary text-primary ring-4 ring-primary/10 shadow-primary/20 scale-110") :
                  "border-muted/50 text-muted-foreground group-hover:border-muted-foreground/30"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[4]" />
                ) : isCurrent && isRejected ? (
                  <XCircle className="h-6 w-6" />
                ) : (
                  <div className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all duration-300",
                    isCurrent ? "bg-primary animate-pulse scale-150" : "bg-muted-foreground/30"
                  )} />
                )}
              </div>
              <div className="absolute -bottom-10 flex flex-col items-center">
                <span 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300",
                    isCurrent ? (isRejected ? "text-rose-500" : "text-primary") :
                    isCompleted ? "text-foreground opacity-70" : "text-muted-foreground/40"
                  )}
                >
                  {isLast && status === "offered" ? "Offered" : 
                   isLast && status === "rejected" ? "Rejected" : 
                   step.label}
                </span>
                {isCurrent && (
                  <div className={cn(
                    "mt-1.5 h-1 w-1 rounded-full animate-bounce",
                    isRejected ? "bg-rose-500" : "bg-primary"
                  )} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

