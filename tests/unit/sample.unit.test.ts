import { User } from '../../src/entities/User';

describe('User Entity', () => {
    it('should create a User instance with the correct properties', () => {
        const user = new User();
        user.id = 1;
        user.name = 'John Doe';
        user.email = 'john.doe@example.com';

        expect(user.id).toBe(1);
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('john.doe@example.com');
    });

    it('should fail if name is not provided', () => {
        const user = new User();
        user.id = 1;
        user.email = 'john.doe@example.com';

        expect(user.name).toBeUndefined();
    });
});