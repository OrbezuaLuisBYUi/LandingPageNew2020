const bcrypt = require('bcrypt');
const saltRounds = 10;
const {pool} = require('../db/connection');

//Para mostrar los datos del usuario en una tabla
const getUsers = async (req,res) => {
    const response = await pool.query('SELECT * FROM public.users');
    res.status(200).json(response.rows);
}

const createUser = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var username = jsonparser.newusername;
    var password = jsonparser.newpassword;
    var name = jsonparser.newname;
    var lastname = jsonparser.newlastname;
    var phone = jsonparser.newphone;
    var email = jsonparser.newemail;
    var newprofile = jsonparser.newprofile;
    
    if(newprofile != "" && typeof newprofile !== "undefined" && req.session.profileuser == 1)
    {
        profile = newprofile;
    }
    else
    {
        var profile = 2;//jsonparser.profile;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const response = await pool.query('INSERT INTO public.users (use_username,use_password,use_name,use_lastname,use_phone,use_email,use_profile) VALUES($1, $2, $3, $4, $5, $6, $7)', [username,hash,name,lastname,phone,email,profile]);
    res.send("Your information is stored successfully");
}

const login = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var username = jsonparser.username;
    var password = jsonparser.password;
    const response = await pool.query("SELECT * FROM public.users WHERE use_username = $1", [username]);
    const comparepassword = response.rows[0].use_password;

    // Load hash from your password DB.
    if(bcrypt.compareSync(password, comparepassword))
    {
        var profile = response.rows[0].use_profile;
        req.session.my_session = req.body;
        req.session.keyuser = response.rows[0].use_key_inside;
        req.session.profileuser = profile;
        console.log(comparepassword);
        res.redirect('/Dashboard');
    }
    else
    {
        res.render('login.ejs');
    }
}

const logout = (req,res) => {
    delete req.session.my_session;
    
    res.redirect('/Login');
}

const logininit = (req,res) => {
    const my_session = req.session.my_session;
    if(my_session)
    {
        res.redirect('/Dashboard');
    }
    else
    {
        res.render('login.ejs');
    }
}

const dashboard = async (req,res)=> {
    const my_session = req.session.my_session;
    const keyuser = req.session.keyuser;
    //console.log("SESSION LUIS: "+my_session.username);
    if(!my_session)
    {
        res.redirect('/Login');
    }
    
    var profile = req.session.profileuser;
    var amount_landingpage = 0;
    var amount_subscribers = 0;

    if(profile == 1)
    {
        const response1 = await pool.query('SELECT COUNT(*) amount FROM public.landing_page');
        amount_landingpage = response1.rows[0].amount;
    
        const response2 = await pool.query('SELECT COUNT(*) amount FROM public.customer');
        amount_subscribers = response2.rows[0].amount;
    }
    else
    {
        const response1 = await pool.query('SELECT COUNT(*) amount FROM public.landing_page where use_key_inside = $1', [keyuser]);
        amount_landingpage = response1.rows[0].amount;
    
        const response2 = await pool.query('SELECT COUNT(*) amount FROM public.customer where use_key_inside = $1', [keyuser]);
        amount_subscribers = response2.rows[0].amount;
    }
    
    const response3 = await pool.query('SELECT use_name,use_email FROM public.users where use_key_inside = $1', [keyuser]);
    const name = response3.rows[0].use_name;
    const email = response3.rows[0].use_email;

    res.render('dashboard.ejs', { my_session,amount_landingpage,amount_subscribers,name,email });
}

const getUsers1 = (req,res) => {
    res.send('users ACA 2222');
}

const userInformation = async (req,res) => {
    const keyuser = req.session.keyuser;
    const response = await pool.query('SELECT use_username,use_name,use_lastname,use_phone,use_email,use_profile FROM public.users WHERE use_key_inside = $1', [keyuser]);
    var use_username = response.rows[0].use_username;
    var use_name = response.rows[0].use_name;
    var use_lastname = response.rows[0].use_lastname;
    var use_phone = response.rows[0].use_phone;
    var use_email = response.rows[0].use_email;
    var use_profile = response.rows[0].use_profile;

    res.render('userinformation.ejs', { use_username,use_name,use_lastname,use_phone,use_email,use_profile });
}

const updateUserInformation = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var editname = jsonparser.editname;
    var editlastname = jsonparser.editlastname;
    var editphone = jsonparser.editphone;
    var editemail = jsonparser.editemail;
    
    const keyuser = req.session.keyuser;
    
    //console.log(editkeycus+" "+editname+" "+editemail+" "+editmessage+" "+editphone+" "+keyuser);
    const response = await pool.query('UPDATE public.users SET use_name = $1,use_lastname = $2,use_phone = $3,use_email = $4 WHERE use_key_inside = $5', [editname,editlastname,editphone,editemail,keyuser]);
    
    res.send("Your information is updated successfully");
}

