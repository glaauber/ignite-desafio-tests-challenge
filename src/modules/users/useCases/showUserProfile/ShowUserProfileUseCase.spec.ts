import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show user profile",() => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it("should not be able to show user profile if user not found", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user1",
        email: "mail@mail.com",
        password: "1234"
      })

      await showUserProfileUseCase.execute("12345")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "user1",
      email: "mail@mail.com",
      password: "1234"
    })

    const response = await showUserProfileUseCase.execute(user.id as string)

    expect(response.name).toBe("user1")
    expect(response.email).toBe("mail@mail.com")
  })
})
