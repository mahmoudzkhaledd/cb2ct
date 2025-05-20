import { StudyStatus } from "@prisma/client";
import { z } from "zod";

export const changeStudyStateSchema = z.object({
  id: z.string(),
  state: z.nativeEnum(StudyStatus),
  failerReason: z.string().optional().nullable(),
  resultIds: z.array(z.string()),
  metadata: z
    .object({
      patientName: z.string(),
      patientID: z.string(),
      patientBirthDate: z.string(),
      patientSex: z.string(),
      studyDescription: z.string(),
      studyDate: z.string(),
      modality: z.string(),
    })
    .transform((data) => ({
      patientName: data.patientName || "N/A",
      patientID: `Patient ID: ${data.patientID}`,
      patientBirthDate: `Birth Date: ${data.patientBirthDate.slice(0, 4)}-${data.patientBirthDate.slice(4, 6)}-${data.patientBirthDate.slice(6)}`,
      patientSex: `Sex: ${data.patientSex === "M" ? "Male" : "Female"}`,
      studyDescription: `Study Description: ${data.studyDescription.replace(/^RT\^/, "").replace("_", " ")}`,
      studyDate: `Study Date: ${data.studyDate.slice(0, 4)}-${data.studyDate.slice(4, 6)}-${data.studyDate.slice(6)}`,
      modality: `Modality: ${data.modality}`,
    }))
    .optional()
    .nullable(),
});

export type ChangeStudyStateSchema = z.infer<typeof changeStudyStateSchema>;
