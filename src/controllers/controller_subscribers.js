const {pool} = require('../db/connection');
const nodemailer = require('nodemailer');
const path = require('path');

//Creamos el objeto de transporte
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail Host
    port: 587, // Port
    auth: {
      user: 'emprendedoresamericalatina@gmail.com',
      pass: 'xhwwaykcqonqhznl'
    }
  });

const datasubscriber = (req,res) => {
    const my_session = req.session.my_session;
    
    if(!my_session)
    {
        res.redirect('/Login');
    }

    res.render('subscriber.ejs');
}

const showinfosubscribers = async (req,res) => {
    var searching = req.query.searching;
    const keyuser = req.session.keyuser;
    var profile = req.session.profileuser;
    var response = "";
    var rows;
    if(typeof searching === 'undefined'){ searching = ""; }

    if(profile == 1)
    {
        response = await pool.query("SELECT cus_key_inside keycus,cus_name yourname,cus_email email,cus_text yourtext,cus_phone phone,lan_key_inside keylan,u.use_name nameuser FROM public.customer c INNER JOIN public.users u ON(u.use_key_inside = c.use_key_inside) WHERE (UPPER(cus_name) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(cus_email) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' )", function (err, result, fields) {
            if (err) throw err;
            rows = result.rows;
            console.log(rows);
            res.send(rows);
          });
    }
    else
    {
        response = await pool.query("SELECT cus_key_inside keycus,cus_name yourname,cus_email email,cus_text yourtext,cus_phone phone,lan_key_inside keylan,u.use_name nameuser FROM public.customer c INNER JOIN public.users u ON(u.use_key_inside = c.use_key_inside) WHERE c.use_key_inside = "+keyuser+" and (UPPER(cus_name) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(cus_email) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' )", function (err, result, fields) {
            if (err) throw err;
            rows = result.rows;
            res.send(rows);
          });
    }
}

const createSubscriber = async (req,res) => {
    //const id = req.params.id;
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var name = jsonparser.name;
    var email = jsonparser.email;
    var phone = jsonparser.phone;
    var message = jsonparser.message;
    var idtemplate = jsonparser.idtemplate;

    const responseLandingPage = await pool.query("SELECT use_key_inside,lan_tittle,lan_video_owner,lan_attachment_owner FROM public.landing_page WHERE lan_key_inside = $1", [idtemplate]);
    const keyuser = responseLandingPage.rows[0].use_key_inside;
    const tittle = responseLandingPage.rows[0].lan_tittle;
    const videoOwner = responseLandingPage.rows[0].lan_video_owner;
    const attachmentOwner = responseLandingPage.rows[0].lan_attachment_owner;

    const responseEmail = await pool.query("SELECT use_email FROM public.users WHERE use_key_inside = $1", [keyuser]);
    const emailOwner = responseEmail.rows[0].use_email;

    var subject = "Welcome "+name;
    var mesage = "Welcome "+name+" to "+tittle+"\nThank you for your interest "+videoOwner+"\nTemplate: #"+idtemplate+" "+tittle;
    var mailOptions = {
        from: 'admin@probatus.com',
        to: email,
        subject: subject,
        text: mesage,
        attachments: [
            {   // utf-8 string as an attachment
                filename: tittle.trim()+path.extname(attachmentOwner),
                path: './public/images/landingpage/'+attachmentOwner,
            }
        ]
        /*attachments: [
            {   // utf-8 string as an attachment
                filename: 'probatus.mp4',
                path: 'https://micomunidad.co/botrader/modulos/videos/REGISTRO.mp4',
            }
        ]*/
        /*attachments: [
            {   // utf-8 string as an attachment
                filename: 'eb1993ad-ca0f-4135-bde3-d9fd34b6cba9.jpg',
                path: './public/images/landingpage/eb1993ad-ca0f-4135-bde3-d9fd34b6cba9.jpg',
            }
        ]*/
        /*attachments: [
            {   // utf-8 string as an attachment
                filename: 'text1.txt',
                content: 'hello world!'
            }
        ]*/
      };
      console.log("PASANDO POR EMAIL");
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });

    const subjectOwner = "New Subscriber!";
    const mesageOwner = "You have a new Subscriber and his/her information is: Name: "+name+" Email: "+email+" Mesage: "+message;
    var mailOptionsOwner = {
        from: 'admin@probatus.com',
        to: emailOwner,
        subject: subjectOwner,
        text: mesageOwner
      };

      transporter.sendMail(mailOptionsOwner, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
    
    console.log(name+" "+email+" "+phone+" "+message+" "+keyuser);
    const response = await pool.query("INSERT INTO public.customer(cus_name,cus_email,cus_text,cus_phone,use_key_inside,lan_key_inside) values($1, $2, $3, $4, $5, $6)", [name,email,message,phone,keyuser,idtemplate]);
    
    res.send("Your information is added successfully");
}

const deleteSubscriber = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var keycus = jsonparser.keycus;
    
    //const { newtittle,newsubtittle,newvideo,newtext,newswname,newswemail,newswtext,newswphone} = req.body;
    const keyuser = req.session.keyuser;

    const response = await pool.query('DELETE FROM public.customer WHERE cus_key_inside = $1 and use_key_inside = $2', [keycus,keyuser]);
    res.send("Your information is deleted successfully");
}

const updateSubscriber = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var editkeycus = jsonparser.editkeycus;
    var editname = jsonparser.editname;
    var editemail = jsonparser.editemail;
    var editmessage = jsonparser.editmessage;
    var editphone = jsonparser.editphone;
    
    const keyuser = req.session.keyuser;
    
    console.log(editkeycus+" "+editname+" "+editemail+" "+editmessage+" "+editphone+" "+keyuser);
    const response = await pool.query('UPDATE public.customer SET cus_name = $1,cus_email = $2,cus_text = $3,cus_phone = $4 WHERE cus_key_inside = $5 and use_key_inside = $6', [editname,editemail,editmessage,editphone,editkeycus,keyuser]);
    
    res.send("Your information is updated successfully");
}

module.exports = {
    datasubscriber,
    createSubscriber,
    showinfosubscribers,
    deleteSubscriber,
    updateSubscriber
}