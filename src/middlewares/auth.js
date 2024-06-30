import jwt from 'jsonwebtoken';

// export const auth = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({
//             message: 'No authenticated'
//         });
//     }
//     const token = authHeader.split(' ')[1]; // Remove "Bearer"
//     console.log(token);
//     jwt.verify(token, 'coderSecret', (error, credentials) => {
//         if (error) {
//             return res.status(401).json({
//                 message: 'Invalid token'
//             });
//         }
//         req.user = credentials; // Assuming credentials contain user info
//         console.log(req.user);
//         next();
//     });
// };


const auth = (roles = []) => {
    return (req, res, next) => {
        console.log("User actual: ",req.user);
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            // Usuario no autorizado
            return res.status(403).send({ message: 'No autorizado' });
        }
        // Usuario autorizado
        next();
    }
}



export default auth;