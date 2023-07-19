import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { HttpStatus } from "@nestjs/common";

const userService = new UserService();

let id: string = null;

describe("Users module", () => {
  test("The user registers", async () => {
    const newUser = new CreateUserDto();
    newUser.email = "mail@mail.com";
    newUser.password = "password1qa2ws3ed";
    newUser.fullname = "Miguel Tajardo Lombardo Ortiz";

    const [status, user] = await userService.create(newUser);
    expect(status).toBe(HttpStatus.CREATED);
    expect(user).not.toBe(null);
    id = user._id;
  });

  test("Fetch user information", async () => {
    const [status, user] = await userService.findOne(id);
    expect(status).toBe(HttpStatus.OK);
    expect(user).not.toBe(null);
  });

  test("Delete user", async () => {
    const status = await userService.remove(id);
    expect(status).toBe(HttpStatus.NO_CONTENT);
  });
});
