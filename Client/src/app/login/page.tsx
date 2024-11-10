"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import logo2 from "@/utils/logo2.png"
import logo from "@/utils/logo.png"
import { useSignUp, useVerifyOTP, useCompleteProfileMutation, useLogin } from "../hooks/auth/useAuth"
import { useRouter } from "next/navigation"
type SignupRequest = {
  username: string;
  email: string;
  password: string;
  role: string;
  yearOfJoining: any;
};

type OtpVerificationRequest = {
  email: string;
  otp: string;
};

type LoginRequest = {
  email: string;
  password: string;
};


const ClientSideImage = dynamic(() => import("next/image"), { ssr: false })

const queryClient = new QueryClient()

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const signUpSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  role: z.enum(["Student", "Admin", "Uploader"], { required_error: "Please select a role" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  yearOfJoining: z.number().int().min(1900, { message: "Invalid year" }).max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
})

const otpVerificationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().length(6, { message: "OTP must be 6 characters" }).regex(/^[a-zA-Z0-9]{6}$/, { message: "OTP must be 6 alphanumeric characters" }),
})

const completeProfileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
})

function LoginPageContent() {
  const [isClient, setIsClient] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isOtpVerificationOpen, setIsOtpVerificationOpen] = useState(false)
  const [signUpEmail, setSignUpEmail] = useState("")
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false)
  const [collegeRegulations, setCollegeRegulations] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      role: "",
      email: "",
      password: "",
      yearOfJoining: new Date().getFullYear(),
    },
  })

  const otpVerificationForm = useForm({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  })

  const completeProfileForm = useForm({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const signUpMutation = useSignUp()
  const verifyOtpMutation = useVerifyOTP()
  const completeProfileMutation = useCompleteProfileMutation()
  const loginMutation = useLogin()

  const onSignInSubmit = async (data: LoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(data)
      console.log("Login successful:", response)
      // Store the token in localStorage or a secure cookie
      sessionStorage.setItem('auth_token', response.token)
      // Redirect to dashboard or home page
      router.push('/')
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid credentials. Please try again.")
    }
  }

  const onSignUpSubmit = (data: SignupRequest) => {
    signUpMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Signup successful:", response)
        setSignUpEmail(data.email)
        setIsSignUpOpen(false)
        if (data.role === "Student") {
          setIsOtpVerificationOpen(true)
        }
      },
      onError: (error) => {
        console.error("Signup error:", error)
        // Handle error (e.g., show error message to user)
      },
    })
  }

  const onOtpVerificationSubmit = (data: OtpVerificationRequest) => {
    verifyOtpMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("OTP verification successful:", response)
        setIsOtpVerificationOpen(false)
        // Handle successful verification (e.g., show success message, redirect to login)
      },
      onError: (error) => {
        console.error("OTP verification error:", error)
        // Handle error (e.g., show error message to user)
      },
    })
  }

  const onCompleteProfileSubmit = (data: any) => {
    completeProfileMutation.mutate({ ...data, email: signUpEmail }, {
      onSuccess: (response) => {
        console.log("Profile completion successful:", response)
        setIsCompleteProfileOpen(false)
        // Handle successful profile completion (e.g., redirect to dashboard)
      },
      onError: (error) => {
        console.error("Profile completion error:", error)
        // Handle error (e.g., show error message to user)
      },
    })
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:p-8 lg:w-1/2">
          <div className="relative h-64 w-full">
            {isClient && (
              <ClientSideImage
                src={logo2}
                alt="Campusify Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            )}
          </div>
          <h2 className="mt-8 max-w-xl text-center text-3xl font-bold leading-tight text-gray-700 dark:text-gray-200">
            Transform Your Campus Operations with Campusify
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center p-4 w-full lg:w-1/2">
          <Card className="w-full max-w-[400px] shadow-xl border-0 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-16 w-32">
                  <ClientSideImage
                    src={logo}
                    alt="Campusify"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
                    Welcome back
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base dark:text-gray-400">
                    Enter your credentials to sign in to your account
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className="shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-secondary hover:underline hover:underline-offset-4"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            className="shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary text-white shadow-md hover:bg-primary/80"
                    size="lg"
                  >
                    Sign in
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
              <p className="px-2 text-sm text-muted-foreground dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 text-secondary hover:underline hover:underline-offset-4">
                      Sign up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create an account</DialogTitle>
                      <DialogDescription>
                        Fill in the details below to create your account.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="johndoe" />
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Student">Student</SelectItem>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Uploader">Uploader</SelectItem>
                                </SelectContent>
                              </Select>
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
                                <Input {...field} type="email" placeholder="john@example.com" />
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
                                <Input {...field} type="password" />
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
                                <Input {...field} type="number" placeholder="2023" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
                          {signUpMutation.isPending ? "Creating account..." : "Create account"}
                        </Button>
                      </form>
                    </Form>
                    {signUpMutation.isError && (
                      <p className="text-red-500 text-sm mt-2">Error creating account. Please try again.</p>
                    )}
                  </DialogContent>
                </Dialog>
              </p>
              <p className="px-2 text-xs text-muted-foreground dark:text-gray-400">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={isOtpVerificationOpen} onOpenChange={setIsOtpVerificationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to your email to complete the registration process.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpVerificationForm}>
            <form onSubmit={otpVerificationForm.handleSubmit(onOtpVerificationSubmit)} className="space-y-4">
              <FormField
                control={otpVerificationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="john@example.com" defaultValue={signUpEmail} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={otpVerificationForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter 6-character OTP" maxLength={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={verifyOtpMutation.isPending}>
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </Form>
          {verifyOtpMutation.isError && (
            <p className="text-red-500 text-sm mt-2">Error verifying OTP. Please try again.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteProfileOpen} onOpenChange={setIsCompleteProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please provide the following information to complete your profile.
            </DialogDescription>
          </DialogHeader>
          <Form {...completeProfileForm}>
            <form onSubmit={completeProfileForm.handleSubmit(onCompleteProfileSubmit)} className="space-y-4">
              <FormField
                control={completeProfileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={completeProfileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={completeProfileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1234567890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {collegeRegulations && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">College Regulations:</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{collegeRegulations}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={completeProfileMutation.isPending}>
                {completeProfileMutation.isPending ? "Completing Profile..." : "Complete Profile"}
              </Button>
            </form>
          </Form>
          {completeProfileMutation.isError && (
            <p className="text-red-500 text-sm mt-2">Error completing profile. Please try again.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function LoginPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginPageContent />
    </QueryClientProvider>
  )
}