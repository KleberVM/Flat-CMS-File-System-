exports.login = (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ 
            auth: true, 
            message: "Acceso Permitido" 
        });
    } else {
        res.status(401).json({ 
            auth: false, 
            message: "Contraseña incorrecta" 
        });
    }
};