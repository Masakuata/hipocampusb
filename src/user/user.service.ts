import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { MongoHandler } from "../connection/mongoHandler";
import { Document } from "mongodb";

@Injectable()
export class UserService {
  static readonly mongo = new MongoHandler("randomStorage", "hipocampus");

  async create(createUserDto: CreateUserDto): Promise<[HttpStatus, Document | null]> {
    if (await this.isRegistered(createUserDto.email)) {
      return [HttpStatus.CONFLICT, null];
    }

    const registeredUser = await UserService.mongo.insertOne(createUserDto);
    if (registeredUser === null) {
      return [HttpStatus.INTERNAL_SERVER_ERROR, null];
    }
    return [HttpStatus.CREATED, registeredUser];
  }

  async findOne(_id: string): Promise<[HttpStatus, Document | null]> {
    const user = await UserService.mongo.findById(_id);
    if (user !== null) {
      return [HttpStatus.OK, user];
    }
    return [HttpStatus.NOT_FOUND, null];
  }

  async update(_id: string, updateUserDto: Document): Promise<[HttpStatus, Document | null]> {
    if ("email" in updateUserDto) {
      delete updateUserDto.email;
    }
    if (await UserService.mongo.updateById(_id, updateUserDto)) {
      return [HttpStatus.OK, await UserService.mongo.findOne({ _id })];
    }
    return [HttpStatus.NOT_FOUND, null];
  }

  async remove(_id: string): Promise<HttpStatus> {
    if (await UserService.mongo.deleteById(_id)) {
      return HttpStatus.NO_CONTENT;
    }
    return HttpStatus.NOT_FOUND;
  }

  private async isRegistered(email: string): Promise<boolean | null> {
    return await UserService.mongo.count({ email: email }) > 0;
  }
}
