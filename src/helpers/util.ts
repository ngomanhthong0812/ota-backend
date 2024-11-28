const bcrypt = require('bcrypt');
const saltRounds = 10; // Số lần xử lý băm

export const hashPasswordHelper = async (
  plainPassword: string,
): Promise<string> => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.log(error);
  }
};
