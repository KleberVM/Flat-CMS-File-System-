

exports.healthCheck = (req, res) => {
    res.json({ 
        message: 'API funcionando exitosamente',
        status: 200
    });
};