import mongoose from "mongoose";

const PoliticSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    edad: {
      type: Number,
    },
    rol: {
      type: String,
      enum: [
        "Ministro",
        "Intendente",
        "Presidente",
        "Senador",
        "Vicepresidente",
      ],
      required: true,
    },
    partido_politico: {
      type: String,
      required: true,
    },
    sueldo: {
      type: Number,
    },
    fecha_ingreso: {
      type: Date,
      required: true,
    },
    rol_previo: {
      type: String,
    },
    comentarios: {
      type: String,
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    actives: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

PoliticSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

export const PoliticModel = mongoose.model("Politic", PoliticSchema);
