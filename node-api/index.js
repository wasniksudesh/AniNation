const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});


app.get('/users',db.getUsers)
app.get('/login/:pid/:screenname',db.login)
app.get('/animelist/:offset',db.animelist)
app.get('/friends/:pid',db.friends)
app.get('/chatfriends/:pid',db.chatfriends)
app.get('/getprofile/:profile',db.getprofile)
app.get('/favanime/:pid',db.favanime);
app.get('/animeinfo/:anime_uid',db.animeinfo);
app.get('/fans/:anime_uid',db.fans);
app.get('/search1/:search1',db.search1);
app.get('/search2/:search2',db.search2);
app.get('/getconnected/:id',db.getconnected)
app.get('/getreviewall/:uid',db.getreviewall);

app.get('/totalreq/:profile',db.totalreq);
app.get('/chatinfo/:profile/:profile2',db.chatinfo);

app.get('/getchat/:convid',db.getchat);
app.get('/getmaxcount',db.getmaxcount);

app.post('/createconv',db.createconv);
app.post('/sendreq',db.sendreq)
app.post('/accept',db.accept)
app.post('/register',db.register)
app.post('/sendtext',db.sendtext)
app.post('/postreview',db.postreview)
app.post('/postscores',db.postscores)
app.post('/addfav',db.addfav)
app.post('/deletefrnd',db.deletefrnd)




app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})




