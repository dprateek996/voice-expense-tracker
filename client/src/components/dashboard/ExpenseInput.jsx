// src/components/dashboard/ExpenseInput.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createExpense } from '@/api';
import VoiceInput from './VoiceInput';

const ExpenseInput = ({ onExpenseAdded }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter an expense description');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newExpense = await createExpense(text);
      
      // Show success message
      setSuccess(true);
      setText('');
      
      // Notify parent component
      if (onExpenseAdded) {
        onExpenseAdded(newExpense);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setText(transcript);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Add Expense</CardTitle>
        <CardDescription className="text-gray-400">
          Type or speak your expense in natural language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Voice Input */}
          <VoiceInput onTranscriptChange={handleVoiceTranscript} disabled={loading} />
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Spent $50 on groceries at Walmart"
              className="w-full min-h-[100px] p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-md">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Expense added successfully!</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Add Expense
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p className="font-semibold mb-1">Examples:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Paid $45 for dinner at Pizza Hut</li>
            <li>Uber ride to office cost me 12 dollars</li>
            <li>Bought a shirt for 30 bucks</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseInput;
