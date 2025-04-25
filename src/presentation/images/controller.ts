import { Request,Response } from "express"
import { CustomError } from "../../domain/errors/custom.error"
import path from "path"
import  fs  from "fs"



export class ImageController {

    //DI
    constructor(){}

    getImage = async (req: Request, res: Response) => {

        const {imgID = '', type = ''}= req.params

        const imagePath = path.resolve(__dirname,`../../../uploads/${type}/${imgID}`)

        if (!fs.existsSync(imagePath)) 
            return res.status(404).send('Image Not Found')

        res.sendFile(imagePath)


    }

    
}