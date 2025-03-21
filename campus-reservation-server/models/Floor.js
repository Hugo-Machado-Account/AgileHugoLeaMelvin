const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema(
  {
    floorNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    elements: [
      {
        id: String,
        name: String,
        type: {
          type: String,
          enum: ["room", "corridor", "stairs"],
          required: true,
        },
        status: {
          type: String,
          enum: ["available", "reserved"],
          default: "available",
        },
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        capacity: Number,
        equipments: [String],
        roomType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Floor", floorSchema);
