import { createContext, useContext, useState } from 'react';

type OccupancyDataContextType = {
    occupancyData: OccupancyBatch[];
    updateOccupancyData: (newData: OccupancyBatch[]) => void;
    getAllCurrentOccupancyData: () => OccupancyBatch;
    getAllDataForLocation: (location: string) => OccupancyData[];
    setOccupancyData: (data: OccupancyBatch[]) => void;
    selectedBatch: OccupancyBatch | undefined;
    setSelectedBatch: (data: OccupancyBatch | undefined) => void;
};

const OccupancyDataContext = createContext<OccupancyDataContextType>({
    occupancyData: [],
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
            }}
        >
            {children}
        </OccupancyDataContext.Provider>
    );
}
