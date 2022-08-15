const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

module.exports = class UserService {

  static async createAndSignIn({ username, email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({ 
      username, 
      email, 
      passwordHash 
    });

    if (!user) throw new Error('Email already exists');
    if (!bcrypt.compareSync(password, user.passwordHash))
      throw new Error('Invalid password');

    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    return token;
  }

};
