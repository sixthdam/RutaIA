package com.rutaia.backend.auth;

import com.rutaia.backend.config.JwtService;
import com.rutaia.backend.exceptions.BusinessRuleException;
import com.rutaia.backend.modelo.Usuario;
import com.rutaia.backend.repositorio.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        // 1. Buscar usuario por el correo utilizando el metodo del repositorio
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new BusinessRuleException("Credenciales inválidas"));

        // 2. Comparación de contraseña (texto plano según tu lógica actual)
        if (!request.password().equals(usuario.getContrasenia())) {
            throw new BusinessRuleException("Credenciales inválidas");
        }

        // 3. Obtener el rol del usuario (ajusta .name() o .getNombre() según tu Enum)
        String rolNombre = usuario.getRol().name();

        // 4. Generar Token JWT enviando el correo como subject y el rol en los claims
        String token = jwtService.generateToken(usuario.getCorreo(), rolNombre);

        // 5. Devolver respuesta estructurada para el frontend
        return Map.of(
                "token", token,
                "role", rolNombre,
                "idUsuario", usuario.getIdUsuario()
        );
    }
}