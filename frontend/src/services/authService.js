// Lista de usuarios predefinidos para el prototipo
const users = [
    { carnet: '13120200', fechaNacimiento: '08/06/2004', role: 'usuario' },
    { carnet: '12735190', fechaNacimiento: '07/01/2004', role: 'usuario' },
    { carnet: '8466316', fechaNacimiento: '19/08/2003', password: '12345', role: 'admin' },
    { carnet: '8812438', fechaNacimiento: '27/07/2003', password: '12345', role: 'auditor' },
    { carnet: '13491987', fechaNacimiento: '04/02/2004', password: '12345', role: 'jurado' }
];

// Función para autenticar usuarios normales (sin contraseña)
export const authenticateUser = (carnet, fechaNacimiento) => {
    const user = users.find(u =>
        u.carnet === carnet &&
        u.fechaNacimiento === fechaNacimiento &&
        u.role === 'usuario'
    );

    if (user) {
        return {
            success: true,
            user: {
                carnet: user.carnet,
                fechaNacimiento: user.fechaNacimiento,
                role: user.role,
            }
        };
    }

    return { success: false };
};

// Función para autenticar administradores, auditores o jurados (con contraseña)
export const authenticateAdmin = (carnet, fechaNacimiento, password) => {
    const user = users.find(u =>
        u.carnet === carnet &&
        u.fechaNacimiento === fechaNacimiento &&
        (u.role === 'auditor' || u.role === 'jurado' || u.role === 'admin') &&
        u.password === password
    );

    if (user) {
        return {
            success: true,
            user: {
                carnet: user.carnet,
                fechaNacimiento: user.fechaNacimiento,
                role: user.role,
            }
        };
    }

    return { success: false };
};

// Guardar datos de usuario en localStorage
export const saveUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
};

// Obtener datos de usuario del localStorage
export const getUserData = () => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
};

// Verificar si hay un usuario autenticado
export const isAuthenticated = () => {
    return !!localStorage.getItem('user');
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem('user');
};

// Datos predefinidos de usuarios para mostrar en MiVoto
export const getUserDisplayData = (carnet) => {
    // Datos de ejemplo para mostrar en MiVoto según el carnet
    const userDisplayData = {
        '13120200': {
            nombreCompleto: 'Juan Carlos Pérez',
            cedulaIdentidad: '13120200',
            lugarVotacion: 'Unidad Educativa San Agustín',
            mesaSufragio: '42',
            fechaEmision: '23/10/2025',
        },
        '12735190': {
            nombreCompleto: 'María Flores Rodríguez',
            cedulaIdentidad: '12735190',
            lugarVotacion: 'Colegio Don Bosco',
            mesaSufragio: '17',
            fechaEmision: '23/10/2025',
        }
    };

    return userDisplayData[carnet] || null;
};
