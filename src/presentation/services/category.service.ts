import { CategoryModel } from "../../data/mongo/models/category.model";
import { CreateCategoryDto } from "../../domain/dtos/cetegory/create-category.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";


export class CategoryService { 

    constructor(){}

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity){

        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name})
        if(categoryExists) throw CustomError.badRequest('Category already exists')

        try {
            const category = new CategoryModel({...createCategoryDto,user:user.id})
            await category.save()

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
            
        } catch (error) {
            throw CustomError.internalServer('Internal Server error')
        }
    }

    async getCategories(paginationDto:PaginationDto){

        const {page , limit} = paginationDto
        try {
            
            const skip = (page - 1) * limit
            const cartegories = await CategoryModel.find({}).skip(skip).limit(limit)

            const result = cartegories.map(category => ({
                id:category.id,
                name:category.name,
                available: category.available
            }))
            return result
           
        } catch (error) {
            throw CustomError.internalServer('Internal Server error')
        }
    }
}