export default class UserDTO{
    constructor(user){
        this.first_name = user.first_name ?? ' ';
        this.last_name = last_name ?? ' ';
        this.email = email ?? ' ';
        this.age = age ?? 0;
        this.password = password ?? ' ';
        this.role = role ?? ' ';
    }
}