import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { MongoHandler } from "../connection/mongoHandler";
import { Document, WithId } from "mongodb";

@Injectable()
export class ReservationService {
  static readonly mongo = new MongoHandler("randomStorage", "hipocampusR");

  async create(createReservationDto: CreateReservationDto): Promise<[HttpStatus, Document | null]> {
    const available = await this.isAvailable(createReservationDto.date);
    if (available === HttpStatus.OK) {
      const reservation = await ReservationService.mongo.insertOne(createReservationDto);
      if (reservation === null) {
        return [HttpStatus.INTERNAL_SERVER_ERROR, null];
      }
      return [HttpStatus.CREATED, reservation];
    }
    return [HttpStatus.CONFLICT, null];
  }

  async isAvailable(date: string): Promise<HttpStatus.OK | HttpStatus.CONFLICT> {
    if (await ReservationService.mongo.count({ date }) > 0) {
      return HttpStatus.OK;
    }
    return HttpStatus.CONFLICT;
  }

  async findAll(): Promise<[HttpStatus, WithId<Document>[] | null]> {
    const reservations = await ReservationService.mongo.findMany({});
    if (reservations !== null) {
      const array = await reservations.toArray();
      if (array.length > 0) {
        return [HttpStatus.OK, array];
      } else {
        return [HttpStatus.NO_CONTENT, null];
      }
    } else {
      return [HttpStatus.INTERNAL_SERVER_ERROR, null];
    }
  }

  async findOne(date: string): Promise<[HttpStatus, Document | null]> {
    const reservation = await ReservationService.mongo.findOne({ date });
    if (reservation === null) {
      return [HttpStatus.NOT_FOUND, null];
    }
    return [HttpStatus.OK, reservation];
  }

  async update(date: string, updateReservationDto: UpdateReservationDto): Promise<[HttpStatus, Document | null]> {
    if (await ReservationService.mongo.updateOne({ date }, updateReservationDto)) {
      return [HttpStatus.NOT_FOUND, await ReservationService.mongo.findOne({ date })];
    } else {
      return [HttpStatus.NOT_FOUND, null];
    }
  }

  async remove(date: string): Promise<HttpStatus.OK | HttpStatus.NOT_FOUND> {
    if (await ReservationService.mongo.deleteOne({ date })) {
      return HttpStatus.OK;
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }
}
