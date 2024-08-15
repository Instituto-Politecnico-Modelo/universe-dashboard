interface OccupancyData {
    _id: string
    camera_id: string;
    timeStamp: Date;
    personas: number;
    location: string;
    threshold: number;
}