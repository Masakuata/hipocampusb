import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { Response } from "express";

@Controller("reservation")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {
  }

  @Post()
  async create(@Body() newReservation: CreateReservationDto, @Res() response: Response) {
    const [status, reservation] = await this.reservationService.create(newReservation);
    response.status(status).send(reservation);
  }

  @Get()
  async findAll(@Res() response: Response) {
    const [status, reservations] = await this.reservationService.findAll();
    response.status(status).send(reservations);
  }

  @Get(":date")
  async findOne(@Param("date") date: string, @Res() response: Response) {
    const [status, reservation] = await this.reservationService.findOne(date);
    response.status(status).send(reservation);
  }

  @Get(":date/available")
  async isAvailable(@Param("date") date: string, @Res() response: Response) {
    response.status(await this.reservationService.isAvailable(date)).send();
  }

  @Patch(":date")
  async update(
    @Param("date") date: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @Res() response: Response) {
    const [status, reservation] = await this.reservationService.update(date, updateReservationDto);
    response.status(status).send(reservation);
  }

  @Delete(":date")
  async remove(@Param("date") date: string, @Res() response: Response) {
    response.status(await this.reservationService.remove(date)).send();
  }
}
