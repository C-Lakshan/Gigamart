package com.comrepublic.shopx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("ComRepublic APIs")
                        .description("'ComRepublic' E-commerce Application for computer accessories selling shop ~ APIs")
                        .version("1.0"));
    }
}