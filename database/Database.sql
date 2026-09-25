drop database if exists proyectoia2;
create database proyectoia2;
use proyectoia2;

create table categorias(
	id_categoria int primary key auto_increment,
	nombre varchar(255)
);

create table cursos(
	id_curso int primary key auto_increment,
	id_categoria int not null,
	nombre varchar(255) not null,
	descripcion text,
	dificultad enum('BASICO','INTERMEDIO','AVANZADO') not null,
	duracion int not null,
	activo bool not null default true,
	constraint fk_cursos_categorias foreign key (id_categoria) references categorias(id_categoria),
	constraint chk_positive_duracion_cursos check (duracion > 0)
);

create table usuarios(
	id_usuario int primary key auto_increment,
	nombre varchar(255) not null,
	rol enum('ESTUDIANTE', 'ADMIN') not null,
	correo varchar(255) not null unique,
	contrasenia varchar(255) not null,
	experiencia enum('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO') not null,
	area_interes varchar(255)
);

create table consultas(
	id_consulta int primary key auto_increment,
	id_usuario int not null,
	pregunta text not null,
	fecha timestamp not null default current_timestamp,
	estado enum('PENDIENTE', 'RESPONDIDA', 'SIN_RESULTADOS', 'ERROR') not null,
	constraint fk_consultas_usuarios foreign key (id_usuario) references usuarios(id_usuario)
);

create table recomendaciones(
	id_recomendacion int primary key auto_increment,
	id_consulta int not null,
	respuesta text,
	fecha timestamp not null default current_timestamp,
	constraint fk_recomendaciones_consultas foreign key (id_consulta) references consultas(id_consulta)
);

create table fuentes(
	id_recomendacion int not null,
	id_curso int not null,
	similitud double not null,
	primary key (id_recomendacion, id_curso),
	constraint fk_fuentes_recomendaciones foreign key (id_recomendacion) references recomendaciones(id_recomendacion),
	constraint fk_fuentes_cursos foreign key (id_curso) references cursos(id_curso)
);

create table calificaciones(
	id_recomendacion int not null,
	calificacion int not null,
	primary key (id_recomendacion),
	constraint fk_calificaciones_recomendaciones foreign key(id_recomendacion) references recomendaciones(id_recomendacion),
	constraint chk_rango_calificacion_calificaciones check (calificacion >= 1 and calificacion <=5)
);

-- ============================================
-- CATEGORÍAS
-- ============================================

INSERT INTO categorias (nombre) VALUES
('Programación'),
('Bases de Datos'),
('Redes'),
('Inteligencia Artificial'),
('Desarrollo Web'),
('DevOps y Cloud'),
('Ciberseguridad'),
('Desarrollo de Software');


-- ============================================
-- CURSOS
-- ============================================

INSERT INTO cursos
(id_categoria, nombre, descripcion, dificultad, duracion, activo)
VALUES

-- PROGRAMACIÓN
(1, 'Introducción a Python',
 'Curso introductorio de Python para aprender variables, tipos de datos, estructuras de control, funciones, listas, diccionarios y manejo básico de archivos.',
 'BASICO', 40, true),

(1, 'Python Intermedio',
 'Curso orientado al desarrollo de aplicaciones con Python utilizando programación orientada a objetos, módulos, excepciones, decoradores y buenas prácticas.',
 'INTERMEDIO', 55, true),

(1, 'Programación Orientada a Objetos con Java',
 'Aprende los fundamentos de la programación orientada a objetos utilizando Java: clases, objetos, herencia, polimorfismo, encapsulamiento e interfaces.',
 'INTERMEDIO', 60, true),

(1, 'Java Avanzado',
 'Curso avanzado de Java enfocado en colecciones, streams, concurrencia, patrones de diseño, manejo avanzado de excepciones y optimización.',
 'AVANZADO', 70, true),

-- BASES DE DATOS
(2, 'Fundamentos de SQL',
 'Aprende a consultar bases de datos relacionales mediante SQL, incluyendo SELECT, WHERE, ORDER BY, JOIN, GROUP BY y funciones de agregación.',
 'BASICO', 35, true),

