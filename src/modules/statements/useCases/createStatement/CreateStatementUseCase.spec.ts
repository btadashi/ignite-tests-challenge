import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });


  it("should be able to make a deposit", async () => {
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

    const deposit = await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Deposit test",
      amount: 100.00,
      type: OperationType.DEPOSIT
    });

    expect(deposit).toHaveProperty("id");
  });

  it("should be able to make a withdrawal", async () => {
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

    await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Deposit test",
      amount: 100.00,
      type: OperationType.DEPOSIT
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Withdraw test",
      amount: 40.00,
      type: OperationType.WITHDRAW
    });

    expect(withdraw).toHaveProperty("id");
  });
})
