const express = require('express');

//Iniciamos una variable con el modulo Router de express para que nos permita hacer uso de las rutas get, post...
const router = express.Router();

//Controller USERS
const {login,logininit,createUser,logout,dashboard,userInformation,updateUserInformation,users,showInfoUsers,deleteUser,updateUser} = require('../controllers/controller_users');
router.get('/Dashboard', dashboard);
router.get('/Logout', logout);
router.get('/', logininit);
router.get('/Login', logininit);
router.post('/Login', login);
router.post('/CreateUser', createUser);
router.get('/Users', users);
router.get('/Showinfousers', showInfoUsers);
router.delete('/DeleteUser', deleteUser);
router.post('/UpdateUser', updateUser);

//Controller Landing Page
const {landingPage,createLandingPage,uploadLandingPage,showinfo,updateLandingPage,deleteLandingPage,showtemplate} = require('../controllers/controller_landingpage');
router.get('/LandingPage', landingPage);
router.get('/showinfo', showinfo);
router.post('/UpdateLandingPage', uploadLandingPage, updateLandingPage);
router.post('/CreateLandingPage', uploadLandingPage, createLandingPage);
router.delete('/DeleteLandingPage', deleteLandingPage);
router.get('/Template/:id', showtemplate);

//Suscribers
const {datasubscriber,createSubscriber,showinfosubscribers,deleteSubscriber,updateSubscriber} = require('../controllers/controller_subscribers');
router.get('/Subscribers', datasubscriber);
router.get('/showinfosubscribers', showinfosubscribers);
router.post('/createSubscriber', createSubscriber);
router.delete('/DeleteSubscriber', deleteSubscriber);
router.post('/UpdateSubscriber', updateSubscriber);

//User information
router.get('/UserInformation', userInformation);
router.post('/UpdateUserInformation', updateUserInformation);

//Indicamos a Express que devuelva las rutas al archivo donde es llamado para que estas puedan ser usadas
module.exports = router;