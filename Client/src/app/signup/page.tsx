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
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    role: z.enum(["Student", "Admin", "Uploader"]),
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .optional(),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .optional(),
    phone: z
      .string()
      .regex(/^\d{10}$/, {
        message: "Please enter a valid 10-digit phone number",
      })
      .optional(),
    yearOfJoining: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear())
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Student" && data.yearOfJoining === undefined) {
      ctx.addIssue({
        path: ["yearOfJoining"],
        message: "Year of Joining is required for Students",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type SignupRequest = {
  username: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  yearOfJoining: number;
};

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
      firstName: "",
      lastName: "",
      phone: "",
      yearOfJoining: new Date().getFullYear(),
    },
  });

  const signUpMutation = useSignUp();

  const onSignUpSubmit = async (data: SignupRequest) => {
    try {
      sessionStorage.setItem("signupEmail", data.email);
      const response = await signUpMutation.mutateAsync(data);
      console.log(response);
      router.push("/otp-verification");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold">Sign Up</h2>
        </CardHeader>
        <CardContent>
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
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
                        className="border p-2 rounded w-full"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select your role
                        </option>
                        <option value="Admin">Admin</option>
                        <option value="Uploader">Uploader</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <>
                <FormField
                  control={signUpForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your first name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Your phone number"
                        />
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
              <Button type="submit" className="w-full mt-4">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
