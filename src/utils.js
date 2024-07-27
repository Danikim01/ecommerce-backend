import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        let folder = ''
        switch (file.fieldname) {
            case 'profile':
                folder = 'public/profiles';
                break;
            case 'product':
                folder = 'public/products';
                break;
            case 'documents':
                folder = 'public/documents';
                break;
            default:
                folder = 'public/img'; // Por si acaso
        }
        cb(null,folder)
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage})
//export all functions and also the multer uploader
//export {generateToken, authToken, uploader}
