import { IUserData } from '@src/interfaces';

export class UsersDb {
  private users: IUserData[];

  constructor() {
    this.users = [];
  }

  getUsers(): IUserData[] {
    return this.users;
  }

  getUser(userId: string): IUserData {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      throw new Error();
    }
    return user;
  }

  createUser(newUser: IUserData): IUserData {
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(userId: string): string {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error();
    }
    this.users.splice(userIndex, 1);
    return userId;
  }

  updateUser(userId: string, userData: IUserData): IUserData {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error();
    }
    this.users[userIndex] = { ...userData, id: userId };

    return this.users[userIndex];
  }
}
