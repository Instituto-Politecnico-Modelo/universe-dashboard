interface Snapshot {
    _id: string
    filename: string;
    timeStamp: Date;
    camera_id: string;
    personas: number;
}
/*
const snapSchema = new MongoClient.Schema({
    _id: {type: Schema.Types.ObjectId, required: true}, 
    filename: { type: String, required: true },
    timeStamp: { type: Date, required: true },
    camera_id: { type: Schema.Types.ObjectId, required: true },
    personas: { type: Number, required: false },
});

const SnapModel = mongoose.model('snapshots', snapSchema);

*/