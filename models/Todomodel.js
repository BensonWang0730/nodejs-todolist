const todos = ["get todo"];

const todoModel = {
  getAll: () => {
    return todos;
  },

  get: (id) => {
    return todos[id];
  },
};

module.exports = todoModel;
