import { IUserData } from './interfaces';

const validateName = ({ username }: IUserData) => {
  return typeof username === 'string' && username.length > 0;
};

const validateAge = ({ age }: IUserData) => {
  return typeof age === 'number' && age > 0;
};

const validateHobbies = ({ hobbies }: IUserData) => {
  return (
    Array.isArray(hobbies) &&
    hobbies.every((hobby) => typeof hobby === 'string')
  );
};

export const validateUserData = (userData: IUserData) => {
  return (
    validateName(userData) &&
    validateAge(userData) &&
    validateHobbies(userData) &&
    Object.keys(userData).length < 4
  );
};
