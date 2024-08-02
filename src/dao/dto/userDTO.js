export default class UserDTO{
    constructor(user){
        this.first_name = user.first_name ?? ' ';
        this.last_name = user.last_name ?? ' ';
        this.email = user.email ?? ' ';
        this.age = user.age ?? 0;
        this.password = user.password ?? ' ';
        this.role = user.role ?? ' ';
        this._id = user._id
    }

    getRelevantInfo(){
        return {
            full_name: this.first_name + ' ' + this.last_name,
            email: this.email,
            role: this.role,
            id: this._id
        }
    }
}