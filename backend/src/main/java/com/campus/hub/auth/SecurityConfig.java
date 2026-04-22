package com.campus.hub.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private CustomOAuth2UserService oauth2UserService;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/login/oauth2/**", "/api/health").permitAll()
                .requestMatchers("/api/bookings/{id}/status").hasAnyRole("ADMIN", "TECHNICIAN")
                .requestMatchers("/api/bookings/{id}/cancel").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/resources/**").authenticated()
                .requestMatchers("/api/admin/**", "/api/resources/**").hasRole("ADMIN")
                .requestMatchers("/api/technician/**").hasAnyRole("TECHNICIAN", "ADMIN")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService))
                .successHandler(oauth2AuthenticationSuccessHandler())
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            org.springframework.security.oauth2.core.user.OAuth2User oauth2User = 
                (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");
            
            User user = userRepository.findByEmail(email).orElseThrow();
            
            // Generate mock token matching manual login format
            String token = "real-db-authenticated-token-" + user.getId();
            
            // Format user object for JSON
            ObjectMapper mapper = new ObjectMapper();
            String userJson = mapper.writeValueAsString(user);
            String encodedUser = URLEncoder.encode(userJson, StandardCharsets.UTF_8);

            response.sendRedirect("http://localhost:3000/oauth2/callback?token=" + token + "&user=" + encodedUser);
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Auth-Token", "Origin", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("X-Auth-Token"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
