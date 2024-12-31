import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    postName: {
      type: String,
      required: true,
    },
    postDescription: {
      type: String,
      required: true
    },
    mediaURL: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: 'active',
    },
    type: {
      type: String,
      enum: ["birthday", "festival", "anniversary", "event", "occasion", "temple"],
      required: true,
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      default: null,
    }
  },
  { timestamps: true }
);

const PostDetails = mongoose.model('PostDetails', postSchema);

export default PostDetails;
