import { isMatch } from "date-fns";
import { z } from "zod";

export const generateIAReportSchema = z.object({
  month: z.string().refine((value) => isMatch(value, "MM")),
});

export type GenerateAIReportSchema = z.infer<typeof generateIAReportSchema>;
