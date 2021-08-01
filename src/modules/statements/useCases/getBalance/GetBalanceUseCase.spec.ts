import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let statementsRepository: InMemoryStatementsRepository
let usersRepository: InMemoryUsersRepository

describe("Get Balance", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository,usersRepository)
  })

  it("should not be able to get balance if user not found", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "12345"
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })


  it("should be able to create a new statement", async () => {
      const user = await usersRepository.create({email: "mail@mail.com",name: "user1", password: "1234"})
      const balance = await getBalanceUseCase.execute({user_id: user.id as string})
      expect(balance.balance).toBe(0)
      expect(balance.statement.length).toBe(0)
  })
})
