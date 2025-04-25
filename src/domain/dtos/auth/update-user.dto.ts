import { regularExps } from "../../../config/regular-exp";

export class UpdateUserDto {

    constructor(
        public readonly email: string,
        public readonly name: string,
        public readonly lastname: string,
        public readonly celphone: string,
        public readonly otherphone: string
    ){}

    static create(object: {[key:string]:any}) : [string?,UpdateUserDto?] {

        const {email, name,lastname,celphone,otherphone} = object;

        if(!email) return ['Missing email'];
        if(!regularExps.email.test(email)) return ['Email not valid'];
        if(!name) return ['Missing name'];
        if(!celphone && !otherphone) return ['Missing phones'];
    
        return [undefined,new UpdateUserDto(email,name,lastname,celphone,otherphone)]
    }

}