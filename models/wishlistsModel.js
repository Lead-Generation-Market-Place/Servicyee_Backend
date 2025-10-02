import mongoose from "mongoose";

const WishListsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "wishlists",
  }
);


WishListsSchema.index({user_id:1,service_id:1},{unique:true});

export default mongoose.model('wishlists',WishListsSchema);