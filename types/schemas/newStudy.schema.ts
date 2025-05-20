import { z } from "zod";

export const newStudySchema = z.object({
  ID: z.string(),
  ParentPatient: z.string(),
  ParentSeries: z.string(),
  ParentStudy: z.string(),
});

export type NewStudySchema = z.infer<typeof newStudySchema>;
