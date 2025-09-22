import mongoose from "mongoose";

const WishListsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      required: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collation: "wishlists",
  }
);


WishListsSchema.index({user_id:1,service_id:1},{unique:true});

export default mongoose.model('wishlists',WishListsSchema);