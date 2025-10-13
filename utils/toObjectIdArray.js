import mongoose from "mongoose";

export function toObjectIdArray(ids = []) {
  return ids.map((id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    return id;
  });
}
