package com.travelplatform.travel_platform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
	@Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
	
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve React chunks from target/classes/static
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/")
                .setCachePeriod(0);
                
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/")
                .setCachePeriod(0);
                
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(3600);
                
        registry.addResourceHandler("/fonts/**")
                .addResourceLocations("classpath:/static/fonts/")
                .setCachePeriod(86400);

        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
    }
	
	@Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward all non-API routes to React app
        registry.addViewController("/{path:^(?!api).*}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{path:^(?!api).*}")
                .setViewName("forward:/index.html");
        registry.addViewController("/")
                .setViewName("forward:/index.html");
    }
}
