const {pool} = require('../db/connection');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v4');
var fs = require('fs');

const storage = multer.diskStorage({
    destination: 'public/images/landingpage',
    filename: (req,file,cb) => {
        cb(null, uuid()+path.extname(file.originalname).toLocaleLowerCase());
    }
});

const uploadLandingPage = multer({
    storage: storage,
    dest: 'public/images/landingpage',
    limits: {fileSize: 1000000},//1 MB,
    fileFilter: (req,file,cb) => {
        const filetypes = /jpeg|jpg|png|gif|mp4|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname)
        {
            return cb(null, true);
        }
        cb("Error: Extension file no valid");
    }
}).array('file',2)

/*
const uploadAttachment = multer({
    storage: storage,
    dest: 'public/attachments',
    limits: {fileSize: 1000000},//1 MB,
    fileFilter: (req,file,cb) => {
        const filetypes = /jpeg|jpg|png|gif|pdf|mp4/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname)
        {
            return cb(null, true);
        }
        cb("Error: Extension file no valid");
    }
}).single('attachmentowner')
*/

const createLandingPage = async (req,res) => {
    console.log("PRUEBA");
    var tittle = req.body.newtittle;
    var subtittle = req.body.newsubtittle;
    var video = req.body.newvideo;
    var text = req.body.newtext;
    var newswname = req.body.newswname;
    var newswemail = req.body.newswemail;
    var newswtext = req.body.newswtext;
    var newswphone = req.body.newswphone;
    var newvideoyoutube = req.body.newvideoyoutube;
    
    const keyuser = req.session.keyuser;
    var originalFileName = req.files[0].filename;
    var originalFileAttachment = req.files[1].filename;
    //var originalFileNameOwner = req.file.filename;

    //console.log("Youtube: "+newvideoyoutube+" Attach1: "+originalFileName);
    //console.log(tittle+" "+subtittle+" "+originalFileName+" "+video+" "+text+" "+newswname+" "+newswemail);

    video = video.replace('watch?v=', 'embed/');

    const response = await pool.query('INSERT INTO public.landing_page(lan_tittle,lan_subtittle,lan_image,lan_video,lan_text,lan_sw_name,lan_sw_email,lan_sw_text,lan_sw_phone,use_key_inside,lan_video_owner,lan_attachment_owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [tittle,subtittle,originalFileName,video,text,newswname,newswemail,newswtext,newswphone,keyuser,newvideoyoutube,originalFileAttachment]);
    console.log(req.body);
    res.send("Your information is stored successfully");
}

const landingPage = (req,res) => {
    const my_session = req.session.my_session;
    
    //console.log("SESSION LUIS: "+my_session.username);
    if(!my_session)
    {
        res.redirect('/Login');
    }

    res.render('landing-page.ejs');
}

const showinfo = async (req,res) => {
    var searching = req.query.searching;
    const keyuser = req.session.keyuser;
    var profile = req.session.profileuser;
    var response = "";
    var rows;
    if(typeof searching === 'undefined'){ searching = ""; }
    
    if(profile == 1)
    {
        response = await pool.query("SELECT lan_key_inside as keylan,lan_tittle as tittle,lan_subtittle as subtittle,lan_image as image,lan_video as video,lan_text as textlan,lan_sw_name as namelan,lan_sw_email as email,lan_sw_text as swtext,lan_sw_phone as swphone,use_key_inside as keyuser,lan_attachment_owner as imageattachment,lan_video_owner videoowner FROM public.landing_page WHERE (UPPER(lan_tittle) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(lan_subtittle) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' )", function (err, result, fields) {
            if (err) throw err;
            rows = result.rows;
            res.send(rows);
          });
    }
    else
    {
        response = await pool.query("SELECT lan_key_inside as keylan,lan_tittle as tittle,lan_subtittle as subtittle,lan_image as image,lan_video as video,lan_text as textlan,lan_sw_name as namelan,lan_sw_email as email,lan_sw_text as swtext,lan_sw_phone as swphone,use_key_inside as keyuser,lan_attachment_owner as imageattachment,lan_video_owner videoowner FROM public.landing_page WHERE use_key_inside = "+keyuser+" and (UPPER(lan_tittle) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(lan_subtittle) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' )", function (err, result, fields) {
            if (err) throw err;
            rows = result.rows;
            res.send(rows);
          });
    }
}

const updateLandingPage = async (req,res) => {
    var tittle = req.body.edittittle;
    var subtittle = req.body.editsubtittle;
    var imageOld = req.body.editimage;
    var imageAttachmentOld = req.body.editimageattachment;
    var video = req.body.editvideo;
    var text = req.body.edittext;
    var editswname = req.body.editswname;
    var editswemail = req.body.editswemail;
    var editswtext = req.body.editswtext;
    var editswphone = req.body.editswphone;
    var editkeylan = req.body.editkeylan;
    var editvideoyoutube = req.body.editvideoyoutube;
    //var editkeylan = req.body.editkeylan;
    
    const keyuser = req.session.keyuser;

    video = video.replace('watch?v=', 'embed/');
    console.log("ENTRE A ROUTE "+imageAttachmentOld);
    //console.log(tittle+" "+subtittle+" "+originalFileName+" "+video+" "+text+" "+newswname+" "+newswemail);
    if(req.files[0])
    {
        var originalFileName = req.files[0].filename;
        if(originalFileName && typeof imageOld !== 'undefined' && imageOld != "")
        {
            fs.unlink('public/images/landingpage/'+imageOld, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        }
        else
        {
            originalFileName = imageOld;
        }

        var originalFileAttachment = req.files[1].filename;
        if(originalFileAttachment && typeof imageAttachmentOld !== 'undefined' && imageAttachmentOld != "")
        {
            fs.unlink('public/images/landingpage/'+imageAttachmentOld, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        }
        else
        {
            originalFileAttachment = imageAttachmentOld;
        }

        const response = await pool.query('UPDATE public.landing_page SET lan_tittle = $1,lan_subtittle = $2,lan_image = $3,lan_video = $4,lan_text = $5,lan_sw_name = $6,lan_sw_email = $7,lan_sw_text = $8,lan_sw_phone = $9,lan_video_owner = $10,lan_attachment_owner = $11 WHERE lan_key_inside = $12 and use_key_inside = $13', [tittle,subtittle,originalFileName,video,text,editswname,editswemail,editswtext,editswphone,editvideoyoutube,originalFileAttachment,editkeylan,keyuser]);
    }
    else
    {
        const response = await pool.query('UPDATE public.landing_page SET lan_tittle = $1,lan_subtittle = $2,lan_video = $3,lan_text = $4,lan_sw_name = $5,lan_sw_email = $6,lan_sw_text = $7,lan_sw_phone = $8,lan_video_owner = $9 WHERE lan_key_inside = $10 and use_key_inside = $11', [tittle,subtittle,video,text,editswname,editswemail,editswtext,editswphone,editvideoyoutube,editkeylan,keyuser]);
    }
    
    res.send("Your information is updated successfully");
}

const deleteLandingPage = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var keylan = jsonparser.keylan;
    
    //const { newtittle,newsubtittle,newvideo,newtext,newswname,newswemail,newswtext,newswphone} = req.body;
    const keyuser = req.session.keyuser;

    const response = await pool.query('DELETE FROM public.landing_page WHERE lan_key_inside = $1 and use_key_inside = $2', [keylan,keyuser]);
    res.send("Your information is deleted successfully");
}

const showtemplate = async (req,res) => {
    const id = req.params.id;
    const response = await pool.query("SELECT lan_tittle,lan_subtittle,lan_image,lan_video,lan_text,lan_sw_name,lan_sw_email,lan_sw_text,lan_sw_phone FROM public.landing_page WHERE lan_key_inside = $1", [id]);
    const tittle = response.rows[0].lan_tittle;
    const subtittle = response.rows[0].lan_subtittle;
    const image = response.rows[0].lan_image;
    const video = response.rows[0].lan_video;
    const text = response.rows[0].lan_text;
    const swname = response.rows[0].lan_sw_name;
    const swemail = response.rows[0].lan_sw_email;
    const swtext = response.rows[0].lan_sw_text;
    const swphone = response.rows[0].lan_sw_phone;
    
    res.render('template.ejs', { tittle,subtittle,image,video,text,swname,swemail,swtext,swphone,id });
}

module.exports = {
    landingPage,
    createLandingPage,
    uploadLandingPage,
    showinfo,
    updateLandingPage,
    deleteLandingPage,
    showtemplate
}