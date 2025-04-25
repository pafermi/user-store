import { NextFunction ,Request, Response} from "express";

export class FileUploadMiddlleware {

    static containFiles(req: Request, res: Response, next: NextFunction){

        if (!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({error: 'No files were selected'})
        }
        
        if (!Array.isArray(req.files.file)){
            req.body.file = [ req.files.file ]
        }else{
            req.body.file = req.files.file
        }

        next()

    }


}