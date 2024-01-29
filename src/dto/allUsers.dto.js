export default class AllUsersDTO {
    constructor(users) {
        if (!Array.isArray(users)) {
            console.error('Se esperaba un array de usuarios');
            return;
        }

        this.users = users.map(user => ({
            id: user._id,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }));
    }
}