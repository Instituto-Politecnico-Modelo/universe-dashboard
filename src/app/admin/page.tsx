"use client"
import React from "react";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

function Dashboard() {
  const sessionData = useSession();
  sessionData.status === "unauthenticated" && redirect("/login");
  console.log(sessionData);
  const { data: session }: { data: Session | null} = sessionData;
  return (<>
    <h1>Dashboard</h1>
    {sessionData.status === "loading" && <p>Loading...</p>}
    {sessionData.status === "authenticated" && (
      <p>Welcome, {session?.user?.email}</p>)}
  </>);
};

export default Dashboard;
