const {Router} = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');
router.get('/', async (req, res) =>{
    const photos = await Photo.find();
   console.log(photos)
    res.render('imagen', {photos});
});

router.get('/imagen/subir',async (req, res) =>{
    const photos = await Photo.find(); 
    res.render('subir', {photos});
});

router.post('/imagen/subir',async (req, res)=>{
    const { title, description} = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
   const newPhoto = new Photo ({
       title,
       description,
       imagenURL: result.url,
       public_id: result.public_id  
    });
    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.redirect('/')
});

router.get('/imagen/delete/:id', async (req, res) =>{
    
    const id = req.params.id;
    console.log(id);
    const photo = await Photo.findByIdAndDelete(id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    console.log(result);
    res.redirect('/imagen/subir');
})

module.exports = router;