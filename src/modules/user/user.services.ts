import database from "../../database";

class UserServices {
  async createUser(name: string): Promise<any> {
    const { test: testModel } = database.db1;
    return await testModel.create({ data: { name } });
  }
}

export default new UserServices();
