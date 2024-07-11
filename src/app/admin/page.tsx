import React from "react";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import * as Form from '@radix-ui/react-form';
import { any } from "three/examples/jsm/nodes/Nodes.js";
import { get } from "http";
import { Api } from "@/services/api";
import CameraTable  from "@/components/CameraTable";
import CameraForm from "@/components/CameraForm";
import { authOptions } from "@/app/auth/[...nextauth]/route";

async function Dashboard() {
  const camaras = [];
  const sessionData = await getServerSession(authOptions);
  sessionData.status === "unauthenticated" && redirect("/login");
  console.log(sessionData);
  
  const { data: session }: { data: Session | null} = sessionData;
  return (<>
    {sessionData.status === "loading" && <p>Loading...</p>}
    {sessionData.status === "authenticated" && (
      <p>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DashBoard</span>
            </a>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button onClick={() => {signOut();}} type="button" className="text-white bg-teal-600 hover:bg-teal-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
                <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                  </svg>
              </button>
            </div>
          </div>
        </nav>
        <h1 className="text-[15px] font-semibold ml-2 text-[35px] mt-3 font-medium leading-[35px] text-black">Camaras</h1>
      <CameraForm />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <CameraTable />
      </div>
    </p>)}
  </>);
};
export default Dashboard;
