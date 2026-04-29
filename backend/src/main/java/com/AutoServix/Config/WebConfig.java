package com.AutoServix.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Forward all non-API, non-static routes to index.html for React Router
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
        registry.addViewController("/{path1}/{path2:[^\\.]*}").setViewName("forward:/index.html");
        registry.addViewController("/{path1}/{path2}/{path3:[^\\.]*}").setViewName("forward:/index.html");
    }
}
