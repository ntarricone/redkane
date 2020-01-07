const videos = require('../models/videos.js')
const videosController = {};

videosController.getVideos = async (req, res) => {
    videos.find({}, (err, results) => {
        if(err){
            res.status(500).send({message: 'Error 500'});
        }
        if(!results){
            res.status(404).send({message: 'no existe esta película'})
        }
        res.json(results)
    })  
}

videosController.createVideo = async (req, res) => {
    
    const video = new videos(req.body);

    videos.title = req.body.title;
    videos.genre = req.body.genre;
    videos.status = req.body.status;
    videos.poster = req.body.poster;

    await video.save();
    res.json({
        video
    })


}
videosController.getVideo = async (req, res) => {
    const { id } = req.params
    const video = await videos.findById(id);
    res.json(video)
}
videosController.editVideo = async (req, res) => {
    const { id } = req.params;
    const { title, genre, status, poster } = req.body
    const video = { title, genre, status, poster };
    await videos.findByIdAndUpdate(id, {$set: video}, {new: true});
    res.json({status: 'Artículo actualizada'})
};
videosController.deleteVideo = async (req, res) => {
    const { id } = req.params;
    await videos.findByIdAndDelete(id);
    res.json({status: 'Artículo eliminada'})
};

module.exports = videosController;