"use client";
// import { Metadata } from "next";
import Link from "next/link";
// import Image from "next/image";
import dynamic from "next/dynamic";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

import logo2 from "@/utils/logo2.png";
import logo from "@/utils/logo.png";

// export const metadata: Metadata = {
//   title: "Login - Campusify",
//   description: "Login to your Campusify account",
// };

const ClientSideImage = dynamic(() => import("next/image"), { ssr: false });

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This will run only on the client
  }, []);

  return (
    // Simplified background - white for light mode, black for dark mode
    <div className="min-h-screen w-full bg-white dark:bg-black">
      {/* Main container with responsive flex layout */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left section - hidden on mobile/tablet */}
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

        {/* Right section with login card - full width on mobile */}
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
              <form className="space-y-4" action="/api/auth/login">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      required
                      className="shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="dark:text-gray-200">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-secondary hover:underline hover:underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      required
                      className="shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-primary text-white shadow-md hover:bg-primary/80"
                  size="lg"
                >
                  Sign in
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                type="button"
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
              <p className="px-2 text-sm text-muted-foreground dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-secondary hover:underline hover:underline-offset-"
                >
                  Sign up
                </Link>
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
    </div>
  );
}
