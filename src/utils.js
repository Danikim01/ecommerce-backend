import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/img")
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage})
//export all functions and also the multer uploader
//export {generateToken, authToken, uploader}
