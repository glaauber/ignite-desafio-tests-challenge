import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"


let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase


describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it("should not be able to authenticate user if email is incorrect", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "mail@mail.com",
        name: "user1",
        password: "1234"
      })
      await authenticateUserUseCase.execute({
        email: "mailfake@mail.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate user if password is incorrect", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "mail@mail.com",
        name: "user1",
        password: "1234"
      })
      await authenticateUserUseCase.execute({
        email: "mail@mail.com",
        password: "12345"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      email: "mail@mail.com",
      name: "user1",
      password: "1234"
    })
    const response = await authenticateUserUseCase.execute({
      email: "mail@mail.com",
      password: "1234"
    })

    expect(response.user.email).toBe("mail@mail.com")
    expect(response.user.name).toBe("user1")
    expect(response).toHaveProperty("token")
  })

})
