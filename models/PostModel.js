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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails"
    }
  },
  { timestamps: true }
);

const PostDetails = mongoose.model('PostDetails', postSchema);

export default PostDetails;
