package com.comrepublic.shopx;


import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.stripe.Stripe;

import org.springframework.web.cors.CorsConfiguration;
import org.apache.catalina.filters.CorsFilter;

import java.util.Collections;
import java.util.Arrays;

@SpringBootApplication
public class ShopxApplication {
	
	@Value("${stripe.secret}")
	private String stripeSecret;

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

}
