package com.comrepublic.shopx;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.stripe.Stripe;

import jakarta.annotation.PostConstruct;

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
