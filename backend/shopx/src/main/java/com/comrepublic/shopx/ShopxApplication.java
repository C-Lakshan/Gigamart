package com.comrepublic.shopx;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import com.stripe.Stripe;

import java.util.Collections;
import java.util.Arrays;

@SpringBootApplication
public class ShopxApplication {
	
	@Value("${stripe.secret}")
	private String stripeSecret;

	@Value("${frontend.url}")  
    private String frontendUrl;

	public static void main(String[] args) {
		SpringApplication.run(ShopxApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}

	@PostConstruct
	public void init(){
		Stripe.apiKey = this.stripeSecret;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Frontend URL
		configuration.setAllowedOrigins(Arrays.asList(frontendUrl));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList(
			"authorization", 
			"content-type", 
			"x-auth-token", 
			"Authorization",
			"x-requested-with",
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Credentials"
		));
		configuration.setExposedHeaders(Arrays.asList(
			"x-auth-token",
			"authorization",
			"X-Total-Count"
		));
		configuration.setAllowCredentials(true);
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public CorsFilter corsFilter() {
		return new CorsFilter(corsConfigurationSource());
	}

}
