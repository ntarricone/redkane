const images = require('../models/images.js')
const imagesController = {};

imagesController.getImages = async (req, res) => {
    images.find({}, (err, results) => {
        if(err){
            res.status(500).send({message: 'Error 500'});
        }
        if(!results){
            res.status(404).send({message: 'no existe esta película'})
        }
        res.json(results)
    })  
}

imagesController.createImage = async (req, res) => {
    
    const image = new images(req.body);

    images.title = req.body.title;
    images.genre = req.body.genre;
    images.status = req.body.status;
    images.poster = req.body.poster;

    await image.save();
    res.json({
        image
    })


}
imagesController.getImage = async (req, res) => {
    const { id } = req.params
    const image = await images.findById(id);
    res.json(image)
}
imagesController.editImage = async (req, res) => {
    const { id } = req.params;
    const { title, genre, status, poster } = req.body
    const image = { title, genre, status, poster };
    await images.findByIdAndUpdate(id, {$set: image}, {new: true});
    res.json({status: 'Artículo actualizada'})
};
imagesController.deleteImage = async (req, res) => {
    const { id } = req.params;
    await images.findByIdAndDelete(id);
    res.json({status: 'Artículo eliminada'})
};

module.exports = imagesController;