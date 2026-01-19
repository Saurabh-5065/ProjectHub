// components/auth/LoginForm.tsx

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const formSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(formSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginData) => {
    setServerError(null);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.accessToken);
        setIsAuthenticated(true); // 
        navigate('/dashboard'); // 
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Something went wrong';
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

      <h2 className="text-3xl font-semibold text-center">
        Login to Your Account
      </h2>

      {serverError && (
        <p className="text-red-600 text-sm text-center">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
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
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground pt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Signup
        </Link>
      </div>
    </div>
  );
}
