import { useState } from 'react';
import { toast } from 'sonner';

export const ConfirmationToast = ({ initialTranscript, onConfirm, onCancel }) => {
  const [editedTranscript, setEditedTranscript] = useState(initialTranscript);

  const handleConfirm = () => {
    onConfirm(editedTranscript);
    toast.dismiss();
  };

  const handleCancel = () => {
    onCancel();
    toast.dismiss();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-muted-foreground mb-1">I heard:</label>
        <input
          type="text"
          value={editedTranscript}
          onChange={(e) => setEditedTranscript(e.target.value)}
          className="w-full px-3 py-2 text-foreground bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-semibold rounded-md bg-muted hover:bg-muted/80"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};