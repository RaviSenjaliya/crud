import { Prisma, PrismaPromise, User } from "@prisma/client";
import database from "../../database";

class AuthServices {
  signUp(userData: Prisma.UserCreateInput): PrismaPromise<User> {
    const { user: userModel } = database.db1;
    return userModel.create({
      data: userData,
    });
  }

  /*
   *  @param email [string]
   */
  getUser(email: string): PrismaPromise<User> {
    const { user: userModel } = database.db1;
    return userModel.findFirst({
      where: {
        email: email,
      },
    });
  }
}

export default new AuthServices();
