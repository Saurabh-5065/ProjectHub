import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, data, {
        withCredentials: true, // 
      });
      setSuccessMessage('Account created successfully!');
      reset();
    } catch (error: any) {
      console.error('Axios error:', error);
      const message = error?.response?.data?.message || 'Something went wrong!';
      setServerError(message);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto mt-12 p-8 border rounded-lg shadow-md space-y-6 bg-white dark:bg-card">
      <div className="text-center text-sm text-muted-foreground pt-4">
        <button
          onClick={() => navigate('/landing')}
          className="absolute left-4 top-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
      </div>

      <h2 className="text-3xl font-semibold text-center">Create an Account</h2>

      {serverError && (
        <p className="text-red-600 text-sm text-center">{serverError}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm text-center">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <div>
          <Label htmlFor="name" className="mb-2 block">
            Name
          </Label>
          <Input id="name" placeholder="John Doe" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="username" className="mb-2 block">
            Username
          </Label>
          <Input
            id="username"
            placeholder="johndoe"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-2 block">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full text-base py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground pt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
