-- ============================================
-- AHORRO 2026 - BASE DE DATOS DESDE CERO
-- ============================================

-- ============================================
-- 1. CREAR TABLAS
-- ============================================

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL
);

CREATE TABLE montos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    user_id INTEGER NOT NULL,
    selected INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ahorros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    monto_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE objetivos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at DATETIME
);

CREATE TABLE penitencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL
);

-- Tabla de retos disponibles (pool de retos sin activar)
CREATE TABLE retos_disponibles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'ahorro'
);

-- Tabla de retos (activos e historial)
CREATE TABLE retos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    date DATETIME,
    completed_user1 INTEGER DEFAULT 0,
    completed_user2 INTEGER DEFAULT 0,
    penitencia_applied INTEGER DEFAULT 0,
    tipo TEXT DEFAULT 'ahorro'
);

-- Tabla para trackear activaciones automáticas del scheduler
CREATE TABLE reto_schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_activation_date DATETIME NOT NULL,
    activation_type TEXT
);

-- ============================================
-- 2. POBLAR USUARIOS
-- ============================================

INSERT INTO users (id, name, color) VALUES
(1, 'Yezid', 'person1'),
(2, 'Yiss', 'person2');

-- ============================================
-- 3. POBLAR OBJETIVOS
-- ============================================

INSERT INTO objetivos (amount, completed, completed_at) VALUES
(1000000, 0, NULL),
(2000000, 0, NULL),
(3000000, 0, NULL),
(5000000, 0, NULL),
(7000000, 0, NULL),
(12000000, 0, NULL),
(20000000, 0, NULL);

-- ============================================
-- 4. POBLAR PENITENCIAS
-- ============================================

INSERT INTO penitencias (description) VALUES
('Lavar los platos durante una semana completa'),
('Preparar el desayuno al otro durante 3 días'),
('Hacer un masaje de 15 minutos al otro'),
('Cocinar la comida favorita del otro'),
('Limpiar el baño durante todo el mes'),
('Sacar la basura durante dos semanas'),
('Hacer las compras del mercado solo/a durante un mes'),
('Trapear toda la casa dos veces en la semana'),
('Lavar y doblar toda la ropa durante una semana'),
('Dar un regalo sorpresa (sin gastar dinero)'),
('Escribir 10 cosas que amas del otro'),
('Cantar una canción romántica frente al otro'),
('Bailar una canción completa que elija el otro'),
('Hacer 50 flexiones de pecho'),
('Planificar y preparar las comidas durante 3 días'),
('Limpiar todas las ventanas de la casa'),
('Organizar el closet del otro'),
('No usar el celular durante una cena romántica'),
('Hacer un video gracioso y publicarlo en redes'),
('Escribir un poema para el otro y leerlo en voz alta');

-- ============================================
-- 5. POBLAR RETOS DISPONIBLES (el pool)
-- ============================================

INSERT INTO retos_disponibles (description, tipo) VALUES
-- Ahorro
('Ahorrar $10,000 extra cada día durante una semana', 'ahorro'),
('Comprar café fuera de casa 3 veces', 'ahorro'),
('Cocinar al menos 1 comida en casa para todos durante 5 días', 'ahorro'),
('Ahorrar todo el cambio en monedas durante la semana', 'ahorro'),
('No usar apps de delivery para comidas por 7 días', 'ahorro'),
('Preparar almuerzos que tengan al menos 1 huevo durante 1 semana', 'ahorro'),
('Meter $100.000 al ahorro compartido', 'ahorro'),
('No comprar snacks o dulces por una semana', 'ahorro'),
('Cocinar juntos una comida especial sin gastar más de $50.000', 'ahorro'),
('Vender algo que no uses', 'ahorro'),
('Llevar agua de casa por 10 días', 'ahorro'),
('Hacer una comida que tenga pan', 'ahorro'),
('No comprar nada por 3 días', 'ahorro'),
('Meter $200.000 al ahorro compartido', 'ahorro'),
('Planificar un menú para almorzar semanal para evitar gastos innecesarios', 'ahorro'),
('Meter $50.000 al ahorro compartido', 'ahorro'),
('Hacer ejercicio o deporte durante 14 días seguidos y al menos 3 días juntos', 'ahorro'),
('No comprar caprichos durante 10 días', 'ahorro'),
('Hacer picnic', 'ahorro'),
('Reutilizar algo creativo', 'ahorro'),
-- Gratis
('Hacer 30 minutos de ejercicio juntos 3 días', 'gratis'),
('Leer un libro corto', 'gratis'),
('Escribir 3 cosas por las que están agradecidos cada día', 'gratis'),
('Hacer una caminata juntos de al menos 30 minutos', 'gratis'),
('Organizar y limpiar un área de la casa que esté desordenada', 'gratis'),
('Meditar 10 minutos cada mañana durante 5 días', 'gratis'),
('Llamar a un familiar o amigo al que no hablen hace tiempo', 'gratis'),
('Hacer un picnic', 'gratis'),
('Ver el atardecer juntos', 'gratis'),
('Cocinar una receta extravagante', 'gratis'),
('Hacer una noche de juegos de mesa', 'gratis'),
('Crear una playlist juntos e ingresar al menos 10 canciones favoritas', 'gratis'),
('Hacer 100 sentadillas al día durante 5 días', 'gratis'),
('Tomar fotos creativas juntos y hacer competencia el perdedor ingresa $10.000 al ahorro compartido', 'gratis'),
('Escribir una carta de amor el uno al otro', 'gratis');

-- ============================================
-- 6. VERIFICACIÓN FINAL
-- ============================================

SELECT 'users' AS tabla, COUNT(*) AS total FROM users
UNION ALL
SELECT 'objetivos', COUNT(*) FROM objetivos
UNION ALL
SELECT 'penitencias', COUNT(*) FROM penitencias
UNION ALL
SELECT 'retos_disponibles (ahorro)', COUNT(*) FROM retos_disponibles WHERE tipo = 'ahorro'
UNION ALL
SELECT 'retos_disponibles (gratis)', COUNT(*) FROM retos_disponibles WHERE tipo = 'gratis'
UNION ALL
SELECT 'retos (activos/historial)', COUNT(*) FROM retos
UNION ALL
SELECT 'reto_schedule', COUNT(*) FROM reto_schedule;