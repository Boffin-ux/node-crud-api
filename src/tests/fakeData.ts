const newUser = {
  username: 'User1',
  age: 29,
  hobbies: ['JS', 'TV'],
};

const updatedUser = {
  username: 'User1',
  age: 31,
  hobbies: ['JS', 'TV', 'football'],
};

const notValidUserName = {
  username: 123,
  age: 35,
  hobbies: ['JS', 'TV', 'football'],
};

const notValidAge = {
  username: 'User1',
  age: '31',
  hobbies: ['JS', 'TV', 'football'],
};

const notValidHobbies = {
  username: 'User1',
  age: 31,
  hobbies: ['JS', 'TV', 123],
};

const emptyHobbies = {
  username: 'User1',
  age: '31',
  hobbies: '',
};

export {
  newUser,
  updatedUser,
  notValidUserName,
  notValidAge,
  notValidHobbies,
  emptyHobbies,
};
