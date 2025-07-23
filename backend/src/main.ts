import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './helpers';

/**
 * @brief Application bootstrap function
 * @description Initializes and configures the NestJS application with CORS,
 *             Swagger documentation, and global exception handling
 * @returns {Promise<void>} Promise that resolves when the server is listening
 */
async function main() {
  const app = await NestFactory.create(AppModule);

  /**
   * @brief Configures CORS settings for cross-origin requests
   * @description Enables CORS with specific origins, methods, and headers for frontend integration
   */
  const configureCors = (): void => {
    app.enableCors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });
  };

  /**
   * @brief Sets up Swagger API documentation
   * @description Configures and mounts Swagger UI for API documentation at /api endpoint
   */
  const setupSwagger = (): void => {
    const config = new DocumentBuilder()
      .setTitle('QuantFox API')
      .setDescription('API documentation for QuantFox backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  };

  /**
   * @brief Configures global exception filter
   * @description Applies global exception handling for consistent error responses
   */
  const configureExceptionFilter = (): void => {
    app.useGlobalFilters(new GlobalExceptionFilter());
  };

  /**
   * @brief Starts the application server
   * @description Binds the application to the specified host and port
   * @returns {Promise<void>} Promise that resolves when server is listening
   */
  const startServer = async (): Promise<void> => {
    const port = process.env.PORT ? Number(process.env.PORT) : 8080;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);
  };

  configureCors();
  configureExceptionFilter();
  setupSwagger();
  await startServer();
}

main();
