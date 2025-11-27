// scripts/seedAdministradores.js
// Script para inicializar la colección de administradores, jurados y auditores

require("dotenv").config();
const { conectarDB } = require("../conexion");
const Administrador = require("../services/users/models/administradorModel");

// Datos de administradores, jurados y auditores de prueba
const administradoresPrueba = [
  {
    nombre: "Pedro González Mamani",
    carnet: "8466316",
    fechaNacimiento: "19/08/2003",
    correo: "pedro.gonzalez@admin.bo",
    password: "123456",
    role: "admin",
  },
  {
    nombre: "Roberto Fernández López",
    carnet: "8812438",
    fechaNacimiento: "27/07/2003",
    correo: "roberto.fernandez@auditor.bo",
    password: "123456",
    role: "auditor",
  },
  {
    nombre: "Ana Lucia Quispe",
    carnet: "13491987",
    fechaNacimiento: "04/02/2004",
    correo: "ana.quispe@jurado.bo",
    password: "123456",
    role: "jurado",
  },
  {
    nombre: "Carlos Mendoza Flores",
    carnet: "9234567",
    fechaNacimiento: "15/05/1985",
    correo: "carlos.mendoza@admin.bo",
    password: "admin123",
    role: "admin",
  },
  {
    nombre: "María Teresa Guzmán",
    carnet: "8765432",
    fechaNacimiento: "22/09/1990",
    correo: "maria.guzman@auditor.bo",
    password: "auditor123",
    role: "auditor",
  },
  {
    nombre: "Jorge Luis Parra",
    carnet: "10123456",
    fechaNacimiento: "10/12/1988",
    correo: "jorge.parra@jurado.bo",
    password: "jurado123",
    role: "jurado",
  },
];

const seedAdministradores = async () => {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("🔐 INICIANDO POBLADO DE BASE DE DATOS - ADMINISTRADORES");
    console.log("=".repeat(60) + "\n");

    // Conectar a la base de datos
    await conectarDB();

    // Limpiar colección existente
    console.log("🗑️  Limpiando colección de administradores...");
    await Administrador.deleteMany({});
    console.log("✅ Colección limpiada\n");

    // Insertar administradores de prueba usando save() para activar hooks (hashing)
    console.log("📝 Insertando administradores, jurados y auditores...");

    const administradoresInsertados = [];
    for (const adminData of administradoresPrueba) {
      const admin = new Administrador(adminData);
      await admin.save();
      administradoresInsertados.push(admin);
    }

    console.log(
      `✅ ${administradoresInsertados.length} usuarios administrativos insertados\n`
    );

    // Mostrar resumen de administradores insertados
    console.log("📊 RESUMEN DE USUARIOS ADMINISTRATIVOS:");
    console.log("=".repeat(60));

    // Agrupar por rol
    const admins = administradoresInsertados.filter((a) => a.role === "admin");
    const auditores = administradoresInsertados.filter(
      (a) => a.role === "auditor"
    );
    const jurados = administradoresInsertados.filter(
      (a) => a.role === "jurado"
    );

    console.log(`\n👨‍💼 ADMINISTRADORES (${admins.length}):`);
    admins.forEach((admin) => {
      console.log(`   • ${admin.nombre}`);
      console.log(`     Carnet: ${admin.carnet} | Email: ${admin.correo}`);
    });

    console.log(`\n🔍 AUDITORES (${auditores.length}):`);
    auditores.forEach((auditor) => {
      console.log(`   • ${auditor.nombre}`);
      console.log(`     Carnet: ${auditor.carnet} | Email: ${auditor.correo}`);
    });

    console.log(`\n⚖️  JURADOS (${jurados.length}):`);
    jurados.forEach((jurado) => {
      console.log(`   • ${jurado.nombre}`);
      console.log(`     Carnet: ${jurado.carnet} | Email: ${jurado.correo}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("✨ PROCESO COMPLETADO EXITOSAMENTE");
    console.log("=".repeat(60) + "\n");

    console.log("💡 Credenciales de prueba:");
    console.log(
      "   Admin:   Carnet: 8466316,  Fecha: 19/08/2003, Email: pedro.gonzalez@admin.bo,    Password: 123456"
    );
    console.log(
      "   Auditor: Carnet: 8812438,  Fecha: 27/07/2003, Email: roberto.fernandez@auditor.bo, Password: 123456"
    );
    console.log(
      "   Jurado:  Carnet: 13491987, Fecha: 04/02/2004, Email: ana.quispe@jurado.bo,        Password: 123456\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR AL POBLAR LA BASE DE DATOS:", error);
    process.exit(1);
  }
};

// Ejecutar el seeder
seedAdministradores();