const users = (req,res) => {
    const my_session = req.session.my_session;

    if(my_session)
    {
        res.render('users.ejs');
    }
    else
    {
        res.redirect('/Login');
    }
}

const showInfoUsers = async (req,res) => {
    var edituser = req.query.edituser;
    var searching = req.query.searching;
    const keyuser = req.session.keyuser;
    var profile = req.session.profileuser;
    var response = "";
    var rows;
    if(typeof searching === 'undefined'){ searching = ""; }
    //console.log("SELECT use_key_inside keyuse,use_username username,use_name myname,use_lastname lastname,use_phone phone,use_email email,use_profile profile FROM public.users WHERE (UPPER(use_username) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(use_name) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(use_lastname) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '')");
    if(edituser == "YES")
    {
        response = await pool.query("SELECT use_key_inside keyuse,use_username username,use_name myname,use_lastname lastname,use_phone phone,use_email email,use_profile profile FROM public.users WHERE use_key_inside = "+keyuser, function (err, result, fields) {
            if (err) throw err;
            rows = result.rows;
            console.log(rows);
            res.send(rows);
            });
    }
    else
    {
        response = await pool.query("SELECT use_key_inside keyuse,use_username username,use_name myname,use_lastname lastname,use_phone phone,use_email email,use_profile profile FROM public.users WHERE (UPPER(use_username) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(use_name) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '' ) or (UPPER(use_lastname) LIKE REPLACE(UPPER('%"+searching+"%'),' ','%') OR '"+searching+"' IS NULL OR '"+searching+"' = '')", function (err, result, fields) {
            if (err) throw err;
            rows = result.rows;
            console.log(rows);
            res.send(rows);
            });
    }
}

const deleteUser = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);
    var keyuse = jsonparser.keyuse;
    
    var profile = req.session.profileuser;

    if(profile == 1)
    {
        const response = await pool.query('DELETE FROM public.users WHERE use_key_inside = $1', [keyuse]);
        res.send("Your information is deleted successfully");
    }
    else
    {
        res.send("Your have not authorization");
    }
}

const updateUser = async (req,res) => {
    var obj = JSON.stringify(req.body, true, 0);
    var jsonparser = JSON.parse(obj);

    var editkeyuser = jsonparser.editkeyuser;
    var editusername = jsonparser.editusername;
    var editpassword = jsonparser.editpassword;
    var editname = jsonparser.editname;
    var editlastname = jsonparser.editlastname;
    var editphone = jsonparser.editphone;
    var editemail = jsonparser.editemail;
    var editprofile = jsonparser.editprofile;
    var edituser = jsonparser.edit;
    const keyuser = req.session.keyuser;
    
    var profile = req.session.profileuser;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(editpassword, salt);

    if(edituser == "YES")
    {
        if(editpassword!="")
        {
            const response = await pool.query('UPDATE public.users SET use_username = $1,use_password = $2,use_name = $3,use_lastname = $4,use_phone = $5,use_email = $6,use_profile = $7 WHERE use_key_inside = $8', [editusername,hash,editname,editlastname,editphone,editemail,editprofile,keyuser]);
        }
        else
        {
            const response = await pool.query('UPDATE public.users SET use_username = $1,use_name = $2,use_lastname = $3,use_phone = $4,use_email = $5,use_profile = $6 WHERE use_key_inside = $7', [editusername,editname,editlastname,editphone,editemail,editprofile,keyuser]);
        }
        
        res.send("Your information is updated successfully");
    }
    else
    if(profile == 1)
    {
        if(editpassword!="")
        {
            const response = await pool.query('UPDATE public.users SET use_username = $1,use_password = $2,use_name = $3,use_lastname = $4,use_phone = $5,use_email = $6,use_profile = $7 WHERE use_key_inside = $8', [editusername,hash,editname,editlastname,editphone,editemail,editprofile,editkeyuser]);
        }
        else
        {
            const response = await pool.query('UPDATE public.users SET use_username = $1,use_name = $2,use_lastname = $3,use_phone = $4,use_email = $5,use_profile = $6 WHERE use_key_inside = $7', [editusername,editname,editlastname,editphone,editemail,editprofile,editkeyuser]);
        }
        
        res.send("Your information is updated successfully");
    }
    else
    {
        res.send("Your have not authorization");
    }
}

module.exports = {
    login,
    logininit,
    createUser,
    logout,
    dashboard,
    userInformation,
    updateUserInformation,
    users,
    showInfoUsers,
    deleteUser,
    updateUser
};