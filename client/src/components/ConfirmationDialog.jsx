import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CATEGORY_OPTIONS = [
  'Groceries',
  'Dining',
  'Transport',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
  'Travel',
  'Education',
  'Work',
  'Personal Care',
  'Fuel',
  'Other',
];

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  transcript,
  parsePreview = null,
  onConfirm,
  onCancel,
}) => {
  const [editedText, setEditedText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const inputRef = useRef(null);

  const reviewRequired = Boolean(parsePreview?.meta?.reviewRequired);
  const hasDraft = Boolean(parsePreview?.draft);
  const showStructuredDraft = reviewRequired || hasDraft;

  useEffect(() => {
    if (!open) return;

    setEditedText(transcript || '');
    setAmount(parsePreview?.draft?.amount ? String(parsePreview.draft.amount) : '');
    setCategory(parsePreview?.draft?.category || 'Other');
    setDescription(parsePreview?.draft?.description || transcript || '');

    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open, transcript, parsePreview]);

  const handleConfirm = () => {
    const normalizedTranscript = editedText.trim();
    if (!normalizedTranscript) return;

    if (!showStructuredDraft) {
      onConfirm({
        transcript: normalizedTranscript,
        forceSave: false,
      });
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    onConfirm({
      transcript: normalizedTranscript,
      forceSave: reviewRequired,
      draft: {
        amount: Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0,
        category: CATEGORY_OPTIONS.includes(category) ? category : 'Other',
        description: (description || normalizedTranscript).trim().slice(0, 120),
        subcategory: parsePreview?.meta?.subcategory || 'Misc',
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Review and Confirm</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {reviewRequired
            ? 'We need a quick review before saving this expense.'
            : 'Review and edit the transcribed text before adding it as an expense.'}
        </DialogDescription>

        <div>
          <label className="text-sm font-medium text-muted-foreground" htmlFor="voice-transcript">
            Transcript
          </label>
          <Input
            id="voice-transcript"
            ref={inputRef}
            value={editedText}
            onChange={(event) => setEditedText(event.target.value)}
            className="mt-2 text-base"
          />
        </div>

        {showStructuredDraft ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="voice-amount">
                Amount
              </label>
              <Input
                id="voice-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="voice-category">
                Category
              </label>
              <select
                id="voice-category"
                className="mt-2 h-12 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="voice-description">
                Description
              </label>
              <Input
                id="voice-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        ) : null}

        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm and Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

