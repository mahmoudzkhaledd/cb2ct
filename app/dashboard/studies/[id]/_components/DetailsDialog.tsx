"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import CodeSnippet from "@/components/general/CodeSnippet";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { getStatusColor } from "@/lib/utils";
import { Study } from "@prisma/client";
import { Info } from "lucide-react";
import { useTransition } from "react";
import { reEnhanceStudyAction } from "@/actions/studies/reEnhanceStudy";
import { toast } from "sonner";
export function DetailsDialog({ study }: { study: Study }) {
  const [loading, startTrans] = useTransition();
  const reEnhance = () => {
    startTrans(async () => {
      const res = await reEnhanceStudyAction(study.id);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      window.location.reload();
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 bottom-4"
        >
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between pr-5">
          <DialogTitle>Study Details</DialogTitle>
          <div className="flex items-center gap-1">
            {(study.status == "PENDING" || study.status == "IN_PROGRESS") && (
              <LoadingSpinner />
            )}
            {study.status != "PENDING" && (
              <Badge className={`${getStatusColor(study.status)} text-white`}>
                {study.status}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <CodeSnippet label="Id" text={study.id} />
        <CodeSnippet label="Status" text={study.status} />
        {study.metadata && (
          <>
            <CodeSnippet
              label="Patient ID"
              text={(study.metadata as any).patientID}
            />
            <CodeSnippet
              label="Patient BirthDate"
              text={(study.metadata as any).patientBirthDate}
            />
            <CodeSnippet
              label="Patient Sex"
              text={(study.metadata as any).patientSex}
            />
            <CodeSnippet
              label="Study Description"
              text={(study.metadata as any).studyDescription}
            />
            <CodeSnippet
              label="Study Date"
              text={(study.metadata as any).studyDate}
            />
            <CodeSnippet
              label="Modality"
              text={(study.metadata as any).modality}
            />
          </>
        )}
        {study.failerReason && (
          <CodeSnippet area label="Failer reason" text={study.failerReason} />
        )}
        <Button className="w-full" loading={loading} onClick={reEnhance}>
          Resubmit Study
        </Button>
      </DialogContent>
    </Dialog>
  );
}
