'use server';
import { auth, signOut } from '@/app/auth';
import { Button } from 'primereact/button';
import TablaPrime from "@/components/TablaPrime";
import { PrimeReactProvider } from 'primereact/api';
import { getUserAction } from '@/actions/userActions';
import { redirect } from 'next/dist/server/api-utils';
import UserTable from '@/components/UserTable';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';

const pag = (
<div className='h-screen w-screen'>
  <div className='flex items-center justify-center h-full w-full'>
    <div className='flex flex-col items-center space-y-3'>
      <h2 className='text-xl font-semibold'>Usuario no autorizado</h2>
      <p className='text-sm text-gray-500'>Espera a que un administrador te autorize</p>
    </div>
  </div>
</div>
)

export default async function ProtectedPage() {
  let session = await auth();
  let email = session?.user?.email;
  if(!email) {
    return null;
  }
  let user = await getUserAction(email);
  if(!user) {
    return null;
  }
  if(user.role != "authorized") return pag;
  return (
     <div className='scrollable-container'>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DashBoard</span>
            </a>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                  <span className="sr-only">Abrir menu principal</span>
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                  </svg>
              </button>
            </div>
          </div>
        </nav>
        <h1 className="text-[15px] font-semibold ml-2 text-[35px] mt-3 font-medium leading-[35px] text-white p-2">Dashboard</h1>
      <div className="card">
        <TabView>
          <TabPanel header="Camaras">
            <TablaPrime />
          </TabPanel>
          <TabPanel header="Usuarios">
            <UserTable />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}
function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
