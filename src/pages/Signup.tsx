
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Define schemas for different user roles
const studentSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  skills: z.array(z.string()).optional(),
  schoolName: z.string().min(1, { message: "School/College name is required." }),
});

const recruiterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  linkedInProfile: z.string().url({ message: "Please enter a valid LinkedIn URL." }),
  organizationName: z.string().min(1, { message: "Organization name is required." }),
});

const adminSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  adminCode: z.string().min(6, { message: "Admin code must be at least 6 characters." }),
});

const organizations = [
  "Google", 
  "Meta", 
  "Amazon", 
  "Microsoft", 
  "Apple", 
  "Infosys", 
  "TCS", 
  "Wipro",
  "IBM",
  "Oracle",
  "Other"
];

const Signup = () => {
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  
  // Student form
  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      skills: [],
      schoolName: "",
    },
  });

  // Recruiter form
  const recruiterForm = useForm<z.infer<typeof recruiterSchema>>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      linkedInProfile: "",
      organizationName: "",
    },
  });

  // Admin form
  const adminForm = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "",
      password: "",
      adminCode: "",
    },
  });
  
  const handleSubmit = (data: any) => {
    setIsLoading(true);
    console.log("Form submitted:", { role, data });
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 1500);
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        const newSkills = [...skills, skillInput.trim()];
        setSkills(newSkills);
        studentForm.setValue('skills', newSkills);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkills = skills.filter(s => s !== skill);
    setSkills(newSkills);
    studentForm.setValue('skills', newSkills);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="mb-6 flex items-center gap-2 animate-fade-in">
        <Code className="h-8 w-8 text-primary" />
        <span className="font-bold text-xl">CodeKids</span>
      </div>
      
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Start your coding journey with us!</CardDescription>
        </CardHeader>

        <Tabs 
          value={role} 
          onValueChange={setRole} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="student" className="hover-scale">Student</TabsTrigger>
            <TabsTrigger value="recruiter" className="hover-scale">Recruiter</TabsTrigger>
            <TabsTrigger value="admin" className="hover-scale">Admin</TabsTrigger>
          </TabsList>

          {/* Student Signup Form */}
          <TabsContent value="student">
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={studentForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={studentForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={studentForm.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="Type a skill and press Enter (e.g. JavaScript, Python)"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={handleAddSkill}
                            />
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="animate-scale-in">
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="ml-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={studentForm.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School/College Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your school or college name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={studentForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          At least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full hover-scale" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up as Student"}
                  </Button>
                  <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover-underline">
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>

          {/* Recruiter Signup Form */}
          <TabsContent value="recruiter">
            <Form {...recruiterForm}>
              <form onSubmit={recruiterForm.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={recruiterForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={recruiterForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={recruiterForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={recruiterForm.control}
                    name="linkedInProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={recruiterForm.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org} value={org}>{org}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={recruiterForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          At least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full hover-scale" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up as Recruiter"}
                  </Button>
                  <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover-underline">
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>

          {/* Admin Signup Form */}
          <TabsContent value="admin">
            <Form {...adminForm}>
              <form onSubmit={adminForm.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@codekids.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="adminCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Code</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter secure admin code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          At least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full hover-scale" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up as Administrator"}
                  </Button>
                  <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover-underline">
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Signup;
