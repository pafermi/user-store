

export class CreateCategoryDto {

    private constructor(
        public readonly name: string,
        public readonly availabe: boolean,
    ){}

    static create(object: {[key:string]:any}) : [string?,CreateCategoryDto?] {
        
        const {name, availabe = false} = object
        let availabeBoolean = availabe

        if (!name ) return ['Missing name']
        if (typeof availabe !== 'boolean'){
            availabeBoolean = (availabe ==='true')
        }
        return [undefined,new CreateCategoryDto(name,availabeBoolean)]
    }
}