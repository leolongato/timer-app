import { StepType } from "@/hooks/useWorkoutTimer";
import { BaseColor, ProgressColor } from "@/theme/colors";
import { ColorSchemeName } from "react-native";

export function getProgressColor(
  step: string,
  colorScheme: ColorSchemeName = "light",
): string {
  if (step === StepType.WORK) return ProgressColor.work;
  if (step === StepType.REST) return ProgressColor.rest;

  return colorScheme === "dark" ? BaseColor[50] : BaseColor[800];
}
