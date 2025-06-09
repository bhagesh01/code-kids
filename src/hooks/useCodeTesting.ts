
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

interface CompetitionData {
  functionName: string;
  tests: Array<{ input: string; expected: string }>;
}

const useCodeTesting = (code: string, competitionData: CompetitionData | null) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  
  const testCode = () => {
    console.log("Testing code:", code);
    
    if (!competitionData) {
      console.error("No competition data available");
      return [];
    }
    
    try {
      // Convert competition test cases to our internal format
      const testCases: TestCase[] = competitionData.tests.map((test, index) => {
        // Parse the input string to get the actual parameters
        let parsedInput: any[];
        try {
          // Handle different input formats
          if (competitionData.functionName === 'binarySearch') {
            // For binary search: "[1, 3, 5, 7, 9], 5"
            const parts = test.input.split('], ');
            const arrayPart = parts[0] + ']';
            const targetPart = parts[1];
            const array = JSON.parse(arrayPart);
            const target = parseInt(targetPart);
            parsedInput = [array, target];
          } else if (competitionData.functionName === 'fibonacci') {
            // For fibonacci: "6"
            parsedInput = [parseInt(test.input)];
          } else {
            // For findLargest and other array functions: "[5, 2, 9, 1, 7]"
            parsedInput = [JSON.parse(test.input)];
          }
        } catch (e) {
          console.error("Error parsing input:", test.input, e);
          parsedInput = [test.input];
        }

        return {
          input: parsedInput,
          expected: isNaN(Number(test.expected)) ? test.expected : Number(test.expected),
          description: `Test case ${index + 1}`
        };
      });
      
      const results: TestResult[] = [];
      
      // Extract the function from the code
      let userFunction: Function | null = null;
      
      try {
        // Check if the code contains the required function
        if (!code.includes(competitionData.functionName)) {
          throw new Error(`${competitionData.functionName} function not found in the code`);
        }
        
        // Create a more robust sandbox environment to execute the user's code
        const functionCode = `
          // User's code
          ${code}
          
          // Return the function for testing
          if (typeof ${competitionData.functionName} === 'function') {
            return ${competitionData.functionName};
          } else {
            throw new Error('${competitionData.functionName} function not found or not properly defined');
          }
        `;
        
        // Use Function constructor to evaluate the code safely in a controlled scope
        const createUserFunction = new Function(functionCode);
        userFunction = createUserFunction();
        
        if (typeof userFunction !== 'function') {
          throw new Error(`${competitionData.functionName} function not found or not properly defined`);
        }
        
        console.log("Successfully compiled user function");
        
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
          
          const result = userFunction!(...testCase.input);
          const passed = result === testCase.expected;
          
          console.log(`Test ${index + 1} result:`, { 
            input: testCase.input,
            result, 
            expected: testCase.expected, 
            passed 
          });
          
          results.push({
            passed,
            input: competitionData.tests[index].input,
            expected: testCase.expected.toString(),
            actual: result?.toString() || 'undefined'
          });
          
        } catch (error: any) {
          console.error(`Error in test ${index + 1}:`, error);
          results.push({
            passed: false,
            input: competitionData.tests[index].input,
            expected: testCase.expected.toString(),
            error: `Runtime error: ${error.message}`
          });
        }
      });
      
      console.log("All test results:", results);
      
      setTestResults(results);
      
      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      setAllTestsPassed(allPassed);
      
      console.log("All tests passed:", allPassed);
      
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
