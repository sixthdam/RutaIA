package com.rutaia.backend.auth;

import com.rutaia.backend.config.JwtService;
import com.rutaia.backend.exceptions.EmailAlreadyExistsException;
import com.rutaia.backend.exceptions.InvalidCredentialsException;
import com.rutaia.backend.modelo.Usuario;
import com.rutaia.backend.modelo.enums.RolEnum;
import com.rutaia.backend.repositorio.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AuthResponse login(LoginRequest request) {
        String correo = normalizarCorreo(request.correo());

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(InvalidCredentialsException::new);

        if (!request.password().equals(usuario.getContrasenia())) {
            throw new InvalidCredentialsException();
        }
        return buildResponse(usuario);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String correo = normalizarCorreo(request.correo());

        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            throw new EmailAlreadyExistsException();
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setCorreo(correo);
        usuario.setContrasenia(request.contrasenia());
        usuario.setRol(RolEnum.ESTUDIANTE);
        usuario.setExperiencia(request.experiencia());
        usuario.setAreaInteres(request.areaInteres());

        try {
            return buildResponse(usuarioRepository.saveAndFlush(usuario));
        } catch (DataIntegrityViolationException e) {
            throw new EmailAlreadyExistsException();
        }
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase(Locale.ROOT);
    }

    private AuthResponse buildResponse(Usuario usuario) {
        String rol = usuario.getRol().name();
        String token = jwtService.generateToken(usuario.getCorreo(), rol);
        return new AuthResponse(token, rol, usuario.getIdUsuario(), usuario.getExperiencia().toString());
    }
}