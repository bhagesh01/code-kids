
import { useState } from "react";

interface TestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

interface TestCase {
  input: any[];
  expected: any;
  description?: string;
}

const useCodeTesting = (code: string) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  
  const testCode = () => {
    console.log("Testing code:", code);
    
    try {
      // Define test cases for the findLargest function
      const testCases: TestCase[] = [
        { input: [5, 2, 9, 1, 7], expected: 9, description: "Mixed positive numbers" },
        { input: [10, 10, 10], expected: 10, description: "All same numbers" },
        { input: [-5, -10, -1, -3], expected: -1, description: "All negative numbers" },
        { input: [1], expected: 1, description: "Single element" },
        { input: [100, 50, 75], expected: 100, description: "First element is largest" }
      ];
      
      // Create a safe evaluation environment
      const results: TestResult[] = [];
      
      // Extract the function from the code
      let userFunction: Function | null = null;
      
      try {
        // Create a sandbox environment to execute the user's code
        const sandboxCode = `
          ${code}
          
          // Return the function for testing
          if (typeof findLargest === 'function') {
            findLargest;
          } else {
            throw new Error('findLargest function not found or not properly defined');
          }
        `;
        
        // Use Function constructor to evaluate the code safely
        userFunction = new Function('return (' + sandboxCode + ')')();
        
        if (typeof userFunction !== 'function') {
          throw new Error('findLargest function not found or not properly defined');
        }
        
      } catch (error: any) {
        console.error("Error compiling user code:", error);
        
        // If there's a compilation error, mark all tests as failed
        testCases.forEach(testCase => {
          results.push({
            passed: false,
            input: JSON.stringify(testCase.input),
            expected: testCase.expected.toString(),
            error: `Compilation error: ${error.message}`
          });
        });
        
        setTestResults(results);
        setAllTestsPassed(false);
        setShowTestDialog(true);
        return results;
      }
      
      // Run each test case
      testCases.forEach((testCase, index) => {
        try {
          console.log(`Running test ${index + 1}:`, testCase);
          
          const result = userFunction!(testCase.input);
          const passed = result === testCase.expected;
          
          console.log(`Test ${index + 1} result:`, { result, expected: testCase.expected, passed });
          
          results.push({
            passed,
            input: JSON.stringify(testCase.input),
            expected: testCase.expected.toString(),
            actual: result?.toString() || 'undefined'
          });
          
        } catch (error: any) {
          console.error(`Error in test ${index + 1}:`, error);
          results.push({
            passed: false,
            input: JSON.stringify(testCase.input),
            expected: testCase.expected.toString(),
            error: error.message
          });
        }
      });
      
      console.log("All test results:", results);
      
      setTestResults(results);
      
      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      setAllTestsPassed(allPassed);
      
      // Show the test results dialog
      setShowTestDialog(true);
      
      return results;
      
    } catch (error: any) {
      console.error("Error testing code:", error);
      const errorResults = [{
        passed: false,
        error: `Testing error: ${error.message}`
      }];
      
      setTestResults(errorResults);
      setAllTestsPassed(false);
      setShowTestDialog(true);
      
      return errorResults;
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
