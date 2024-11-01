interface Batch {
    _id: string;
    personas: number;
    personas_1p: number;
    personas_pb: number;
    timestamp: Date;
}

interface OccupancyBatch extends Batch {
    data: OccupancyData[];
}
