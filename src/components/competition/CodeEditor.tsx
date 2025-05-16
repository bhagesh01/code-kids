
import { Card, CardContent } from "@/components/ui/card";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  isCompleted: boolean;
}

const CodeEditor = ({ code, onChange, isCompleted }: CodeEditorProps) => {
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-0 h-[calc(100vh-140px)]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-light"
          onChange={onChange}
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
  );
};

export default CodeEditor;
