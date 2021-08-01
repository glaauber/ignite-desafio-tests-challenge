import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository
let usersRepository: InMemoryUsersRepository

describe("Create Statement", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository)
  })

  it("should not be able to create a new statement if user not found", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "12345",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to do a withdraw with insufficient funds", () => {
    expect(async () => {
      const user = await usersRepository.create({email: "mail@mail.com",name: "user1", password: "1234"})
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "test"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it("should be able to create a new statement", async () => {
      const user = await usersRepository.create({email: "mail@mail.com",name: "user1", password: "1234"})
      const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test"
      })
      expect(statement).toHaveProperty("id")
  })
})
