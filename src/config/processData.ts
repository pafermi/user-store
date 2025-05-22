import fs from "fs";
import path from "path"; // Solo una importación de 'path'
import { PoliticModel } from "../data/mongo/models/politic.model"; // Asegúrate de importar tu modelo Politic
import { fileURLToPath } from "url";

// Reemplaza __dirname con esta línea
// const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Esto reemplaza __dirname
const uploadsDir = path.join(__dirname, "../uploads");

// Función para leer y procesar los archivos JSON
export const processData = async () => {
  console.log("iniciando formateo");
  try {
    // Lee todos los archivos de la carpeta uploads
    const files = fs.readdirSync(uploadsDir);

    // Filtra solo los archivos JSON
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // Procesa cada archivo JSON
    for (const file of jsonFiles) {
      const filePath = path.join(uploadsDir, file);

      // Lee el contenido del archivo
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Normaliza los roles según el comienzo de la palabra
      const formattedData = data.map((item:any) => {
        // Normaliza el rol según el comienzo
        let normalizedRol = item.rol;

        if (normalizedRol.startsWith("Intend")) {
          normalizedRol = "Intendente"; // Normaliza todos los "Intend" a "Intendente"
        } else if (normalizedRol.startsWith("Presid")) {
          normalizedRol = "Presidente"; // Normaliza todos los "Presid" a "Presidente"
        } else if (normalizedRol.startsWith("Ministr")) {
          normalizedRol = "Ministro"; // Normaliza todos los "Ministr" a "Ministro"
        } else if (normalizedRol.startsWith("Vicepresid")) {
          normalizedRol = "Vicepresidente"; // Normaliza todos los "Vicepresid" a "Vicepresidente"
        } else if (normalizedRol.startsWith("Senador")) {
          normalizedRol = "Senador"; // Normaliza todos los "Vicepresid" a "Vicepresidente"
        }

        // Validar la edad, si es 0, la convierte en undefined
        const edad = item.edad === 0 ? undefined : item.edad;

        // Validar los comentarios, si es "nada", lo convierte en undefined
        const comentarios =
          item.comentarios === "nada" ? undefined : item.comentarios;

        return {
          nombre: item.nombre,
          apellido: item.apellido,
          edad: edad, // Edad validada
          rol: normalizedRol, // Asegúrate de que el rol esté normalizado
          partido_politico: item.partido_politico,
          sueldo: item.sueldo,
          fecha_ingreso: new Date(item.fecha_ingreso),
          rol_previo: item.rol_previo,
          comentarios: comentarios === "nada" ? undefined : comentarios,
          id: item.id || item._id.toString(), // Si no hay id, usa _id de Mongo
        };
      });

      // Guardar los datos procesados en la base de datos
      for (const politic of formattedData) {
        const newPolitic = new PoliticModel(politic);
        await newPolitic.save(); // Guarda el nuevo documento en la base de datos
      }

      console.log(`Archivo ${file} procesado y guardado con éxito.`);
    }
  } catch (error) {
    console.error("Error al procesar los datos:", error);
  }
};


