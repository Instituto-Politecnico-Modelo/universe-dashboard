import Link from 'next/link';
import { UserForm } from '@/components/UserForm';
import { signIn } from '@/app/auth';
import { Button } from 'primereact/button';

async function login(formData: FormData) {
  'use server';
  let emailA = formData.get('email') as string;
  let passwordA = formData.get('password') as string;
  if(!emailA || !passwordA) {
    throw new Error('Se requiere el email y contraseña');
  }
  await signIn('credentials', {
    redirectTo: '/protected',
    email: emailA,
    password: passwordA,
  });

}


export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-gray px-4 py-6 pt-8 text-center sm:px-16">
          <h2 className="text-xl font-semibold">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500">
            Usa tu correo y contraseña para iniciar sesión
          </p>
        </div>
        <UserForm
          action={login}
        >
          <Button className='py-1' label='Iniciar Sesión'></Button>
          <p className="text-center text-sm text-gray-600">
            {"No tienes una cuenta? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Registrarse
            </Link>
            {' gratis.'}
          </p>
        </UserForm>
      </div>
    </div>
  );
}
