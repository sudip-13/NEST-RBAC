import { Permission } from '../entities/permission.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Permission, () => {
  const permission = new Permission();
  permission.name = 'Default Permission';
  permission.description = 'Default permission description';
  // Slug will be generated automatically by entity hook
  return permission;
});
