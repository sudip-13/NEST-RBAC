import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Starting database seeding...');

    // Get factories
    const permissionFactory = factoryManager.get(Permission);
    const roleFactory = factoryManager.get(Role);
    const userFactory = factoryManager.get(User);

    try {
      // 1. Create permissions
      console.log('Seeding permissions...');

      // Define CRUD permissions for each resource
      const permissionData = [
        // User permissions
        { name: 'Create Users', description: 'Ability to create new users' },
        { name: 'Read Users', description: 'Ability to view users' },
        { name: 'Update Users', description: 'Ability to update user details' },
        { name: 'Delete Users', description: 'Ability to delete users' },

        // Role permissions
        { name: 'Create Roles', description: 'Ability to create new roles' },
        { name: 'Read Roles', description: 'Ability to view roles' },
        { name: 'Update Roles', description: 'Ability to update role details' },
        { name: 'Delete Roles', description: 'Ability to delete roles' },

        // Permission permissions
        {
          name: 'Create Permissions',
          description: 'Ability to create new permissions',
        },
        {
          name: 'Read Permissions',
          description: 'Ability to view permissions',
        },
        {
          name: 'Update Permissions',
          description: 'Ability to update permission details',
        },
        {
          name: 'Delete Permissions',
          description: 'Ability to delete permissions',
        },
      ];

      const permissions: Permission[] = [];

      for (const data of permissionData) {
        // Create permission using factory and save to database
        const permission = await permissionFactory.save({
          name: data.name,
          description: data.description,
        });
        permissions.push(permission);
      }

      // 2. Create roles with permissions
      console.log('Seeding roles...');

      // Create Super Admin role with all permissions
      const superAdminRole = await roleFactory.save({
        name: 'Super Admin',
        description: 'Role with all permissions',
        permissions: permissions,
      });

      // Create User role with only Read permissions
      const readPermissions = permissions.filter((p) =>
        p.name.startsWith('Read'),
      );
      const userRole = await roleFactory.save({
        name: 'Admin',
        description: 'Regular user with limited permissions',
        permissions: readPermissions,
      });

      // 3. Create users with roles
      console.log('Seeding users...');

      // Create Super Admin user
      await userFactory.save({
        email: 'super_admin@app.com',
        password: 'password',
        roles: [superAdminRole],
      });

      // Create regular user
      await userFactory.save({
        email: 'admin@app.com',
        password: 'password',
        roles: [userRole],
      });

      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error during database seeding:', error);
      throw error;
    }
  }
}
