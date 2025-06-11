
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

  // Fetch competition data from Supabase
  useEffect(() => {
    const fetchCompetitionData = async () => {
      setLoading(true);
      
      try {
        console.log("Fetching competition with ID:", id);
        
        const { data: competition, error } = await supabase
          .from('competitions')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching competition:", error);
          toast.error("Failed to load competition data");
          navigate("/competitions");
          return;
        }

        if (!competition) {
          console.error("Competition not found");
          toast.error("Competition not found");
          navigate("/competitions");
          return;
        }

        console.log("Competition data:", competition);

        // Transform Supabase data to match our interface
        const transformedData: CompetitionData = {
          id: competition.id,
          title: competition.title,
          difficulty: competition.difficulty,
          description: competition.description || "",
          startTime: competition.start_time ? new Date(competition.start_time) : new Date(),
          duration: competition.duration_minutes,
          category: competition.category,
          problem: competition.problem_statement,
          tests: competition.test_cases || [],
          hints: competition.hints || [],
          codeTemplate: competition.code_template,
          functionName: competition.function_name
        };

        setCompetitionData(transformedData);
        
        // Initialize code with template
        if (!code) {
          setCode(transformedData.codeTemplate);
        }
        
        // Check if this is a practice competition
        setIsArenaCompetition(transformedData.category === "practice");
        
        if (transformedData.category === "practice") {
          // Practice competitions are available immediately
          setInLobby(false);
          setTimeLeft(transformedData.duration * 60);
        } else {
          // For scheduled competitions, check if we need to show lobby
          const now = new Date();
          
          if (now < transformedData.startTime) {
            setInLobby(true);
          } else {
            setInLobby(false);
            setTimeLeft(transformedData.duration * 60);
          }
        }
      } catch (error) {
        console.error("Error fetching competition data:", error);
        toast.error("Failed to load competition data");
        navigate("/competitions");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCompetitionData();
    }
  }, [id, navigate]);

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
  const handleSubmit = async () => {
    console.log("Submitting code...");
    
    if (!competitionData || !user) {
      toast.error("Competition data not loaded or user not authenticated!");
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
    
    try {
      // Save participation to database
      const { error } = await supabase
        .from('competition_participants')
        .upsert({
          competition_id: competitionData.id,
          user_id: user.id,
          code_submitted: code,
          is_completed: true,
          completed_at: new Date().toISOString(),
          score: 100 // Full score for passing all tests
        });

      if (error) {
        console.error("Error saving submission:", error);
        toast.error("Failed to save submission. Please try again.");
        return;
      }

      // If we reach here, all tests passed and submission was saved
      console.log("All tests passed! Submission saved successfully.");
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
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error("Failed to submit solution. Please try again.");
    }
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
