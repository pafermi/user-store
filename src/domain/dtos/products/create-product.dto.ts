import { Validators } from "../../../config/validators"


export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly user: string, //id
        public readonly category: string,//id
    ){}

    static create(object: {[key:string]:any}) : [string?,CreateProductDto?] {
        
        const {name, availabe = false,price,user,category} = object
        let availabeBoolean = availabe

        if (typeof availabe !== 'boolean'){
            availabeBoolean = (availabe ==='true')
        }

        if (!name ) return ['Missing name']
        if (!user ) return ['Missing user']
        if (!Validators.isMongoID(user)) return ['Invalid user id']
        if (!category ) return ['Missing category']
        if (!Validators.isMongoID(category)) return ['Invalid category id']
        
        return [undefined,new CreateProductDto(name,availabeBoolean,price,user,category)]
    }

}