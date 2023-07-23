import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Res } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Response } from "express";
import { Document } from "mongodb";

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

  @Get()
  async findOne(@Body() payload: Document, @Res() response: Response) {
    if ("date" in payload) {
      const [status, reservation] = await this.reservationService.findOne(payload.date);
      response.status(status).send(reservation);
    }
    response.status(HttpStatus.NOT_ACCEPTABLE).send();
  }

  @Get("/available")
  async isAvailable(@Body() payload: Document, @Res() response: Response) {
    if ("date" in payload) {
      response.status(await this.reservationService.isAvailable(payload.date)).send();
    }
    response.status(HttpStatus.NOT_ACCEPTABLE).send();
  }

  @Patch()
  async update(
    @Body() newValues: Document, @Res() response: Response) {
    if ("oldDate" in newValues && "date" in newValues) {
      const oldId = newValues.oldDate;
      delete newValues.oldDate;
      const [status, reservation] = await this.reservationService.update(oldId, newValues);
      response.status(status).send(reservation);
    }
    response.status(HttpStatus.NOT_ACCEPTABLE).send();
  }

  @Delete()
  async remove(@Body() payload: Document, @Res() response: Response) {
    if ("date" in payload) {
      response.status(await this.reservationService.remove(payload.date)).send();
    }
    response.status(HttpStatus.NOT_ACCEPTABLE).send();
  }
}
