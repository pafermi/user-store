import { PoliticModel } from "../../data/mongo/models/politic.model"
import { CreatePoliticDto } from "../../domain/dtos/politics/create-politic.dto"
import { UpdatePoliticDto } from "../../domain/dtos/politics/update-politic.dto"
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto"
import { CustomError } from "../../domain/errors/custom.error"


export class PoliticService { 

    constructor(){}

    async createPolitic(createPoliticDto: CreatePoliticDto){

        const politicExists = await PoliticModel.findOne({nombre: createPoliticDto.nombre})
        if(politicExists) throw CustomError.badRequest('Politic already exists')

        try {
            const politic = new PoliticModel(CreatePoliticDto)
           
            await politic.save()

            return politic
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async getPolitics(paginationDto: PaginationDto){
        try {
            const { page, limit } = paginationDto
            const skip = (page - 1) * limit
            const total = await PoliticModel.countDocuments()
            const politics = await PoliticModel.find().skip(skip).limit(limit)
            
            return {
                total,
                page,
                limit,
                politics
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async searchPolitics(search: string){
        try {
            const politics = await PoliticModel.find({
                $or: [
                    { nombre: { $regex: search, $options: 'i' } },
                    { apellido: { $regex: search, $options: 'i' } },
                    { rol: { $regex: search, $options: 'i' } },
                    { partido_politico: { $regex: search, $options: 'i' } },
                    { rol_previo: { $regex: search, $options: 'i' } },
                    { comentarios: { $regex: search, $options: 'i' } },
                    { fecha_ingreso: { $regex: search, $options: 'i' } },
                    { sueldo: { $regex: search, $options: 'i' } },
                    { edad: { $regex: search, $options: 'i' } },
                    { ratings: { $regex: search, $options: 'i' } },
                    { declarations: { $regex: search, $options: 'i' } },    
                ]
            })
            return politics
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async getPoliticById(id: string){
        try {
            const politic = await PoliticModel.findById(id)
            
            if (!politic) throw CustomError.notFound('Politic not found')
            
            return politic

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async updatePolitic(id: string, updatePoliticDto: UpdatePoliticDto){
        try {
            const politic = await PoliticModel.findByIdAndUpdate(id, updatePoliticDto, { new: true })
            if (!politic) throw CustomError.notFound('Politic not found')
            return politic
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async deletePolitic(id: string){
        try {
            const politic = await PoliticModel.findByIdAndDelete(id)
            
            if (!politic) throw CustomError.notFound('Politic not found')
       
            return politic
       
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

}