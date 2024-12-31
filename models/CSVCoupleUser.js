import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    husband_name: {
        type: String,
    },
    wife_name: {
        type: String,
    },
    email: {
        type: String,
    },
    contact: {
        type: String
    },
    marriagedate: {
        type: String
    },
    date_month:{
        type: String
    },
    ref: {
        type: String,
    }
});

const CSVCoupleUsers = mongoose.model('CSVCoupleUsers', dataSchema);

export { CSVCoupleUsers };