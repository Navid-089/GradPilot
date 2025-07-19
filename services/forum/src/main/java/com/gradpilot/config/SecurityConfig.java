// package com.gradpilot.config;

// import java.util.Arrays;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.filter.CorsFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Value("${app.jwt.secret}")
//     private String jwtSecret;

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//                 .csrf(csrf -> csrf.disable())
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers("/error").permitAll() // error page publicly accessible
//                         .requestMatchers("/api/forum/**").permitAll() // Allow public read access to forum posts
//                         // .requestMatchers("/api/forum/posts").permitAll() // Allow public access to
//                         // forum posts
//                         // .requestMatchers("/api/forum/posts/**").authenticated() // Allow
//                         // authenticated access to all
//                         // // post
//                         // // operations for now
//                         // .requestMatchers("/api/forum/tags").permitAll() // Allow public read access
//                         // to tags
//                         // .requestMatchers("/api/forum/comments/**").permitAll() // Allow public access
//                         // to comment
//                         // operations for now

//                         .anyRequest().authenticated())
//                 .sessionManagement(session -> session
//                         .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .addFilterBefore(new JwtAuthenticationFilter(jwtSecret), UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

//     @Bean
//     public JwtAuthenticationFilter jwtAuthenticationFilter() {
//         return new JwtAuthenticationFilter(jwtSecret);
//     }

//     @Bean
//     public CorsFilter corsFilter() {
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         CorsConfiguration config = new CorsConfiguration();
//         // config.setAllowedOrigins(Arrays.asList(
//         // "http://localhost:3000",
//         // "http://gradpilot.me"));
//         config.setAllowedOrigins(Arrays.asList(
//                 "http://localhost:3000",
//                 "http://57.159.24.58",
//                 "http://gradpilot.me"));

//         config.addAllowedHeader("*");
//         config.addAllowedMethod("*");
//         config.setAllowCredentials(true);
//         source.registerCorsConfiguration("/**", config);
//         return new CorsFilter(source);
//     }

//     @Bean
//     public UrlBasedCorsConfigurationSource corsConfigurationSource() {
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         CorsConfiguration config = new CorsConfiguration();
//         config.addAllowedOrigin("http://localhost:3000");
//         config.addAllowedHeader("*");
//         config.addAllowedMethod("*");
//         config.setAllowCredentials(true);
//         source.registerCorsConfiguration("/**", config);
//         return source;
//     }

//     // @Bean
//     // public UrlBasedCorsConfigurationSource corsConfigurationSourceForFrontend() {
//     // UrlBasedCorsConfigurationSource source = new
//     // UrlBasedCorsConfigurationSource();
//     // CorsConfiguration config = new CorsConfiguration();
//     // config.addAllowedOrigin("http://gradpilot.me");
//     // config.addAllowedHeader("*");
//     // config.addAllowedMethod("*");
//     // config.setAllowCredentials(true);
//     // source.registerCorsConfiguration("/**", config);
//     // return source;
//     // }

// }

package com.gradpilot.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtSecret);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/error").permitAll() // Allow error page publicly
                        .requestMatchers("/api/forum/**").permitAll() // Allow forum API public access (adjust as
                                                                      // needed)
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://57.159.24.58",
                "http://gradpilot.me"));
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
