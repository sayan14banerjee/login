'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string()
    .min(3, 'Password must be at least 3 characters')
    .max(9, 'Password must not exceed 9 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,9}$/, 
      'Password must contain uppercase, lowercase, number and special character')
})

type PasswordCriteria = {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function LoginForm() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    minLength: false,
    maxLength: true,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  })
  const [showCriteria, setShowCriteria] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const password = form.watch('password')

  useEffect(() => {
    if (password) {
      setShowCriteria(true)
      setPasswordCriteria({
        minLength: password.length >= 3,
        maxLength: password.length <= 9,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[@$!%*?&]/.test(password)
      })
    } else {
      setShowCriteria(false)
    }
  }, [password])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username === 'koushik123' && values.password === 'Koushik@123') {
      setShowSuccessModal(true)
    } else {
      setShowErrorModal(true)
    }
  }

  const CriteriaIcon = ({ met }: { met: boolean }) => 
    met ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                {showCriteria && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <CriteriaIcon met={passwordCriteria.minLength} />
                      <span>At least 3 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CriteriaIcon met={passwordCriteria.maxLength} />
                      <span>No more than 9 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CriteriaIcon met={passwordCriteria.hasUppercase} />
                      <span>Contains uppercase letter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CriteriaIcon met={passwordCriteria.hasLowercase} />
                      <span>Contains lowercase letter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CriteriaIcon met={passwordCriteria.hasNumber} />
                      <span>Contains number</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CriteriaIcon met={passwordCriteria.hasSpecialChar} />
                      <span>Contains special character</span>
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Form>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Successful</DialogTitle>
          </DialogHeader>
          <p>You have successfully logged in!</p>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Failed</DialogTitle>
          </DialogHeader>
          <p>Invalid username or password. Please try again.</p>
          <DialogFooter>
            <Button onClick={() => setShowErrorModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

