interface Batch {
    _id: string;
    timestamp: Date;
}

interface OccupancyBatch extends Batch {
    data: OccupancyData[];
}
