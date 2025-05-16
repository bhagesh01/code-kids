
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface TestCase {
  input: string;
  expected: string;
}

interface TestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

interface ProblemDescriptionProps {
  title: string;
  description: string;
  problem: string;
  tests: TestCase[];
  testResults: TestResult[];
}

const ProblemDescription = ({ title, description, problem, tests, testResults }: ProblemDescriptionProps) => {
  return (
    <Card className="h-full overflow-hidden">
      <Tabs defaultValue="problem">
        <TabsList className="w-full">
          <TabsTrigger value="problem" className="flex-1">Problem</TabsTrigger>
          <TabsTrigger value="tests" className="flex-1">Test Cases</TabsTrigger>
        </TabsList>
        <div className="p-4 h-[calc(100vh-180px)] overflow-auto">
          <TabsContent value="problem" className="m-0">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            <div className="prose prose-sm max-w-none">
              <pre className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                {problem}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="tests" className="m-0 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
            {tests.map((test, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="text-sm"><span className="font-medium">Input:</span> {test.input}</div>
                <div className="text-sm"><span className="font-medium">Expected:</span> {test.expected}</div>
                {testResults[index] && (
                  <div className="mt-2">
                    <Badge variant={testResults[index].passed ? "default" : "destructive"}>
                      {testResults[index].passed ? "Passed" : "Failed"}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default ProblemDescription;
