import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  refinementData,
  onConfirm,
  onCancel,
}) => {
  const [editedText, setEditedText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && refinementData) {
      setEditedText(refinementData.corrected);
      // Focus the input slightly after the dialog opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, refinementData]);

  if (!refinementData) return null; // Don't render without data

  const handleConfirm = () => onConfirm(editedText.trim());
  const handleCancel = () => onCancel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Review Your Command</DialogTitle>
        </DialogHeader>

        <div>
          <label className="text-sm font-medium text-muted-foreground">AI Corrected Suggestion:</label>
          <Input ref={inputRef} value={editedText} onChange={(e) => setEditedText(e.target.value)} className="mt-1" />
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          Confidence:
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${refinementData.confidence * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="font-semibold">{Math.round(refinementData.confidence * 100)}%</span>
        </div>

        {refinementData.alternatives?.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Did you mean?</h3>
            <div className="flex flex-wrap gap-2">
              {refinementData.alternatives.map((alt, i) => (
                <Button key={i} variant="outline" size="sm" className="h-auto py-1 px-2" onClick={() => setEditedText(alt)}>
                  {alt}
                </Button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm & Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};