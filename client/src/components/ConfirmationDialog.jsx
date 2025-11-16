import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  transcript, // It now receives the raw transcript directly
  onConfirm,
  onCancel,
}) => {
  const [editedText, setEditedText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && transcript) {
      setEditedText(transcript);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, transcript]);

  const handleConfirm = () => onConfirm(editedText.trim());
  const handleCancel = () => onCancel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Review & Confirm</DialogTitle>
        </DialogHeader>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Is this what you said?</label>
          <Input ref={inputRef} value={editedText} onChange={(e) => setEditedText(e.target.value)} className="mt-2 text-base" />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm & Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};