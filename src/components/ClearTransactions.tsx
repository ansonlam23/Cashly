import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2, CheckCircle } from "lucide-react";

export function ClearTransactions() {
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; deletedCount?: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const clearAllTransactions = useMutation(api.transactions.clearAllTransactions);

  const handleClearTransactions = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      setIsClearing(true);
      setResult(null);
      
      const result = await clearAllTransactions();
      setResult({
        success: true,
        message: result.message,
        deletedCount: result.deletedCount
      });
      setShowConfirm(false);
    } catch (error) {
      console.error("Error clearing transactions:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
      setShowConfirm(false);
    } finally {
      setIsClearing(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setResult(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-500">
          <Trash2 className="h-5 w-5" />
          Clear All Transactions
        </CardTitle>
        <CardDescription>
          This will permanently delete all transactions for your account. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showConfirm && !result && (
          <Button 
            onClick={handleClearTransactions}
            variant="destructive"
            className="w-full"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Clear All Transactions
          </Button>
        )}

        {showConfirm && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Are you absolutely sure?</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                This will permanently delete ALL transactions for your account. 
                This action cannot be undone and will affect all your financial data and insights.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleClearTransactions}
                disabled={isClearing}
                variant="destructive"
                className="flex-1"
              >
                {isClearing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Yes, Delete All
                  </>
                )}
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={isClearing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span className={`font-semibold ${
                result.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {result.success ? 'Success!' : 'Error'}
              </span>
            </div>
            <p className={`text-sm mt-2 ${
              result.success 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              {result.message}
            </p>
            {result.success && result.deletedCount !== undefined && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Deleted {result.deletedCount} transactions
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
