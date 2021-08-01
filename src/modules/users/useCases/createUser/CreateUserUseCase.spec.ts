import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should not be able to create an user if the email already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user1",
        email: "mail@mail.com",
        password: "1234"
      })

      await createUserUseCase.execute({
        name: "user2",
        email: "mail@mail.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "user1",
      email: "mail@mail.com",
      password: "1234"
    })

    expect(user).toHaveProperty("id")
    expect(user.name).toBe("user1")
    expect(user.email).toBe("mail@mail.com")
  })
})
