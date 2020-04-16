const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

//BODY-PARSER
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));
app.use(express.json());

//PUBLIC archivos publicos
//Incluimos nuestros archivos estaticos para poder utilizarlos, definiendo su respectiva ruta
app.use(express.static('./public'));

//Usamos la session pasandola a la variable app de nuestro servidor NODE con EXPRESS
app.use(session({
    secret: "landing-page",
    resave: false,
    saveUninitialized: false
}));

//VIEWS
app.set('views', __dirname + '/views');
//Indicamos el tipo de motor de plantillas a utilizar, en nuestro caso EJS
app.set('view engine', 'ejs');

//ROUTES
const routes = require('./src/routes/routes');
app.use(routes);

//Definimos una variable con el puerto
var port = process.env.PORT || 3000;
app.set('port', port);

app.listen(app.get('port'));
console.log("Server OK!");

//Referencia para crear la API REST https://www.youtube.com/watch?v=7NfvC-gOcRc
//Referencia para crear peticiones AJAX PARTE 1: https://www.youtube.com/watch?v=STLok6vKU0s
//Referencia para crear peticiones AJAX PARTE 2: https://www.youtube.com/watch?v=YqgLx_I-KP0
//Sessiones de usuarios: https://www.youtube.com/watch?v=mm9oIxR8YDU
//Subir imagenes: https://www.youtube.com/watch?v=AbJ-y2vZgBs
//Enviar Emails con nodemailer https://cursos.mejorcodigo.net/article/enviar-correo-electronico-con-nodejs-17