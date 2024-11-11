'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useVerifyOTP } from '../hooks/auth/useAuth'

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 characters long' }),
})

type OtpVerificationRequest = {
  otp: string
}

const OtpVerification = () => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const verifyOtpMutation = useVerifyOTP()

  const form = useForm<OtpVerificationRequest>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = async (data: OtpVerificationRequest) => {
    try {
      await verifyOtpMutation.mutateAsync({ otp: data.otp })
      router.push('/login')
    } catch (error) {
      setError('OTP verification failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter 6-digit OTP" maxLength={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={verifyOtpMutation.isPending}>
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </Form>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" onClick={() => router.push('/signup')}>
            Didn't receive the code? Sign up again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OtpVerification
