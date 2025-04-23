package com.hospitalmgmt.rsmlh;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RsmlthMgmtSwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hospital Management API")
                        .version("1.0.0")
                        .description("API for managing hospital appointments, doctors, and patients"));
    }

    @Bean
    public GroupedOpenApi rsmlhSwaggerConfig() {
        return GroupedOpenApi.builder()
                .group("Hospital Management API")
                .pathsToMatch("/rsmlhmgmt/**")
                .build();
    }
}