import { Button } from 'primereact/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserForm } from '@/components/UserForm';
import { signIn } from '@/app/auth';
import { createUserAction, getUserAction} from '@/actions/userActions';

export default function Login() {
  async function register(formData: FormData) {
    'use server';
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;
    console.log(1);
    let user = await getUserAction(email);
    if (user !== null) {
      return 'User already exists'; // TODO: Handle errors with useFormStatus
    } else {
      console.log(2);
      await createUserAction(email, password);
      redirect('/login');
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
       <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-gray px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Registrarse</h3>
          <p className="text-sm text-gray-500">
            Crear una cuenta con tu correo y contraseña
          </p>
        </div>
        <UserForm action={register}>
        <Button className='py-1' label='Registrarse'></Button>
          <p className="text-center text-sm text-gray-600">
            {'Ya tienes una cuenta? '}
            <Link href="/login" className="font-semibold text-gray-800">
              Iniciar sesión
            </Link>
          </p>
        </UserForm>
      </div>
    </div>
  );
}
