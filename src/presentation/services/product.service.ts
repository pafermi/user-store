import { ProductModel } from "../../data/mongo/models/product.model"
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto"
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto"
import { UserEntity } from "../../domain/entities/user.entity"
import { CustomError } from "../../domain/errors/custom.error"


export class ProductService { 

    constructor(){}

    async createProduct(createProductDto: CreateProductDto, user: UserEntity){

        const productExists = await ProductModel.findOne({name: createProductDto.name})
        if(productExists) throw CustomError.badRequest('Category already exists')

        try {
            const product = new ProductModel(createProductDto)
           
            await product.save()

            return product
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async getProducts(paginationDto:PaginationDto){

        const {page , limit} = paginationDto
        const skip = (page - 1) * limit

        try {
            
            // const [total, products] = await Promise.all(
            //     [
            //         ProductModel.countDocuments(),
            //         ProductModel
            //         .find()
            //         .skip(skip)
            //         .limit(limit)
            //         .populate('user','name email')
            //         .populate('category')
            //     ]
            // )

            // return {
            //     page: page,
            //     limit: limit,
            //     total: total,
            //     next: `/api/products?page=${(page + 1 )}&limit=${limit}`,
            //     prev: (page-1 > 0) ? `/api/products?page=${(page - 1 )}&limit=${limit}` : null,
            //     products: products
            // }
            const productos = await ProductModel.find({})
        
            return{
                ok: true,
                productos
            }
           
        } catch (error) {
            throw CustomError.internalServer('Internal Server error')
        }
    }
}