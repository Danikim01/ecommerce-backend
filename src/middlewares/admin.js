const check_admin = (req, res, next) => {
    console.log("Checking admin: ",req.body);
    if (req.body.email === 'admin@gmail.com' && req.body.password === 'admin') {
        req.body.role = 'admin';
    }else{
        req.body.role = 'user';
    }
    next();
};

export default check_admin;
