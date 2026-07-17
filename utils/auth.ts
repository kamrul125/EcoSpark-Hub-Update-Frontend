import { z } from 'zod';

export const DEMO_CREDENTIALS = {
  admin: {
    // matches backend seed.js / src/seed.ts
    email: 'admin@gmail.com',
    password: 'admin123456',
  },
  user: {
    // demo user; if not present the frontend will attempt to register it before login
    email: 'demo.user@example.com',
    password: 'DemoUser123!',
  },
} as const;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(80, 'Full name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
