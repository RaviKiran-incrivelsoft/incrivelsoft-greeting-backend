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

// Middleware to delete related csvData before removing a BirthDaysGreetings document
dataSchema.pre('findOneAndDelete', async function (next) {
    const docToDelete = await this.model.findOne(this.getFilter());
    if (docToDelete && docToDelete.csvData.length > 0) {
        await mongoose.model('CSVCoupleUsers').deleteMany({ _id: { $in: docToDelete.csvData } });
    }
    next();
})

const CSVCoupleUsers = mongoose.model('CSVCoupleUsers', dataSchema);

export { CSVCoupleUsers };