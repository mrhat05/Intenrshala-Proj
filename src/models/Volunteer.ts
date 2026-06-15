import { model, models, Schema } from "mongoose";

const volunteerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    areaOfInterest: { type: String, required: true },
    availability: { type: String, required: true },
    motivation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

volunteerSchema.index({ email: 1, areaOfInterest: 1 }, { unique: true });

export const Volunteer = models.Volunteer || model("Volunteer", volunteerSchema);
