package com.comrepublic.shopx.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private static final String[] PUBLIC_URLS = {
            // Authentication & OAuth
            "/api/auth/verify",
            "/api/auth/register",
            "/api/auth/login",
            "/oauth2/success",
            "/api/user/profile",

            // Product & Category Browsing
            // "/api/products",
            // "/api/products/{id}",
            // "/api/products/searchProductsBySlugPart",
            // "/api/category",
            // "/api/category/{id}",
            "/api/products/{id}",
            // Swagger API documentation
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
    };
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JWTTokenHelper jwtTokenHelper;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public access endpoints
                        .requestMatchers(PUBLIC_URLS).permitAll()

                        // Product & Category Browsing (GET only)
                        .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/searchProductsBySlugPart").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/category").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/category/{id}").permitAll()

                        // Admin-only endpoints
                        .requestMatchers(HttpMethod.GET, "/api/user/all").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/{id}").hasAuthority("ADMIN")
                        // .requestMatchers(HttpMethod.DELETE,
                        // "/api/products/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/updateQuantity/{productId}")
                        .hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/category/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/category/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/category").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/order/{id}").hasAuthority("ADMIN")

                        // .requestMatchers(HttpMethod.POST,
                        // "/api/order/update-payment").hasAuthority("ADMIN")
                        // .requestMatchers(HttpMethod.POST,
                        // "/api/order/cancel/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/order").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/payment").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/payment/transactionsBetweenDays").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/payment/dashboard-stats").hasAuthority("ADMIN")

                        // User-accessible endpoints (Both Admin & Users)
                        .requestMatchers(HttpMethod.PUT, "/api/user/userProfile/{userId}")
                        .hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/user/change-password/{userId}")
                        .hasAnyAuthority("USER", "ADMIN")
                        // .requestMatchers(HttpMethod.GET, "/api/user/profile").hasAnyAuthority("USER",
                        // "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/order/update-payment").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/order/cancel/{id}").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/order/user").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/order").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/address").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/address/{id}").hasAnyAuthority("USER", "ADMIN")
                        // .requestMatchers(HttpMethod.GET, "/api/payment").hasAnyAuthority("USER",
                        // "ADMIN")

                        // Any other request must be authenticated
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/oauth2/success")
                        .loginPage("/oauth2/authorization/google"))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .addFilterBefore(new JWTAuthenticationFilter(jwtTokenHelper, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(daoAuthenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}