(2, 'Bases de Datos Relacionales',
 'Curso sobre diseño y administración de bases de datos relacionales. Incluye normalización, claves primarias, claves foráneas, restricciones y relaciones.',
 'INTERMEDIO', 50, true),

(2, 'SQL Avanzado',
 'Curso avanzado de SQL sobre subconsultas, CTE, funciones de ventana, procedimientos almacenados, índices y optimización de consultas.',
 'AVANZADO', 65, true),

-- REDES
(3, 'Fundamentos de Redes',
 'Introducción a redes de computadores, modelos OSI y TCP/IP, direcciones IP, puertos, protocolos, dispositivos de red y conceptos básicos de conectividad.',
 'BASICO', 45, true),

(3, 'Administración de Redes',
 'Curso sobre configuración y administración de redes, direccionamiento IPv4, subnetting, DHCP, DNS, VLAN, routing y troubleshooting.',
 'INTERMEDIO', 65, true),

(3, 'Redes Avanzadas y Routing',
 'Curso avanzado de redes enfocado en routing, protocolos dinámicos, OSPF, redundancia, segmentación, calidad de servicio y diagnóstico de redes complejas.',
 'AVANZADO', 80, true),

-- INTELIGENCIA ARTIFICIAL
(4, 'Introducción a la Inteligencia Artificial',
 'Conceptos fundamentales de inteligencia artificial, aprendizaje automático, modelos predictivos, procesamiento de datos y aplicaciones de IA.',
 'BASICO', 35, true),

(4, 'Machine Learning con Python',
 'Curso intermedio de aprendizaje automático utilizando Python. Incluye preparación de datos, regresión, clasificación, evaluación de modelos y scikit-learn.',
 'INTERMEDIO', 70, true),

(4, 'Procesamiento de Lenguaje Natural',
 'Curso sobre procesamiento de texto, embeddings, clasificación de texto, búsqueda semántica y modelos de lenguaje.',
 'AVANZADO', 75, true),

-- DESARROLLO WEB
(5, 'HTML y CSS desde Cero',
 'Aprende a construir páginas web utilizando HTML y CSS, incluyendo estructura semántica, formularios, estilos, diseño responsive y accesibilidad.',
 'BASICO', 30, true),

(5, 'JavaScript Fundamental',
 'Curso de JavaScript para aprender variables, funciones, objetos, arrays, eventos, manipulación del DOM y programación asíncrona.',
 'BASICO', 45, true),

(5, 'Desarrollo Web con APIs REST',
 'Curso sobre construcción y consumo de APIs REST, métodos HTTP, JSON, autenticación, validación y comunicación entre aplicaciones.',
 'INTERMEDIO', 55, true),

-- DEVOPS Y CLOUD
(6, 'Introducción a Docker',
 'Aprende los conceptos fundamentales de Docker, imágenes, contenedores, volúmenes, redes y creación de ambientes reproducibles.',
 'BASICO', 35, true),

(6, 'Docker y Docker Compose',
 'Curso práctico para crear aplicaciones multicontenedor utilizando Docker Compose, redes, volúmenes, variables de entorno y servicios.',
 'INTERMEDIO', 50, true),

(6, 'DevOps y CI/CD',
 'Curso sobre integración y entrega continua, automatización de pruebas, pipelines, control de versiones y despliegue automatizado.',
 'INTERMEDIO', 60, true),

-- CIBERSEGURIDAD
(7, 'Fundamentos de Ciberseguridad',
 'Introducción a amenazas informáticas, autenticación, autorización, criptografía, malware, vulnerabilidades y principios de seguridad.',
 'BASICO', 40, true),

(7, 'Seguridad en Redes',
 'Curso sobre firewalls, segmentación de redes, VPN, detección de intrusiones, ataques comunes y mecanismos de protección.',
 'INTERMEDIO', 60, true),

