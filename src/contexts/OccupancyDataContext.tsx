import { TypesData } from "@/services/dataApi";
import { createContext, useContext, useState } from "react";


type OccupancyDataContextType = {
    occupancyData: TypesData[];
    updateOccupancyData: (newData: TypesData[]) => void;    
    getAllCurrentOccupancyData: () => TypesData[];
    getAllDataForLocation: (location: string) => TypesData[];
}


const OccupancyDataContext = createContext<OccupancyDataContextType>({
    occupancyData: [],
    updateOccupancyData: () => {},
    getAllCurrentOccupancyData: () => [],
    getAllDataForLocation: () => [],
});

export const useOccupancyData = () => useContext(OccupancyDataContext);

export function OccupancyDataProvider({ children }: { children: React.ReactNode }) {
    const [occupancyData, setOccupancyData] = useState<TypesData[]>([]);
    
    const updateOccupancyData = (newData: TypesData[]) => {
        if (newData) setOccupancyData((prevData) => [...prevData, ...newData]);
    }

    const getAllCurrentOccupancyData  = () => {
        // get latest occupancy data for each location
        const latestData: { [key: string]: TypesData } = {};
        occupancyData.forEach((data) => {
            if (!latestData[data.location] || latestData[data.location].time < data.time) {
                latestData[data.location] = data;
            }
        });

        return Object.values(latestData);
    }
    
    const getAllDataForLocation = (location: string) => {
        return occupancyData.filter((data) => data.location === location);
    }

    return (
        <OccupancyDataContext.Provider value={{occupancyData, updateOccupancyData, getAllCurrentOccupancyData, getAllDataForLocation}}>
            {children}
        </OccupancyDataContext.Provider>
    );
}