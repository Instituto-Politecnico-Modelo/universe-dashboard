"use client"
import CubeGrid from "@/components/CubeGrid";
import Floorplan from "@/components/Floorplan";
import OccupancyLineChart from "@/components/OccupancyLineChart";
import { useState } from "react";


export default function Home() {
  const [currentOccupancyData, setCurrentOccupancyData] = useState<Map<string, number>>(new Map([
    ["patio", 50],
    ["labo 1", 20],
    ["labo 2", 30],
  ]));
  return (
    <main className="flex min-h-screen justify-center flex-col items-center p-24">
      <div>
      <OccupancyLineChart data={currentOccupancyData} />
      <Floorplan data={currentOccupancyData} />
      </div>
       <CubeGrid width={3} height={3} depth={3}/>
    </main>
  );
}
