import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Response } from "express";
import { Document } from "mongodb";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    const [status, newUser] = await this.userService.create(createUserDto);
    response.status(status).send(newUser);
  }

  @Post("/login")
  async login(@Body() credentials: Document, @Res() response: Response) {
    if ("email" in credentials && "password" in credentials) {
      const [status, user] = await this.userService.login(credentials.email, credentials.password);
      response.status(status).send(user);
    } else {
      response.status(HttpStatus.NOT_ACCEPTABLE).send();
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Res() response: Response) {
    const [status, user] = await this.userService.findOne(id);
    response.status(status).send(user);
  }

  @Patch(":id")
  async update(@Param("id") id: string,
               @Body() updateUserDto: UpdateUserDto,
               @Res() response: Response) {
    const [status, user] = await this.userService.update(id, updateUserDto);
    response.status(status).send(user);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res() response: Response) {
    response.status(await this.userService.remove(id)).send();
  }
}
