package kr.co.co_working.common.config;

import kr.co.co_working.common.jwt.JwtAuthenticationFilter;
import kr.co.co_working.common.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final CorsConfigurationSource corsConfig;
    private final JwtProvider provider;

    private static final List<Endpoint> AUTH_IGNORE_LIST = new ArrayList<>();

    static {
        AUTH_IGNORE_LIST.add(new Endpoint("/", HttpMethod.GET));
        AUTH_IGNORE_LIST.add(new Endpoint("/join-form", HttpMethod.GET));
        AUTH_IGNORE_LIST.add(new Endpoint("/welcome", HttpMethod.GET));
        AUTH_IGNORE_LIST.add(new Endpoint("/api/v1/member", HttpMethod.POST));
        AUTH_IGNORE_LIST.add(new Endpoint("/api/v1/authentication", HttpMethod.POST));
        AUTH_IGNORE_LIST.add(new Endpoint("/swagger-ui/**", HttpMethod.GET));
        AUTH_IGNORE_LIST.add(new Endpoint("/v3/api-docs/**", HttpMethod.GET));
        AUTH_IGNORE_LIST.add(new Endpoint("/swagger-ui.html", HttpMethod.GET));
    }

    private record Endpoint(String url, HttpMethod method) { }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfig))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement((sessionManagement) ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> {
                for (Endpoint endpoint : AUTH_IGNORE_LIST) {
                    if (endpoint.method() == null) {
                        authorize.requestMatchers(endpoint.url()).permitAll();
                    } else {
                        authorize.requestMatchers(endpoint.method(), endpoint.url()).permitAll();
                    }
                }
                authorize.anyRequest().authenticated();
            })
            .addFilterBefore(new JwtAuthenticationFilter(provider),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}