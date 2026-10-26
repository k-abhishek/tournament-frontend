import { CheckCircle2 } from "lucide-react";

export type Step = "create" | "invite" | "done";

interface RegisterStepperProps {
  currentStep: Step;
}

export function RegisterStepper({ currentStep }: RegisterStepperProps) {
  return (
    <div className="flex items-center justify-between px-2 pt-2">
      <StepItem
        number="1"
        title="Create Team"
        active={currentStep === "create"}
        completed={currentStep === "invite" || currentStep === "done"}
      />
      <div
        className={`h-0.5 flex-1 mx-3 transition-colors ${
          currentStep === "invite" || currentStep === "done" ? "bg-lime" : "bg-line"
        }`}
      />
      <StepItem
        number="2"
        title="Invite Players"
        active={currentStep === "invite"}
        completed={currentStep === "done"}
      />
      <div
        className={`h-0.5 flex-1 mx-3 transition-colors ${
          currentStep === "done" ? "bg-lime" : "bg-line"
        }`}
      />
      <StepItem
        number="3"
        title="Confirmed"
        active={currentStep === "done"}
        completed={currentStep === "done"}
      />
    </div>
  );
}

function StepItem({
  number,
  title,
  active,
  completed,
}: {
  number: string;
  title: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
          completed
            ? "bg-lime text-ink"
            : active
            ? "bg-ember text-ink ring-2 ring-ember/30"
            : "bg-background border border-line text-fog"
        }`}
      >
        {completed ? <CheckCircle2 size={14} /> : number}
      </div>
      <span
        className={`text-xs font-mono hidden sm:inline ${
          active ? "text-snow font-bold" : completed ? "text-lime" : "text-fog"
        }`}
      >
        {title}
      </span>
    </div>
  );
}
