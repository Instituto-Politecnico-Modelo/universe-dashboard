import { createContext, useContext, useState } from 'react';

type OccupancyDataContextType = {
    occupancyData: OccupancyData[];
    updateOccupancyData: (newData: OccupancyData[]) => void;
    getAllCurrentOccupancyData: () => OccupancyData[];
    getAllDataForLocation: (location: string) => OccupancyData[];
};

const OccupancyDataContext = createContext<OccupancyDataContextType>({
    occupancyData: [],
    updateOccupancyData: () => {},
    getAllCurrentOccupancyData: () => [],
    getAllDataForLocation: () => [],
});

export const useOccupancyData = () => useContext(OccupancyDataContext);

export function OccupancyDataProvider({ children }: { children: React.ReactNode }) {
    const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);

    const updateOccupancyData = (newData: OccupancyData[]) => {
        if (newData) setOccupancyData((prevData) => [...newData, ...prevData]);
    };

    const getAllCurrentOccupancyData = () => {
        // get latest occupancy data for each location
        const latestData: { [key: string]: OccupancyData } = {};
        occupancyData.forEach((data) => {
            if (!latestData[data.location] || latestData[data.location].timestamp < data.timestamp) {
                latestData[data.location] = data;
            }
        });

        return Object.values(latestData);
    };

    const getAllDataForLocation = (location: string) => {
        return occupancyData.filter((data) => data.location === location);
    };

    return (
        <OccupancyDataContext.Provider
            value={{ occupancyData, updateOccupancyData, getAllCurrentOccupancyData, getAllDataForLocation }}
        >
            {children}
        </OccupancyDataContext.Provider>
    );
}
