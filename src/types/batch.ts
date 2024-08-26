interface Batch {
    _id: string;
    personas: number;
    timestamp: Date;
}

interface OccupancyBatch extends Batch {
    data: OccupancyData[];
}
