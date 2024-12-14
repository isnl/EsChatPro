import mongoose from "mongoose";
const dynamicRouteSchema = new mongoose.Schema(
  {
    routes: Object,
    role: Number,
  },
  {
    versionKey: false,
  }
);
export default mongoose.model("dynamic_routes", dynamicRouteSchema);
