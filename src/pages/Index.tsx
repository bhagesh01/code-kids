
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowRight, Code, Star, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-in">
                  Code, Compete, and Level Up!
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Join our kid-friendly coding competitions to sharpen your skills and challenge yourself against other young coders
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="hover-scale">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button size="lg" className="hover-scale">
                      Start Coding Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link to={isAuthenticated ? "/competitions" : "/login"}>
                  <Button size="lg" variant="outline" className="hover-scale">
                    {isAuthenticated ? "Browse Competitions" : "Login to Continue"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-lg shadow-sm hover-card">
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Join Competitions</h3>
                <p className="text-muted-foreground">
                  Choose from weekly coding challenges based on your skill level and preferred time slot
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm hover-card">
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Improve Skills</h3>
                <p className="text-muted-foreground">
                  Solve fun coding problems and see how you compare with other kids your age
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm hover-card">
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Level up your profile and get weekly personalized tips to become a better coder
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to Start Your Coding Journey?</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Join thousands of young coders and start competing today. Get 5 free credits every week!
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" className="mt-4 hover-scale">
                  {isAuthenticated ? "Go to Dashboard" : "Create Your Free Account"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-semibold">CodeKids</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CodeKids. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
