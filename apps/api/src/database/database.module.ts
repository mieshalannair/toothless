import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://cluster0.vaqjkqi.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority',
      {
        sslKey: `${__dirname}/assets/X509-cert-8602079041585527633.pem`,
        sslCert: `${__dirname}/assets/X509-cert-8602079041585527633.pem`,
        ssl: true,
        sslValidate: true,
        authMechanism: 'MONGODB-X509',
      }
    ),
  ],
})
export class DatabaseModule {}
