
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import { useAuth } from "@/contexts/AuthContext";
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

const CompetitionRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{name: string, progress: number}[]>([
    { name: "Player 1", progress: 75 },
    { name: "Player 2", progress: 60 },
    { name: "Player 3", progress: 40 },
    { name: user?.name || "You", progress: 25 },
    { name: "Player 4", progress: 15 },
  ]);
  const [inLobby, setInLobby] = useState(false);
  const [isArenaCompetition, setIsArenaCompetition] = useState(false);
  
  // Default code template
  const codeTemplate = `// Write a function to find the largest number in an array
// DO NOT use built-in Math.max() function

function findLargest(arr) {
  // Your code here
  let largest = arr[0];
  
  // Implement your solution
  
  return largest;
}

// Example usage:
// findLargest([5, 2, 9, 1, 7]) should return 9
`;
  
  // Mock competition data
  const competitionData = {
    title: "Array Adventures",
    difficulty: "Easy",
    description: "Write a function that finds the largest element in an array of numbers.",
    startTime: new Date(Date.now() + 60000), // Mock start time 1 minute from now
    duration: 10, // in minutes
    category: "arena", // Set to arena for testing
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
  };

  // Use custom hooks for code testing
  const { 
    testResults, 
    allTestsPassed, 
    showTestDialog, 
    setShowTestDialog, 
    testCode 
  } = useCodeTesting(code);

  // Handle hint usage
  const handleHintUsed = (penalty: number) => {
    // Add penalty to the timer by reducing timeLeft
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
    competitionData.duration * 60, 
    handleCompetitionComplete
  );

  // Initialize code with template
  useEffect(() => {
    if (!code) {
      setCode(codeTemplate);
    }
  }, []);

  // Fetch competition data
  useEffect(() => {
    // Mock fetching competition data
    const fetchCompetitionData = async () => {
      // Check if this is an arena competition (practice mode)
      setIsArenaCompetition(competitionData.category === "arena");
      
      if (competitionData.category === "arena") {
        // Arena competitions are available immediately for practice
        setInLobby(false);
        setTimeLeft(competitionData.duration * 60); // Convert minutes to seconds
      } else {
        // For timed competitions, check if we need to show lobby
        const now = new Date();
        
        if (now < competitionData.startTime) {
          // Competition hasn't started yet - show lobby with notify option
          setInLobby(true);
        } else {
          // Competition has started - show timer
          setInLobby(false);
          setTimeLeft(competitionData.duration * 60); // Convert minutes to seconds
        }
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
      
      // Update player's progress in leaderboard
      const codeLength = value.trim().length;
      const progress = Math.min(90, Math.floor((codeLength / 150) * 100)); // Arbitrary progress calculation
      
      setLeaderboard(prev => 
        prev.map(player => 
          player.name === (user?.name || "You") ? { ...player, progress } : player
        )
      );
    }
  };
  
  // Handle code submission
  const handleSubmit = () => {
    // First test the code
    const results = testCode();
    
    // Check if all tests have passed
    if (!results.every(r => r.passed)) {
      toast.error("Cannot submit. Please fix the failing tests first.");
      return;
    }
    
    setIsCompleted(true);
    setShowConfetti(true);
    
    // Update leaderboard to show player's final position
    setLeaderboard(prev => {
      const updated = prev.map(player => 
        player.name === (user?.name || "You") ? { ...player, progress: 100 } : player
      );
      return updated.sort((a, b) => b.progress - a.progress);
    });
    
    toast.success("Solution submitted successfully!");
  };
  
  // Handle competition start from lobby
  const handleCompetitionStart = (duration: number) => {
    setInLobby(false);
    setTimeLeft(duration);
  };
  
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
                <Button onClick={testCode} variant="outline" className="hover-scale">
                  Test Code
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="hover-scale"
                  disabled={!allTestsPassed}
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
