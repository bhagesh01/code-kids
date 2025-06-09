import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

// Import refactored components
import LobbyView from "@/components/competition/LobbyView";
import TestResultsDialog from "@/components/competition/TestResultsDialog";
import ProblemDescription from "@/components/competition/ProblemDescription";
import CodeEditor from "@/components/competition/CodeEditor";
import LiveLeaderboard from "@/components/competition/LiveLeaderboard";
import HintSystem from "@/components/competition/HintSystem";

// Import custom hooks
import useCompetitionTimer from "@/hooks/useCompetitionTimer";
import useCodeTesting from "@/hooks/useCodeTesting";

interface CompetitionData {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  startTime: Date;
  duration: number;
  category: string;
  problem: string;
  tests: Array<{ input: string; expected: string }>;
  hints: Array<{ text: string; penalty: number }>;
  codeTemplate: string;
  functionName: string;
}

const CompetitionRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State variables
  const [code, setCode] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [inLobby, setInLobby] = useState(true);
  const [isArenaCompetition, setIsArenaCompetition] = useState(false);
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([
    { name: "Alice", progress: 85 },
    { name: "Bob", progress: 72 },
    { name: user?.name || "You", progress: 0 },
    { name: "Charlie", progress: 45 },
    { name: "Diana", progress: 38 }
  ]);

  // Mock competition data based on ID
  const getCompetitionData = (competitionId: string): CompetitionData => {
    const competitions: Record<string, CompetitionData> = {
      "mock-1": {
        id: "mock-1",
        title: "Array Adventures",
        difficulty: "Easy",
        description: "Write a function that finds the largest element in an array of numbers.",
        startTime: new Date(Date.now() + 60000),
        duration: 10,
        category: "arena",
        functionName: "findLargest",
        problem: `
# Find the Largest Number

Write a function called \`findLargest\` that takes an array of numbers as input and returns the largest number in the array.

## Examples:
- Input: [5, 2, 9, 1, 7]
- Output: 9

- Input: [10, 10, 10]
- Output: 10

- Input: [-5, -10, -1, -3]
- Output: -1

## Notes:
- The array will have at least one element
- You can assume all elements are numbers
- Don't use built-in Math.max() function (challenge yourself!)
        `,
        tests: [
          { input: "[5, 2, 9, 1, 7]", expected: "9" },
          { input: "[10, 10, 10]", expected: "10" },
          { input: "[-5, -10, -1, -3]", expected: "-1" },
        ],
        hints: [
          { 
            text: "Start by assuming the first element is the largest, then loop through the array to find any larger numbers.", 
            penalty: 15 
          },
          { 
            text: "Use a for loop to iterate through the array, comparing each element with your current 'largest' value.", 
            penalty: 30 
          },
          { 
            text: "If you find a number larger than your current 'largest', update the 'largest' variable with that new number.", 
            penalty: 45 
          },
        ],
        codeTemplate: `// Write a function to find the largest number in an array
// DO NOT use built-in Math.max() function

function findLargest(arr) {
  // Your code here
  let largest = arr[0];
  
  // Loop through the array to find the largest number
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }
  
  return largest;
}

// Example usage:
// findLargest([5, 2, 9, 1, 7]) should return 9
`
      },
      "binary-search": {
        id: "binary-search",
        title: "Binary Search Challenge",
        difficulty: "Medium",
        description: "Implement binary search to find an element in a sorted array.",
        startTime: new Date(Date.now() + 60000),
        duration: 15,
        category: "arena",
        functionName: "binarySearch",
        problem: `
# Binary Search Implementation

Write a function called \`binarySearch\` that takes a sorted array and a target value, then returns the index of the target if found, or -1 if not found.

## Examples:
- Input: [1, 3, 5, 7, 9], target: 5
- Output: 2

- Input: [1, 3, 5, 7, 9], target: 6
- Output: -1

- Input: [2, 4, 6, 8, 10, 12], target: 10
- Output: 4

## Notes:
- The input array is always sorted in ascending order
- Use the binary search algorithm (divide and conquer)
- Time complexity should be O(log n)
        `,
        tests: [
          { input: "[1, 3, 5, 7, 9], 5", expected: "2" },
          { input: "[1, 3, 5, 7, 9], 6", expected: "-1" },
          { input: "[2, 4, 6, 8, 10, 12], 10", expected: "4" },
          { input: "[1], 1", expected: "0" },
        ],
        hints: [
          { 
            text: "Start with two pointers: left (0) and right (array.length - 1). Calculate the middle index.", 
            penalty: 20 
          },
          { 
            text: "Compare the middle element with the target. If equal, return the index. If target is smaller, search the left half.", 
            penalty: 35 
          },
          { 
            text: "If target is larger than middle element, search the right half by updating the left pointer.", 
            penalty: 50 
          },
        ],
        codeTemplate: `// Implement binary search algorithm
// Time complexity should be O(log n)

function binarySearch(arr, target) {
  // Your code here
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// Example usage:
// binarySearch([1, 3, 5, 7, 9], 5) should return 2
`
      },
      "fibonacci": {
        id: "fibonacci",
        title: "Fibonacci Sequence",
        difficulty: "Easy",
        description: "Generate the nth Fibonacci number efficiently.",
        startTime: new Date(Date.now() + 60000),
        duration: 12,
        category: "arena",
        functionName: "fibonacci",
        problem: `
# Fibonacci Number

Write a function called \`fibonacci\` that takes a number n and returns the nth Fibonacci number.

## Examples:
- Input: 0
- Output: 0

- Input: 1
- Output: 1

- Input: 6
- Output: 8

- Input: 10
- Output: 55

## Notes:
- The Fibonacci sequence starts: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...
- fibonacci(0) = 0, fibonacci(1) = 1
- For n > 1: fibonacci(n) = fibonacci(n-1) + fibonacci(n-2)
        `,
        tests: [
          { input: "0", expected: "0" },
          { input: "1", expected: "1" },
          { input: "6", expected: "8" },
          { input: "10", expected: "55" },
        ],
        hints: [
          { 
            text: "You can solve this iteratively instead of recursively for better performance.", 
            penalty: 10 
          },
          { 
            text: "Keep track of the previous two numbers and update them as you calculate each new Fibonacci number.", 
            penalty: 25 
          },
          { 
            text: "Use two variables (prev and curr) and update them in a loop from 2 to n.", 
            penalty: 40 
          },
        ],
        codeTemplate: `// Generate the nth Fibonacci number
// Try to implement it efficiently (avoid recursion for better performance)

function fibonacci(n) {
  // Your code here
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

// Example usage:
// fibonacci(6) should return 8
`
      }
    };

    return competitions[competitionId] || competitions["mock-1"];
  };

  // Use custom hooks for code testing - pass competition data
  const { 
    testResults, 
    allTestsPassed, 
    showTestDialog, 
    setShowTestDialog, 
    testCode 
  } = useCodeTesting(code, competitionData);

  // Handle hint usage
  const handleHintUsed = (penalty: number) => {
    setTimeLeft((current) => {
      if (current === null) return null;
      return Math.max(0, current - penalty);
    });
  };

  // Handle competition completion
  const handleCompetitionComplete = () => {
    setIsCompleted(true);
  };

  // Use custom timer hook with timeLeft setter exposed
  const { timeLeft, setTimeLeft, formatTime } = useCompetitionTimer(
    competitionData?.duration ? competitionData.duration * 60 : 600, 
    handleCompetitionComplete
  );

  // Fetch competition data
  useEffect(() => {
    const fetchCompetitionData = async () => {
      setLoading(true);
      
      try {
        // Get competition data based on ID
        const data = getCompetitionData(id || "mock-1");
        setCompetitionData(data);
        
        // Initialize code with template
        if (!code) {
          setCode(data.codeTemplate);
        }
        
        // Check if this is an arena competition (practice mode)
        setIsArenaCompetition(data.category === "arena");
        
        if (data.category === "arena") {
          // Arena competitions are available immediately for practice
          setInLobby(false);
          setTimeLeft(data.duration * 60);
        } else {
          // For timed competitions, check if we need to show lobby
          const now = new Date();
          
          if (now < data.startTime) {
            setInLobby(true);
          } else {
            setInLobby(false);
            setTimeLeft(data.duration * 60);
          }
        }
      } catch (error) {
        console.error("Error fetching competition data:", error);
        toast.error("Failed to load competition data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompetitionData();
  }, [id]);

  // Update leaderboard periodically
  useEffect(() => {
    if (!inLobby && timeLeft !== null && timeLeft > 0 && !isCompleted) {
      // Randomly update leaderboard progress to simulate real competition
      if (timeLeft % 10 === 0) {
        setLeaderboard(prev => 
          prev.map(player => ({
            ...player,
            progress: player.name !== (user?.name || "You") ? 
              Math.min(100, player.progress + Math.floor(Math.random() * 10)) : 
              player.progress
          }))
        );
      }
    }
  }, [timeLeft, isCompleted, user?.name, inLobby]);
  
  // Handle code changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      
      // Update player's progress in leaderboard based on code completeness
      const codeLength = value.trim().length;
      const hasFunction = competitionData && value.includes(`function ${competitionData.functionName}`);
      const hasLoop = value.includes('for') || value.includes('while');
      const hasReturn = value.includes('return');
      
      let progress = 0;
      if (hasFunction) progress += 30;
      if (hasLoop) progress += 30;
      if (hasReturn) progress += 20;
      if (codeLength > 100) progress += 20;
      
      setLeaderboard(prev => 
        prev.map(player => 
          player.name === (user?.name || "You") ? { ...player, progress: Math.min(90, progress) } : player
        )
      );
    }
  };
  
  // Handle test code
  const handleTestCode = () => {
    console.log("Running tests...");
    
    if (!competitionData) {
      toast.error("Competition data not loaded!");
      return;
    }
    
    if (!code.trim()) {
      toast.error("Please write some code before testing!");
      return;
    }
    
    if (!code.includes(competitionData.functionName)) {
      toast.error(`Please define the '${competitionData.functionName}' function!`);
      return;
    }
    
    testCode();
  };
  
  // Handle code submission
  const handleSubmit = () => {
    console.log("Submitting code...");
    
    if (!competitionData) {
      toast.error("Competition data not loaded!");
      return;
    }
    
    if (!code.trim()) {
      toast.error("Please write some code before submitting!");
      return;
    }
    
    if (!code.includes(competitionData.functionName)) {
      toast.error(`Please define the '${competitionData.functionName}' function!`);
      return;
    }
    
    // First test the code if not already tested or if tests failed
    if (testResults.length === 0 || !allTestsPassed) {
      console.log("Running tests before submission...");
      const results = testCode();
      
      // Check if all tests have passed
      if (!results.every(r => r.passed)) {
        toast.error("Cannot submit: Some tests are failing. Please fix your code and try again.");
        return;
      }
    }
    
    // If we reach here, all tests passed
    console.log("All tests passed! Submitting solution...");
    setIsCompleted(true);
    setShowConfetti(true);
    
    // Update leaderboard to show player's final position
    setLeaderboard(prev => {
      const updated = prev.map(player => 
        player.name === (user?.name || "You") ? { ...player, progress: 100 } : player
      );
      return updated.sort((a, b) => b.progress - a.progress);
    });
    
    toast.success("🎉 Solution submitted successfully! All tests passed!");
    
    // Redirect to competitions page after a short delay
    setTimeout(() => {
      navigate("/competitions");
    }, 3000);
  };
  
  // Handle competition start from lobby
  const handleCompetitionStart = (duration: number) => {
    setInLobby(false);
    setTimeLeft(duration);
  };
  
  // Show loading state
  if (loading || !competitionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading competition...</div>
      </div>
    );
  }
  
  // Render the lobby screen when waiting for competition to start
  if (inLobby) {
    return (
      <LobbyView 
        competitionData={competitionData}
        onCompetitionStart={handleCompetitionStart}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Room Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold">{competitionData.title}</h1>
            <Badge className={
              competitionData.difficulty === "Easy" ? "bg-green-500" : 
              competitionData.difficulty === "Medium" ? "bg-yellow-500" : 
              "bg-red-500"
            }>
              {competitionData.difficulty}
            </Badge>
            {isArenaCompetition && (
              <Badge className="bg-blue-500">Practice Mode</Badge>
            )}
          </div>
          
          {/* Timer */}
          <div className="flex items-center space-x-2">
            {!isArenaCompetition && (
              <div className={`text-xl font-mono ${timeLeft !== null && timeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}>
                {formatTime(timeLeft)}
              </div>
            )}
            {!isCompleted && (
              <div className="flex space-x-2">
                <Button onClick={handleTestCode} variant="outline" className="hover-scale">
                  Test Code
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="hover-scale"
                  disabled={testResults.length > 0 && !allTestsPassed}
                >
                  Submit Code
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Problem Description */}
        <div className="lg:col-span-1 space-y-4">
          <ProblemDescription
            title={competitionData.title}
            description={competitionData.description}
            problem={competitionData.problem}
            tests={competitionData.tests}
            testResults={testResults}
          />
          
          {/* Hint System */}
          <HintSystem 
            hints={competitionData.hints}
            isCompleted={isCompleted}
            onHintUsed={handleHintUsed}
          />
        </div>
        
        {/* Center Panel - Code Editor */}
        <div className="lg:col-span-1">
          <CodeEditor 
            code={code}
            onChange={handleEditorChange}
            isCompleted={isCompleted}
          />
        </div>
        
        {/* Right Panel - Leaderboard & Results */}
        <div className="lg:col-span-1">
          <LiveLeaderboard
            leaderboard={leaderboard}
            isCompleted={isCompleted}
            currentUserName={user?.name || "You"}
          />
        </div>
      </main>
      
      {/* Test Results Dialog */}
      <TestResultsDialog
        open={showTestDialog}
        onOpenChange={setShowTestDialog}
        testResults={testResults}
        allTestsPassed={allTestsPassed}
      />
      
      {/* Show confetti on completion */}
      <Confetti active={showConfetti} />
    </div>
  );
};

export default CompetitionRoom;
