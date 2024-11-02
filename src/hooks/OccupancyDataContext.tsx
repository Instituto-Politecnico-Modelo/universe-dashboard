import { createContext, useContext, useState } from 'react';

type OccupancyDataContextType = {
    occupancyData: OccupancyBatch[];
    maxOccupancy: number;
    updateOccupancyData: (newData: OccupancyBatch[]) => void;
    getAllCurrentOccupancyData: () => OccupancyBatch;
    getAllDataForLocation: (location: string) => OccupancyData[];
    setOccupancyData: (data: OccupancyBatch[]) => void;
    selectedBatch: OccupancyBatch | undefined;
    setSelectedBatch: (data: OccupancyBatch | undefined) => void;
    setMaxOccupancy: (max: number) => void;
};

const OccupancyDataContext = createContext<OccupancyDataContextType>({
    occupancyData: [],
    maxOccupancy: 0,
    setMaxOccupancy: () => {},
    updateOccupancyData: () => {},
    getAllCurrentOccupancyData: () => ({}) as OccupancyBatch,
    getAllDataForLocation: () => [],
    setOccupancyData: () => {},
    setSelectedBatch: () => {},
    selectedBatch: {} as OccupancyBatch,
});

export const useOccupancyData = () => useContext(OccupancyDataContext);

export function OccupancyDataProvider({ children }: { children: React.ReactNode }) {
    const [occupancyData, setOccupancyData] = useState<OccupancyBatch[]>([]);
    const [selectedData, setSelectedData] = useState<OccupancyBatch | undefined>(undefined);
    const [maxOccupancy, setMaxOccupancy] = useState<number>(0);

    const updateOccupancyData = (newData: OccupancyBatch[]) => {
        if (newData) setOccupancyData((prevData) => [...newData, ...prevData]);
    };

    const getAllCurrentOccupancyData = () => {
        // top batch of array
        if (occupancyData.length === 0) return { _id: '', data: [] as OccupancyData[] } as OccupancyBatch;
        return occupancyData[0];
    };

    const getAllDataForLocation = (location: string): OccupancyData[] => {
        // for each data in every batch, filter by location
        return occupancyData.map(({ data }) => data.find((d) => d.location === location) || ({} as OccupancyData));
    };

    return (
        <OccupancyDataContext.Provider
            value={{
                occupancyData,
                updateOccupancyData,
                getAllCurrentOccupancyData,
                getAllDataForLocation,
                setOccupancyData,
                selectedBatch: selectedData,
                setSelectedBatch: setSelectedData,
                setMaxOccupancy,
                maxOccupancy,
            }}
        >
            {children}
        </OccupancyDataContext.Provider>
    );
}
