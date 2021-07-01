const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware')

router.get('/play', (req, res, next) => {
    res.render('playground/play', {title: 'playground', flashMessage: {}})
})
router.post('/play', upload.single('my-file'), (req, res, next) => {
        res.redirect('/playground/play')

        if(req.file){
            console.log(req.file);
        }
        
    })


module.exports = router;