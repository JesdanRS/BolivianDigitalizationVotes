// services/emailService.js
// Servicio para envío de correos electrónicos con nodemailer

const nodemailer = require("nodemailer");

// Configuración del transporte de nodemailer
const createTransporter = () => {
  // Verificar que las variables de entorno estén configuradas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn(
      "⚠️  Variables de entorno EMAIL_USER y EMAIL_PASSWORD no configuradas."
    );
    console.warn(
      "📧 El envío de correos no funcionará hasta que se configuren."
    );
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Envía un código de verificación por correo electrónico
 * @param {string} email - Correo electrónico del destinatario
 * @param {string} code - Código de verificación de 6 dígitos
 * @param {string} nombreVotante - Nombre del votante
 * @returns {Promise<boolean>} - true si se envió correctamente
 */
const enviarCodigoVerificacion = async (
  email,
  code,
  nombreVotante = "Votante"
) => {
  const transporter = createTransporter();

  if (!transporter) {
    // En modo desarrollo, solo mostrar el código en consola
    console.log("\n" + "=".repeat(60));
    console.log("📧 CÓDIGO DE VERIFICACIÓN (Modo desarrollo)");
    console.log("=".repeat(60));
    console.log(`📨 Para: ${email}`);
    console.log(`👤 Nombre: ${nombreVotante}`);
    console.log(`🔐 Código: ${code}`);
    console.log("=".repeat(60) + "\n");
    return true;
  }

  const mailOptions = {
    from: `"Sistema de Votación Bolivia" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código de Verificación - Sistema de Votación",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Verificación</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Encabezado -->
                <tr>
                  <td style="background-color: #dc2626; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🗳️ Sistema de Votación</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">Digitalización de Votos - Bolivia</p>
                  </td>
                </tr>
                
                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px;">Hola ${nombreVotante},</h2>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                      Recibimos una solicitud para acceder a tu cuenta en el sistema de votación. 
                      Por favor, utiliza el siguiente código de verificación para completar el proceso:
                    </p>
                    
                    <!-- Código de verificación -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <div style="background-color: #f8f9fa; border: 2px dashed #dc2626; border-radius: 8px; padding: 20px; display: inline-block;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">Tu código de verificación es:</p>
                            <p style="margin: 0; color: #dc2626; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${code}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                      <strong>Importante:</strong> Este código expirará en 10 minutos por seguridad.
                    </p>
                    
                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 13px; line-height: 1.5;">
                      Si no solicitaste este código, por favor ignora este correo.
                    </p>
                  </td>
                </tr>
                
                <!-- Pie de página -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} Sistema de Votación Digital - Bolivia<br>
                      Este es un correo automático, por favor no responder.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Código de verificación enviado a: ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar correo electrónico:", error.message);
    throw new Error("No se pudo enviar el código de verificación");
  }
};

module.exports = {
  enviarCodigoVerificacion,
};
