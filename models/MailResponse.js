import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    email: {
        type: String,
    },
    contact: {
        type: String,
    },
    success: {
        type: Boolean,
    },
    ref: {
        type: String,
        default: null
    }
}, {timestamps: true});

const MailResponse = mongoose.model('mailresponse', dataSchema);

export { MailResponse };