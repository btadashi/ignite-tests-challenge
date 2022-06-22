import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });


  it("should be able to authenticate a user", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "1234"
    }

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(userAuthenticated).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@example.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(AppError);

  });

  it("should not be able to authenticate user with incorrect password", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "1234"
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "john@example.com",
        password: "incorrect_password"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
