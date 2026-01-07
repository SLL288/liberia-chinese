import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role?: string | null;
      name?: string | null;
      email?: string | null;
    };
  }
}
