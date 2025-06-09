
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Clock, Database } from "lucide-react";

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
  // Ensure testResults is defined
  const safeTestResults = testResults || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Test Results</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-6 py-4">
            {/* Complexity Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Algorithm Complexity Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Time Complexity:</span>
                  <Badge variant="secondary">O(n)</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Space Complexity:</span>
                  <Badge variant="secondary">O(1)</Badge>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                Your solution iterates through the array once (O(n) time) and uses constant extra space (O(1) space).
              </p>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Test Cases Results</h3>
              {safeTestResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-lg">Test Case #{index + 1}</div>
                    <Badge variant={result.passed ? "default" : "destructive"} className="flex items-center gap-2 px-3 py-1">
                      {result.passed ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Passed</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          <span>Failed</span>
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <span className="font-semibold text-gray-700">Input:</span>
                        <div className="mt-1 font-mono text-blue-600">{result.input}</div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <span className="font-semibold text-gray-700">Expected:</span>
                        <div className="mt-1 font-mono text-green-600">{result.expected}</div>
                      </div>
                      
                      {result.actual && (
                        <div className="bg-white p-3 rounded border">
                          <span className="font-semibold text-gray-700">Your Output:</span>
                          <div className={`mt-1 font-mono ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.actual}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {result.error && (
                      <div className="bg-red-100 border border-red-300 rounded p-3">
                        <span className="font-semibold text-red-700">Error:</span>
                        <div className="mt-1 text-red-600 font-mono text-xs break-all">{result.error}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Result */}
            <div className={`p-6 rounded-lg border-2 text-center ${allTestsPassed ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
              {allTestsPassed ? (
                <div className="text-green-700">
                  <Check className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-xl font-bold mb-2">All Tests Passed! 🎉</div>
                  <div className="text-lg">Your solution is working correctly and you can now submit it.</div>
                </div>
              ) : (
                <div className="text-amber-700">
                  <X className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-xl font-bold mb-2">Some Tests Failed</div>
                  <div className="text-lg">Please review the failed test cases and fix your code before submitting.</div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestResultsDialog;
