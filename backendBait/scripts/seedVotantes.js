// scripts/seedVotantes.js
// Script para inicializar la colección de votantes con datos de prueba

require("dotenv").config();
const { conectarDB } = require("../conexion");
const Votante = require("../services/users/models/votanteModel");

// Datos de votantes de prueba
const votantesPrueba = [
  {
    nombre: "Juan Carlos Pérez",
    carnet: "13120200",
    fechaNacimiento: "08/06/2004",
    correo: "juan.perez@example.com",
  },
  {
    nombre: "María Flores Rodríguez",
    carnet: "12735190",
    fechaNacimiento: "07/01/2004",
    correo: "maria.flores@example.com",
  },
  {
    nombre: "Pedro González Mamani",
    carnet: "8466316",
    fechaNacimiento: "19/08/2003",
    correo: "pedro.gonzalez@example.com",
  },
  {
    nombre: "Ana Lucia Quispe",
    carnet: "13491987",
    fechaNacimiento: "04/02/2004",
    correo: "ana.quispe@example.com",
  },
  {
    nombre: "Roberto Fernández López",
    carnet: "8812438",
    fechaNacimiento: "27/07/2003",
    correo: "roberto.fernandez@example.com",
  },
  {
    nombre: "Carmen Rosa Torres",
    carnet: "14523678",
    fechaNacimiento: "15/03/2005",
    correo: "carmen.torres@example.com",
  },
  {
    nombre: "Luis Alberto Vargas",
    carnet: "12987654",
    fechaNacimiento: "22/11/2003",
    correo: "luis.vargas@example.com",
  },
  {
    nombre: "Sandra Patricia Morales",
    carnet: "13654789",
    fechaNacimiento: "30/09/2004",
    correo: "sandra.morales@example.com",
  },
];

const seedVotantes = async () => {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("🌱 INICIANDO POBLADO DE BASE DE DATOS");
    console.log("=".repeat(60) + "\n");

    // Conectar a la base de datos
    await conectarDB();

    // Limpiar colección existente
    console.log("🗑️  Limpiando colección de votantes...");
    await Votante.deleteMany({});
    console.log("✅ Colección limpiada\n");

    // Insertar votantes de prueba
    console.log("📝 Insertando votantes de prueba...");
    const votantesInsertados = await Votante.insertMany(votantesPrueba);
    console.log(
      `✅ ${votantesInsertados.length} votantes insertados correctamente\n`
    );

    // Mostrar resumen de votantes insertados
    console.log("📊 RESUMEN DE VOTANTES INSERTADOS:");
    console.log("=".repeat(60));

    for (const votante of votantesInsertados) {
      console.log(`
👤 Nombre: ${votante.nombre}
🆔 Carnet: ${votante.carnet}
📅 Fecha Nac.: ${votante.fechaNacimiento}
📧 Correo: ${votante.correo}
${"-".repeat(60)}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ PROCESO COMPLETADO EXITOSAMENTE");
    console.log("=".repeat(60) + "\n");

    console.log("💡 Puedes usar estos datos para hacer login:");
    console.log("   Ejemplo: Carnet: 13120200, Fecha: 08/06/2004\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR AL POBLAR LA BASE DE DATOS:", error);
    process.exit(1);
  }
};

// Ejecutar el seeder
seedVotantes();
