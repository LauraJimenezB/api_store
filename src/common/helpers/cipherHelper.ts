import * as bcrypt from 'bcrypt';
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export const getHash = (password: string) => {
  return bcrypt.hashSync(password, salt);
};
