/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const hashPassword = (userPassword: any) => {
  const encryptedPassword = bcrypt.hashSync(userPassword, saltRounds);
  return encryptedPassword;
};

const passwordCheck = (newPassword: any, existingPassword: any) => {
  return bcrypt.compareSync(newPassword, existingPassword);
};

export { hashPassword , passwordCheck};
