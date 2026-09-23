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
	estado enum('PENDIENTE', 'RESPONDIDA', 'SIN RESULTADOS', 'ERROR') not null,
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

-- MySQL 8.4 compatible user creation
create user if not exists 'usr_api_service'@'%' identified by 'BackendPass123!';
grant all privileges on proyectoia2.* to 'usr_api_service'@'%';
flush privileges;