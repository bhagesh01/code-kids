
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schema for competition creation
const competitionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  startTime: z.string(),
  duration: z.coerce.number().min(15).max(180),
  maxParticipants: z.coerce.number().min(5).max(100),
  category: z.enum(["hiring", "arena"]),
  positions: z.coerce.number().optional(),
  company: z.string().optional(),
});

const CreateCompetition = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not a recruiter or admin
  useEffect(() => {
    if (user && user.role !== 'recruiter' && user.role !== 'admin') {
      toast.error("Only recruiters can create competitions");
      navigate('/competitions');
    }
  }, [user, navigate]);
  
  const form = useForm<z.infer<typeof competitionSchema>>({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Medium",
      startTime: "",
      duration: 60,
      maxParticipants: 20,
      category: "hiring",
      company: user?.role === 'recruiter' ? user?.name + "'s Company" : undefined,
    },
  });
  
  const watchCategory = form.watch("category");
  
  const onSubmit = (data: z.infer<typeof competitionSchema>) => {
    setIsSubmitting(true);
    console.log("Competition data:", data);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Competition created successfully!");
      navigate("/competitions");
      // In a real app, you would create the competition in the backend
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Competition</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Competition Details</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs 
                  defaultValue="hiring"
                  value={watchCategory}
                  onValueChange={(value) => form.setValue("category", value as "hiring" | "arena")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger 
                      value="arena" 
                      disabled={user?.role !== 'admin'}
                      className="flex items-center gap-2 hover-scale"
                    >
                      <Users className="h-4 w-4" /> 
                      <span>Arena Competition</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="hiring" 
                      className="flex items-center gap-2 hover-scale"
                    >
                      <Building className="h-4 w-4" /> 
                      <span>Hiring Challenge</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. JavaScript Algorithm Challenge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the competition, tasks, and objectives" 
                          className="h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide clear details about what participants should expect
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="15" max="180" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Participants</FormLabel>
                        <FormControl>
                          <Input type="number" min="5" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {watchCategory === "hiring" && (
                  <div className="space-y-4 animate-fade-in">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="positions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Interview Positions</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="20" 
                              placeholder="How many top performers will get interviews?" 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Top performers will receive interview opportunities
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full hover-scale mt-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Competition"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateCompetition;
