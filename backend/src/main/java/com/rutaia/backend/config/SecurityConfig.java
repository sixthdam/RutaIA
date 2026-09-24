package com.rutaia.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration// Le digo a Spring que esta clase es de configuración
@RequiredArgsConstructor
public class SecurityConfig {

    // Inyecto mi filtro JWT personalizado
    // Este filtro es el que va a leer el token en cada petición
    private final JwtFilter jwtFilter;
    private final JwtAuthenticationEntryPoint authEntryPoint;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        /*
         * Aquí estoy configurando toda la seguridad de la aplicación.
         * En Spring Security moderno ya no se usa WebSecurityConfigurerAdapter,
         * sino que se define un SecurityFilterChain como Bean.
         */
        return http
                // ESTA LÍNEA ES NUEVA PARA EL CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Desactivo CSRF porque mi API es REST y trabaja con JWT (stateless).
                // CSRF se usa más cuando hay sesiones y formularios.
                .csrf(AbstractHttpConfigurer::disable)

                // Le digo a Spring que no quiero sesiones.
                // Cada request debe venir autenticado con su propio token.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Aquí defino qué endpoints son públicos y cuáles no.
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/auth/login", "/auth/register", "/api/enums/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // usuarios queda cerrado al que no sea usuario
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/cursos/**", "/api/categorias/**").hasAnyRole("ESTUDIANTE", "ADMIN")

                        // Crear, actualizar o borrar cursos/categorías es exclusividad absoluta del ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/cursos/**", "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/cursos/**", "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cursos/**", "/api/categorias/**").hasRole("ADMIN")

                        // Ambo roles pueden interactuar con el flujo de preguntas y respuestas de la IA
                        .requestMatchers("/api/consultas/**").hasAnyRole("ESTUDIANTE", "ADMIN")
                        .requestMatchers("/api/recomendaciones/**").hasAnyRole("ESTUDIANTE", "ADMIN")
                        .requestMatchers("/api/fuentes/**").hasAnyRole("ESTUDIANTE", "ADMIN")
                        .requestMatchers("/api/calificaciones/**").hasAnyRole("ESTUDIANTE", "ADMIN")
                        .requestMatchers("/api/perfil/**").hasAnyRole("ESTUDIANTE", "ADMIN")

                        // ==========================================
                        // 5. CANDADO GENERAL PARA ESCRITURA Y ELIMINACIÓN
                        // ==========================================
                        // Cualquier otro POST, PUT o DELETE que se nos haya escapado arriba, requiere rol ADMIN por defecto
                        .requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")

                        // ==========================================
                        // 6. REGLA POR DEFECTO
                        // ==========================================
                        .anyRequest().authenticated()
                )
                /*
                 * Aquí agrego mi filtro JWT antes del filtro
                 * UsernamePasswordAuthenticationFilter.
                 *
                 * Porque quiero que primero se valide el token
                 * antes de que Spring intente autenticar usuario y contraseña.
                 *
                 * Este filtro será el encargado de:
                 * - Leer el header Authorization
                 * - Extraer el token
                 * - Validarlo
                 * - Cargar el usuario en el contexto de seguridad
                 */
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
                // Finalmente construyo la configuración
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Orígenes permitidos
        configuration.setAllowedOriginPatterns(List.of("*"));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Cabeceras permitidas
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));

        // Cabeceras expuestas
        configuration.setExposedHeaders(List.of("Authorization"));

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilterRegistration(JwtFilter filter) {
        FilterRegistrationBean<JwtFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}