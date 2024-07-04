const check_admin = (req, res, next) => {
    if (req.body.email === 'admin@gmail.com' && req.body.password === 'admin') {
        req.body.role = 'admin';
    }else{
        req.body.role = 'user';
    }
    next();
};

export default check_admin;
