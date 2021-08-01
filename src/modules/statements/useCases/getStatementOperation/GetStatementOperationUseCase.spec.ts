import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase
let statementsRepository: InMemoryStatementsRepository
let usersRepository: InMemoryUsersRepository

describe("Get Statement Operation", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementsRepository)
  })

  it("should not be able to get statement operation if user not found", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id: "12345"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("should not be able to get statement operation if statement not found", () => {
    expect(async () => {
      const user = await usersRepository.create({email: "mail@mail.com",name: "user1", password: "1234"})
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "12345"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("should be able to get statement operation", async () => {
      const user = await usersRepository.create({email: "mail@mail.com",name: "user1", password: "1234"})
      const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test"
      })
      const search_result = await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: statement.id as string
      })
      expect(search_result).toHaveProperty("id")
      expect(search_result.amount).toBe(100)
      expect(search_result.description).toBe("test")
  })
})
