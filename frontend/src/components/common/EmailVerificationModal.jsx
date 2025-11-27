import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Modal para verificación de correo electrónico mediante código de 6 dígitos
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el modal está abierto o cerrado
 * @param {function} props.onClose - Función que se ejecuta al cerrar el modal
 * @param {function} props.onVerify - Función que se ejecuta al verificar el código
 * @param {function} props.onResend - Función que se ejecuta al solicitar reenvío del código
 * @param {string} props.email - Correo electrónico al que se envió el código (opcional)
 */
const EmailVerificationModal = ({ 
  isOpen = false, 
  onVerify = () => {}, 
  onResend = () => {},
  email = ""
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRef0 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRefs = useMemo(() => [
    inputRef0, inputRef1, inputRef2, 
    inputRef3, inputRef4, inputRef5
  ], []);
  
  // Cierra el modal si isOpen cambia a false
  useEffect(() => {
    if (!isOpen) {
      setCode(['', '', '', '', '', '']);
    } else if (isOpen && inputRefs[0].current) {
      // Enfoca el primer input cuando el modal se abre
      setTimeout(() => {
        inputRefs[0].current.focus();
      }, 100);
    }
  }, [isOpen, inputRefs]);

  // Maneja el ingreso de dígitos
  const handleInputChange = (index, value) => {
    // Solo permitir números
    if (value !== '' && !/^\d+$/.test(value)) return;
    
    const newCode = [...code];
    // Tomar solo el último caracter si pegan más de uno
    newCode[index] = value.slice(-1);
    setCode(newCode);
    
    // Mover al siguiente input si se ingresó un dígito
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Maneja la tecla de retroceso
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  // Maneja el envío del formulario - aceptar cualquier código
  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    // Por ahora aceptar cualquier código, incluso incompleto
    onVerify(verificationCode);
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '30px',
        maxWidth: '450px',
        width: '100%',
        position: 'relative',
      }}>
        {/* Título y subtítulo */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center',
        }}>
          Verifica tu correo electrónico
        </h2>
        
        <p style={{
          color: '#666',
          textAlign: 'center',
          margin: '0 0 25px',
          fontSize: '0.95rem',
        }}>
          Ingresa el código de 6 dígitos que enviamos a {email ? email : "tu correo electrónico"} para continuar.
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Contenedor de los inputs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            {code.map((digit, index) => (
              <React.Fragment key={index}>
                <input
                  ref={inputRefs[index]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '50px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
                {index === 2 && (
                  <span style={{ margin: '0 4px', fontSize: '1.5rem' }}>-</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Botón de verificar */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '20px',
            }}
            // Verificar solo si el código está completo
            disabled={code.some(digit => digit === '')}
          >
            Verificar
          </button>
        </form>

        {/* Enlace para reenviar código */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
        }}>
          <button
            onClick={onResend}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: 0,
            }}
          >
            ¿No recibiste el código? Reenviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
