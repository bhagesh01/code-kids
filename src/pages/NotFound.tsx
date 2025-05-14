
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 flex items-center justify-center">
          <Code className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! This page has gone missing in the code!
        </p>
        <Link to="/">
          <Button className="hover-scale">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
