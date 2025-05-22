import { Request,Response } from "express"
import { CustomError } from "../../domain/errors/custom.error"
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto"
import { PoliticService } from "../services/politic.service"
import { CreatePoliticDto } from "../../domain/dtos/politics/create-politic.dto"
import { UpdatePoliticDto } from "../../domain/dtos/politics/update-politic.dto"


export class PoliticController {

    //DI
    constructor(
        private readonly politicService: PoliticService
    ){}
    // Manejo de errores
    private handleError = (error: unknown, res:Response)=> {
        if (error instanceof CustomError) return res.status(error.statusCode).json({error: error.message})

        console.log(`${error}`)
        return res.status(500).json({error:'Internal Server Error'})
    }

    // Crear un nuevo político
    createPolitic = async (req: Request, res: Response) => {

        const [error,createPoliticDto] = CreatePoliticDto.create({...req.body})
        
        if (error) return res.status(400).json(error)

        this.politicService.createPolitic(createPoliticDto!)
        .then( politic =>res.status(201).json({message:"Politic created",politic:politic}))
        .catch( error => this.handleError(error,res)) 
    }

    // Obtener todos los políticos
    getPolitics = async (req: Request, res: Response) => {  
        
        const { page = 1,limit = 10000 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page,+limit) //el + transforma en numero
        
        if (error) return res.status(400).json({error})

        this.politicService.getPolitics(paginationDto!)
        .then(politic => res.status(200).json(politic))
        .catch( error => this.handleError(error,res))
    }

    // Buscar políticos por cualquier campo
    searchPolitics= async (req: Request, res: Response) => {  
        
        const { search } = req.query

        if (!search) return res.status(400).json({error:'Missing search'})

        this.politicService.searchPolitics(search as string)
        .then(politic => res.status(200).json(politic))
        .catch( error => this.handleError(error,res))

    }

    // Obtener un político por ID
    getPoliticById= async (req: Request, res: Response) => {  
        const { id } = req.params

        if (!id) return res.status(400).json({error:'Missing id'})

        this.politicService.getPoliticById(id)
        .then(politic => res.status(200).json(politic))
        .catch( error => this.handleError(error,res))
    }

    // Actualizar un político por ID
    updatePolitic= async (req: Request, res: Response) => {  
        const { id } = req.params

        if (!id) return res.status(400).json({error:'Missing id'})

        const [error,updatePoliticDto] = UpdatePoliticDto.create({...req.body})
        
        if (error) return res.status(400).json(error)

        this.politicService.updatePolitic(id,updatePoliticDto!)
        .then(politic => res.status(200).json({message:'Politic updated',politic}))
        .catch( error => this.handleError(error,res))
    
    }

    // Eliminar un político por ID
    deletePolitic= async (req: Request, res: Response) => {  
        const { id } = req.params

        if (!id) return res.status(400).json({error:'Missing id'})

        this.politicService.deletePolitic(id)
        .then(politic => res.status(200).json({message:'Politic deleted'}))
        .catch( error => this.handleError(error,res))

    }
}