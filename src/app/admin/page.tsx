"use client"
import React from "react";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import * as Form from '@radix-ui/react-form';
import { any } from "three/examples/jsm/nodes/Nodes.js";
import { get } from "http";
import { Api } from "@/services/api";

function Dashboard() {
  const camaras = [];
  const sessionData = useSession();
  sessionData.status === "unauthenticated" && redirect("/login");
  console.log(sessionData);
  const api = new Api();
  

  function getCameras(){
    fetch('http://localhost:8080/api/v1/camaras')
    .then(response => response.json())
    .then((data : any[]) => {
      let table = '<table><tr><th>Nombre</th><th>Url</th><th>Ubicacion</th><th>Threshold</th></tr>';
      data.forEach(camara => {
          camaras.push(camara);
          console.log(camara);
          table += '<tr><td>' + camara.name + '</td><td>' + camara.url + '</td><td>' + camara.location + '</td><td>'+ camara.threshold+ '</td><td> <button onclick=deleteCamara(' + '"'+ camara.name.replace(/\s+/g, '') + '"' + ')>Eliminar</button> </td></tr>';
      });
      table += '</table>';
      document.body.innerHTML += table;
    });
  }

   const addCamera = async (e: any) =>{
    fetch('http://localhost:8080/api/v1/camara', {
      method: 'POST',
      headers: {
          "Accept": "*/*"
      },
      body: JSON.stringify({name : e.target[0].value, location : e.target[1].value, url: e.target[2].value, threshold : e.target[3].value}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }
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
        <form onSubmit={addCamera}>
          <div className="grid gap-6 mb-6 md:grid-cols-2 p-3">
              <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                  <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div>
                  <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL</label>
                  <input type="text" id="url" name="url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div>
                  <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                  <input type="text" id="location" name="location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>  
              <div>
                  <label htmlFor="threshold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Threshold</label>
                  <input type="number" id="threshold" name="threshold" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
          </div>
          <button type="submit" className="ml-3 text-white bg-teal-600 hover:bg-teal-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        URL
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Location
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Threshold
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Delete</span>
                    </th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
      </div>
    </p>)}
  </>);
};
export default Dashboard;
