import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
    },
    contact: {
        type: String,
    },
    birthdate: {
        type: String,
        default: null,
    },
    date_month: {
        type: String,
        default: null,
    },
    ref: {
        type: String,
        default: null
    }
});

const CSVUsers = mongoose.model('CSVUsers', dataSchema);

export { CSVUsers };