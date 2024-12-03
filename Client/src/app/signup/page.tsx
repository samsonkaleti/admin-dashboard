"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignUp } from "../hooks/auth/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signUpSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    role: z.enum(["Student", "Admin", "Uploader"]),
    collegeName: z.string().min(1, { message: "College name is required" }).optional(),
    program: z.string().min(1, { message: "Program is required" }).optional(),
    specialization: z.string().min(1, { message: "Specialization is required" }).optional(),
    regulation: z.string().min(1, { message: "Regulation is required" }).optional(),
    yearOfJoining: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Student") {
      if (!data.yearOfJoining) {
        ctx.addIssue({
          path: ["yearOfJoining"],
          message: "Year of Joining is required for Students",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.collegeName) {
        ctx.addIssue({
          path: ["collegeName"],
          message: "College Name is required for Students",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.program) {
        ctx.addIssue({
          path: ["program"],
          message: "Program is required for Students",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.specialization) {
        ctx.addIssue({
          path: ["specialization"],
          message: "Specialization is required for Students",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.regulation) {
        ctx.addIssue({
          path: ["regulation"],
          message: "Regulation is required for Students",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type SignupRequest = {
  username: string;
  email: string;
  password: string;
  role: string;
  collegeName: string;
  program: string;
  specialization: string;
  regulation: string;
  yearOfJoining: number;
};

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "Student",
      collegeName: "",
      program: "",
      specialization: "",
      regulation: "",
      yearOfJoining: new Date().getFullYear(),
    },
  });

  const signUpMutation = useSignUp();

  const onSignUpSubmit = async (data: SignupRequest) => {
    try {
      sessionStorage.setItem("signupEmail", data.email);
      await signUpMutation.mutateAsync(data);
      router.push("/otp-verification");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold">Sign Up</h2>
        </CardHeader>
        <CardContent>
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signUpForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                        <option value="Uploader">Uploader</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isClient && signUpForm.watch("role") === "Student" && (
                <>
                  <FormField
                    control={signUpForm.control}
                    name="collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your college name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your program (e.g., Computer Science)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your specialization" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="regulation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regulation</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter regulation year (e.g., 2021)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="yearOfJoining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Joining</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Year of joining"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}