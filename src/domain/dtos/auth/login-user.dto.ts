import { regularExps } from "../../../config/regular-exp";

export class LoginUserDto {

    constructor(
        public readonly email: string,
        public readonly password: string
    ){}

    static create(object: {[key:string]:any}) : [string?,LoginUserDto?] {

        const {email, password} = object;

        if(!email) return ['Missing email'];
        if(!regularExps.email.test(email)) return ['Email not valid'];
        if(!password) return ['Missing password'];
        if(password.length < 6) return ['Password too short'];
        
        return [undefined,new LoginUserDto(email,password)]
    }

}