import { Validators } from "../../../config/validators"


export class UpdatePoliticDto {

    private constructor(
        public readonly nombre: string,
        public readonly apellido: string,
        public readonly edad: number,
        public readonly rol: string,
        public readonly partido_politico: string,
        public readonly sueldo: number,
        public readonly fecha_ingreso: Date,
        public readonly rol_previo: string,
        public readonly comentarios: string,
    ){}

    static create(object: {[key:string]:any}) : [string?,UpdatePoliticDto?] {
       
        const {nombre, apellido, edad, rol, partido_politico, sueldo, fecha_ingreso, rol_previo, comentarios} = object
       
        if (!nombre ) return ['Missing name']
        if (!apellido ) return ['Missing last name']
        if (!edad ) return ['Missing age']
        if (!rol ) return ['Missing rol']
        enum Roles {
            PRESIDENTE = "PRESIDENTE",
            SENADOR = "SENADOR",
            DIPUTADO = "DIPUTADO",
            GOBERNADOR = "GOBERNADOR",
            ALCALDE = "ALCALDE"
        }
        if (!Object.values(Roles).includes(rol)) return ['Invalid role']
        if (!partido_politico ) return ['Missing political party']
   
        if (!fecha_ingreso ) return ['Missing entry date']
        if (isNaN(Date.parse(fecha_ingreso))) return ['Invalid entry date']
        if (!(fecha_ingreso instanceof Date) || isNaN(fecha_ingreso.getTime())) return ['Entry date must be a valid date']

        return [undefined,new UpdatePoliticDto( nombre, apellido, edad, rol, partido_politico, sueldo, fecha_ingreso, rol_previo, comentarios)]
    }

}