(7, 'Ethical Hacking',
 'Curso avanzado sobre evaluación de vulnerabilidades, reconocimiento, análisis de servicios, pruebas de penetración y elaboración de reportes.',
 'AVANZADO', 80, true),

-- DESARROLLO DE SOFTWARE
(8, 'Git y GitHub',
 'Aprende control de versiones utilizando Git y GitHub, incluyendo commits, ramas, merges, resolución de conflictos y flujos de trabajo colaborativos.',
 'BASICO', 25, true),

(8, 'Arquitectura de Software',
 'Curso sobre principios de diseño de software, separación de responsabilidades, arquitectura por capas, patrones y mantenibilidad.',
 'AVANZADO', 65, true),

(8, 'Patrones de Diseño',
 'Aprende patrones de diseño de software como Factory, Singleton, Strategy, Observer y Repository mediante ejemplos prácticos.',
 'AVANZADO', 55, true),

-- CURSO INACTIVO PARA PROBAR FILTROS
(1, 'Curso Antiguo de Python',
 'Curso desactualizado de Python utilizado únicamente para pruebas de cursos inactivos.',
 'BASICO', 20, false);


-- ============================================
-- USUARIOS
-- ============================================

INSERT INTO usuarios
(nombre, rol, correo, contrasenia, experiencia, area_interes)
VALUES
('Ana Torres', 'ESTUDIANTE', 'ana.torres@example.com', 'demo123', 'PRINCIPIANTE', 'Programación'),
('Carlos Mendoza', 'ESTUDIANTE', 'carlos.mendoza@example.com', 'demo123', 'INTERMEDIO', 'Redes'),
('Laura Gómez', 'ESTUDIANTE', 'laura.gomez@example.com', 'demo123', 'PRINCIPIANTE', 'Bases de Datos'),
('Diego Ramírez', 'ESTUDIANTE', 'diego.ramirez@example.com', 'demo123', 'AVANZADO', 'Inteligencia Artificial'),
('Administrador', 'ADMIN', 'admin@example.com', 'admin123', 'AVANZADO', 'Desarrollo de Software');


-- ============================================
-- CONSULTAS
-- ============================================

INSERT INTO consultas
(id_usuario, pregunta, estado)
VALUES
(1, 'Quiero aprender Python desde cero', 'RESPONDIDA'),
(2, 'Necesito aprender sobre subnetting y configuración de redes', 'RESPONDIDA'),
(3, 'Quiero aprender SQL y hacer consultas a bases de datos', 'RESPONDIDA'),
(4, 'Quiero aprender sobre embeddings y procesamiento de lenguaje natural', 'RESPONDIDA'),
(1, 'Quiero aprender Docker para trabajar con contenedores', 'PENDIENTE');


CREATE ROLE IF NOT EXISTS 'logi_admin', 'logi_backend', 'logi_auditor';

GRANT ALL PRIVILEGES ON proyectoia2.* TO 'logi_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON proyectoia2.* TO 'logi_backend';
GRANT SELECT ON proyectoia2.* TO 'logi_auditor';

CREATE USER IF NOT EXISTS 'usr_dba'@'%' IDENTIFIED BY 'AdminPass123!';
CREATE USER IF NOT EXISTS 'usr_api_service'@'%' IDENTIFIED BY 'BackendPass123!';
CREATE USER IF NOT EXISTS 'usr_auditor_qa'@'%' IDENTIFIED BY 'AuditPass123!';

GRANT 'logi_admin' TO 'usr_dba'@'%';
GRANT 'logi_backend' TO 'usr_api_service'@'%';
GRANT 'logi_auditor' TO 'usr_auditor_qa'@'%';

SET DEFAULT ROLE 'logi_admin' TO 'usr_dba'@'%';
SET DEFAULT ROLE 'logi_backend' TO 'usr_api_service'@'%';
SET DEFAULT ROLE 'logi_auditor' TO 'usr_auditor_qa'@'%';

FLUSH PRIVILEGES;
