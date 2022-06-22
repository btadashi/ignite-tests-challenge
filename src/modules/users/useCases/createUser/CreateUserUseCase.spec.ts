import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });


  it("should be able to create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "1234"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  })
});
