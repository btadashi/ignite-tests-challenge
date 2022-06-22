import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "../../useCases/getStatementOperation/GetStatementOperationError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get statement operation", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "1234"
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    const depositCreated = await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Deposit test",
      amount: 100.00,
      type: OperationType.DEPOSIT
    });

    const withdrawCreated = await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Withdraw test",
      amount: 60.00,
      type: OperationType.WITHDRAW
    });

    const deposit = await getStatementOperationUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      statement_id: depositCreated.id as string
    });

    const withdraw = await getStatementOperationUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      statement_id: withdrawCreated.id as string
    });

    expect(deposit).toHaveProperty("id");
    expect(withdraw).toHaveProperty("id");
  });

  it("should not be able to get a nonexistent statement operation", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "1234"
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    const depositCreated = await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Deposit test",
      amount: 100.00,
      type: OperationType.DEPOSIT
    });

    const withdrawCreated = await createStatementUseCase.execute({
      user_id: userAuthenticated.user.id as string,
      description: "Withdraw test",
      amount: 60.00,
      type: OperationType.WITHDRAW
    });


    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: userAuthenticated.user.id as string,
        statement_id: "nonexistent"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: userAuthenticated.user.id as string,
        statement_id: "nonexistent"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  });
});
