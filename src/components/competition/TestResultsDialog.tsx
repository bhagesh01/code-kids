
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface TestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

interface TestResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testResults: TestResult[];
  allTestsPassed: boolean;
}

const TestResultsDialog = ({ 
  open, 
  onOpenChange, 
  testResults, 
  allTestsPassed 
}: TestResultsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Test Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {testResults.map((result, index) => (
            <div key={index} className={`p-3 rounded-md border ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Test Case #{index + 1}</div>
                <Badge variant={result.passed ? "default" : "destructive"} className="flex items-center gap-1">
                  {result.passed ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Passed</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" />
                      <span>Failed</span>
                    </>
                  )}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Input:</span> {result.input}</div>
                <div><span className="font-medium">Expected:</span> {result.expected}</div>
                {result.actual && <div><span className="font-medium">Your output:</span> {result.actual}</div>}
                {result.error && <div className="text-red-500"><span className="font-medium">Error:</span> {result.error}</div>}
              </div>
            </div>
          ))}

          {allTestsPassed ? (
            <div className="text-center text-green-600 font-medium">
              All tests passed! You can now submit your solution.
            </div>
          ) : (
            <div className="text-center text-amber-600 font-medium">
              Some tests failed. Please fix your code and try again.
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestResultsDialog;
