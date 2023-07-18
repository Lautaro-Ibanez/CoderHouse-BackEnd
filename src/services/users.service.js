export default class UsersService {
  constructor(dao) {
    this.dao = dao;
  }

  getAllUsers = () => {
    return this.dao.getUsers();
  };

  addUser = () => {
    return this.dao.saveUser();
  };

  getUserBy = (params) => {
    return this.dao.getUserBy(params);
  };

  updateUser = (id, user) => {
    return this.dao.updateUser(id, user);
  };

  deleteUser = (id) => {
    return this.dao.deleteUser(id);
  };
}
