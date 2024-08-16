'use client';
import { Api } from "@/services/api";
import { constants } from "@/utils/constants";
import { FormEvent } from "react";

export default function CameraForm(){
    const api = new Api();
    api.baseUrl = "/api/v1";
    
    async function addCamera(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = api.camara.camaraCreate({
                name: formData.get("name") as string,
                location: formData.get("location") as string,
                url: formData.get("url") as string,
                threshold: Number(formData.get("threshold")),
                id: ""
            });

            const data = await response;
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
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
    );
}