import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Confetti from "@/components/Confetti";
import Editor from "@monaco-editor/react";

const CompetitionRoom = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [code, setCode] = useState("// Write your code here\n");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{name: string, progress: number}[]>([
    { name: "Player 1", progress: 75 },
    { name: "Player 2", progress: 60 },
    { name: "Player 3", progress: 40 },
    { name: "You", progress: 25 },
    { name: "Player 4", progress: 15 },
  ]);
  
  // Mock competition data
  const competitionData = {
    title: "Array Adventures",
    difficulty: "Easy",
    description: "Write a function that finds the largest element in an array of numbers.",
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
      { input: "[5, 2, 9, 1, 7]", expected: "9", passed: false },
      { input: "[10, 10, 10]", expected: "10", passed: false },
      { input: "[-5, -10, -1, -3]", expected: "-1", passed: false },
    ],
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Randomly update leaderboard progress to simulate real competition
        if (timeLeft % 10 === 0) {
          setLeaderboard(prev => 
            prev.map(player => ({
              ...player,
              progress: player.name !== "You" ? 
                Math.min(100, player.progress + Math.floor(Math.random() * 10)) : 
                player.progress
            }))
          );
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
    }
  }, [timeLeft, isCompleted]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle code submission
  const handleSubmit = () => {
    // In a real application, we would validate the code here
    setIsCompleted(true);
    setShowConfetti(true);
    
    // Update leaderboard to show player's final position
    setLeaderboard(prev => {
      const updated = prev.map(player => 
        player.name === "You" ? { ...player, progress: 100 } : player
      );
      return updated.sort((a, b) => b.progress - a.progress);
    });
  };
  
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      
      // Update player's progress in leaderboard
      const codeLength = value.trim().length;
      const progress = Math.min(90, Math.floor((codeLength / 150) * 100)); // Arbitrary progress calculation
      
      setLeaderboard(prev => 
        prev.map(player => 
          player.name === "You" ? { ...player, progress } : player
        )
      );
    }
  };
  
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
          </div>
          
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <div className={`text-xl font-mono ${timeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}>
              {formatTime(timeLeft)}
            </div>
            {!isCompleted && (
              <Button onClick={handleSubmit} className="hover-scale">
                Submit Code
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Problem Description */}
        <div className="lg:col-span-1">
          <Card className="h-full overflow-hidden">
            <Tabs defaultValue="problem">
              <TabsList className="w-full">
                <TabsTrigger value="problem" className="flex-1">Problem</TabsTrigger>
                <TabsTrigger value="tests" className="flex-1">Test Cases</TabsTrigger>
              </TabsList>
              <div className="p-4 h-[calc(100vh-180px)] overflow-auto">
                <TabsContent value="problem" className="m-0">
                  <h2 className="text-lg font-semibold mb-2">{competitionData.title}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">{competitionData.description}</p>
                  <div className="prose prose-sm max-w-none">
                    <pre className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                      {competitionData.problem}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="tests" className="m-0 space-y-4">
                  <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
                  {competitionData.tests.map((test, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="text-sm"><span className="font-medium">Input:</span> {test.input}</div>
                      <div className="text-sm"><span className="font-medium">Expected:</span> {test.expected}</div>
                      {isCompleted && (
                        <div className="mt-2">
                          <Badge variant={test.passed ? "default" : "destructive"}>
                            {test.passed ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
        
        {/* Center Panel - Code Editor */}
        <div className="lg:col-span-1">
          <Card className="h-full overflow-hidden">
            <CardContent className="p-0 h-[calc(100vh-140px)]">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                theme="vs-light"
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: isCompleted,
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel - Leaderboard & Results */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Live Leaderboard</h2>
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-6 text-muted-foreground">{index + 1}.</span>
                        <span className={player.name === "You" ? "font-bold text-primary" : ""}>
                          {player.name}
                        </span>
                      </div>
                      <span className="text-sm">{player.progress}%</span>
                    </div>
                    <Progress value={player.progress} className="h-2" />
                  </div>
                ))}
              </div>
              
              {isCompleted && (
                <div className="mt-8 p-4 border rounded-md bg-primary/5 text-center">
                  <h3 className="font-bold text-xl mb-2">Competition Complete!</h3>
                  <p className="text-muted-foreground mb-4">Your final rank: {leaderboard.findIndex(p => p.name === "You") + 1}</p>
                  <Button className="hover-scale w-full">View Solutions</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
      
      {/* Show confetti on completion */}
      <Confetti active={showConfetti} />
    </div>
  );
};

export default CompetitionRoom;
