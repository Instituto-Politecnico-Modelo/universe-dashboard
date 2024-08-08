'use client';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import React, { useState } from "react";


export function UserForm({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<string>('');
  const [value2, setValue2] = useState<string>('');

  return (
    <form
      action={action}
      className="flex flex-col space-y-4 dark:bg-gray-100 px-4 py-8 sm:px-16"
    >
      <div className='py-1'>
        <FloatLabel>
          <label
            htmlFor="email"
            className="block text-xs text-gray-600 uppercase"
          >
            Email Address
          </label>
          <InputText 
            value={value} onChange={(e) => setValue(e.target.value)}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </FloatLabel>
      </div>
      <div className='py-1'>
        <FloatLabel>
          <label
            htmlFor="password"
            className="block text-xs text-gray-600 uppercase"
          >
            Password
          </label>
          <InputText 
            value={value2} onChange={(e2) => setValue2(e2.target.value)}
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </FloatLabel>
      </div>
      {children}
    </form>
  );
}
