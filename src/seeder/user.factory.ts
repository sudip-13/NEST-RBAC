import { User } from '../entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, () => {
  const user = new User();
  user.email = 'user@example.com';
  user.password = 'password';
  // Password will be hashed automatically by entity hook
  return user;
});
