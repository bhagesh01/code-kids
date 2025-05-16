
import { useState } from "react";

interface TestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

const useCodeTesting = (code: string) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  
  const testCode = () => {
    try {
      // Create a sandbox to evaluate the code safely
      const sandboxCode = `
        ${code}
        
        const results = [];
        const tests = [
          { input: [5, 2, 9, 1, 7], expected: 9 },
          { input: [10, 10, 10], expected: 10 },
          { input: [-5, -10, -1, -3], expected: -1 }
        ];
        
        tests.forEach(test => {
          try {
            const result = findLargest(test.input);
            const passed = result === test.expected;
            results.push({ 
              passed, 
              input: JSON.stringify(test.input),
              expected: test.expected.toString(),
              actual: result.toString()
            });
          } catch (error) {
            results.push({ 
              passed: false, 
              input: JSON.stringify(test.input),
              expected: test.expected.toString(),
              error: error.message 
            });
          }
        });
        
        results;
      `;
      
      // Use Function constructor to evaluate code (sandbox)
      const evalFunction = new Function(sandboxCode);
      const results = evalFunction();
      
      setTestResults(results);
      
      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      setAllTestsPassed(allPassed);
      
      // Show the test results dialog
      setShowTestDialog(true);
      
      return results;
    } catch (error) {
      console.error("Error testing code:", error);
      return [];
    }
  };
  
  return {
    testResults,
    allTestsPassed,
    showTestDialog,
    setShowTestDialog,
    testCode
  };
};

export default useCodeTesting;
