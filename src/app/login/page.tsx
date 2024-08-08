import Link from 'next/link';
import { UserForm } from '@/components/UserForm';
import { signIn } from '@/app/auth';
import { Button } from 'primereact/button';
        

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-gray px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Log In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to log in
          </p>
        </div>
        <UserForm
          action={async (formData: FormData) => {
            'use server';
            await signIn('credentials', {
              redirectTo: '/protected',
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            });
          }}
        >
          <Button className='py-1' label='Log in'></Button>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {' for free.'}
          </p>
        </UserForm>
      </div>
    </div>
  );
}
