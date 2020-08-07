import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import { INestApplication } from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { getHost, getPort } from './common/config';

console.log(getPort())

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true, bodyParser: true});
  app.enableCors();

  initSwagger(app);
  await app.listen(3000);
}

export function initSwagger(app: INestApplication) {
  const builder = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('Swagger specification for Order Service API')
    .setVersion('0.0.0')
    .addSecurity('bearer', {
      type: 'apiKey',
      name: 'access_token',
      in: 'header',
    });

  const swaggerOpts = builder.build();
  const document = SwaggerModule.createDocument(app, swaggerOpts);
  writeFileSync(`./swagger.json`, JSON.stringify(document, null, 2), {encoding: 'utf8'});
  SwaggerModule.setup('doc/orders', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
    customSiteTitle: 'Order Service API',
  });
}


bootstrap();
