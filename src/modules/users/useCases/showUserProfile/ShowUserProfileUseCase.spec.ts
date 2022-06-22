import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });


  it("should be able to show user profile", async () => {
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

    const userProfile = await showUserProfileUseCase.execute(userAuthenticated.user.id as string);

    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
  });

  it("should not be able to show a nonexistent user", async () => {
    expect(async () => {
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

      const userProfile = await showUserProfileUseCase.execute("fakeId");

    }).rejects.toBeInstanceOf(ShowUserProfileError);



  });
})
