import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [UserModule, ReservationModule],
})
export class AppModule {}
