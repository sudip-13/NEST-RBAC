import { Role } from '../entities/role.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Role, () => {
  const role = new Role();
  role.name = 'Default Role';
  role.description = 'Default role description';
  // Slug will be generated automatically by entity hook
  return role;
});
