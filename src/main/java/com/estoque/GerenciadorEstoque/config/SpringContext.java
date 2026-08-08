package com.estoque.GerenciadorEstoque.config;

import org.springframework.context.ConfigurableApplicationContext;

public class SpringContext {

    private static ConfigurableApplicationContext context;

    public static ConfigurableApplicationContext getContext() {
        return context;
    }

    public static void setContext(ConfigurableApplicationContext context) {
        SpringContext.context = context;
    }
}