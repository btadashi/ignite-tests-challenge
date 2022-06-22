import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });


  it("it should be able to get user's balance", async () => {
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

    await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Withdraw test",
      amount: 60.00,
      type: OperationType.WITHDRAW
    });

    const balance = await getBalanceUseCase.execute({ user_id: userAuthenticated.user.id as string });

    expect(balance).toHaveProperty("statement");
  });
});
