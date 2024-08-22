interface Batch {
    _id: string;
    threshold: number;
}

interface OccupancyBatch extends Batch {
    data: OccupancyData[];
}
