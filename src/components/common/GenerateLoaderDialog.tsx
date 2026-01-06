import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateLoaderDialogProps {
  open: boolean;
  progress?: number;
}

export function GenerateLoaderDialog({
  open,
  progress,
}: GenerateLoaderDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-sm"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Generating Assessment
          </DialogTitle>

          {/* <DialogDescription>
            Please wait, It may take 2-3 minutes
          </DialogDescription> */}
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {progress !== undefined ? (
            <Progress value={progress} />
          ) : (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Please wait, It may take 2-3 minutes
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
