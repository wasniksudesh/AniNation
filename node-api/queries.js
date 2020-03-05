const Pool = require('pg').Pool
const pool = new Pool({
  user:'group_7',
  host: '10.17.50.134',
  database: 'group_7',
  password: '214-658-874',
  port: 5432,
})



//   user: 'postgres',
//   host: 'localhost',
//   database: 'animation',
//   password: 'aayudesh26',
//   port: 5432,
// })


const getUsers = (request, response) => {
  pool.query('SELECT * FROM profiles ORDER BY pid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getprofile = (request, response) => {
  const profile = request.params.profile;
  pool.query('SELECT * FROM profiles where profile=$1',[profile], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const login = (request, response) => {
  const pid = request.params.pid;
  const screenname= request.params.screenname;
  console.log(request.params,pid,screenname,'this sis not ');
  pool.query('SELECT * FROM profiles WHERE pid = $1::bigint and profile=$2',[pid,screenname], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}

const animelist = (request, response) => {
  const offset = parseInt(request.params.offset)
  pool.query('select a.*,array_agg(genre) from (select * from anime order by ranked limit 10 offset $1) a  inner join genres g on a.uid=g.anime_uid group by a.uid,title,synopsis,aired,episodes,members,popularity,ranked,score,img_url,link order by ranked',[offset], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}

const friends = (request, response) => {
  const pid = request.params.pid;
  console.log("this si pid",pid)
  pool.query('select array_agg(distinct profile) as friends from (select friend as final from friends where id = $1::bigint union select id as final from friends where friend = $2::bigint) as a inner join (select profile,pid from profiles) as b on b.pid=a.final',[pid,pid], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}


const chatfriends = (request, response) => {
  const pid = request.params.pid;
  console.log("this si pid",pid)
  pool.query('select distinct b.profile,b.pid,b.avatar from (select friend as final from friends where id = $1::bigint union select id as final from friends where friend = $2::bigint) as a inner join (select profile,pid,avatar from profiles) as b on b.pid=a.final',[pid,pid], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}

const favanime = (request, response) => {
  const pid = request.params.pid;
  console.log("this si pid anime",pid)
  pool.query('select b.title,b.uid from (select favorite from favorite where profile_id= $1) as a inner join (select uid,title from anime) as b on a.favorite=b.uid',[pid], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is anime result',results)
    response.status(200).json(results.rows)
  })
}


const animeinfo = (request, response) => {
  const pid = request.params.anime_uid;
  console.log("this si pid anime",pid)
  pool.query('select distinct * from (select * from anime where uid=$1) as a inner join genres g on a.uid=g.anime_uid',[pid], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is anime result',results)
    response.status(200).json(results.rows)
  })
}


const fans = (request, response) => {
  const pid = request.params.anime_uid;
  console.log("this si pid anime",pid)
  pool.query('select array_agg(distinct profile) from (select profile_id from favorite where favorite=$1) a inner join profiles b on a.profile_id=b.pid',[pid], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is anime result',results)
    response.status(200).json(results.rows)
  })
}

const search1 = (request, response) => {
  const str1 = request.params.search1 ;
  console.log("this search profile",str1)
  pool.query('select array_agg(profile) from profiles where lower(profile) like lower($1)',["%"+str1+"%"], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is anime result',results)
    response.status(200).json(results.rows)
  })
}

const search2 = (request, response) => {
  const str2 = request.params.search2 ;
  console.log("this search profile",str2)
  pool.query('select title,uid from anime where lower(title) like lower($1)',["%"+str2+"%"], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is anime result',results)
    response.status(200).json(results.rows)
  })
}


const getconnected = (request, response) => {
  const id= request.params.id;
  console.log(request.params,id,'this sis not ');
  pool.query('SELECT f1 from connected where f2 = $1',[id], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}


const getreviewall = (request, response) => {
  const uid = request.params.uid;
  console.log(request.params,'this sis not ');
  pool.query('SELECT text,profile,link,s.* FROM review r inner join scores s on r.uid=s.uid  WHERE anime_uid = $1::bigint ',[uid], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}


const totalreq = (request, response) => {
  const profile= request.params.profile;
  console.log(request.params,'this sis not final ');
  pool.query('SELECT * from frequest where too=$1 or fromm=$1',[profile], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}



const register = (request, response) => {
  const { id, screenname, link,avatar } = request.body
  pool.query('INSERT INTO profiles VALUES ($1 , $2, $3, $4::int)', [screenname,link,avatar,id], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}

const sendtext = (request, response) => {
  const { convid,context,sender } = request.body
  console.log("NOOOOOOOOOOOOOOOOOOOOOOOO",request.body)
  pool.query('INSERT INTO message(convid,context,sender) VALUES ($1,$2,$3)', [convid,context,sender], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}



const sendreq = (request, response) => {
  const { fromm,too } = request.body
  console.log('this si NOOOOOOO ',fromm,too,request.body)
  pool.query('INSERT INTO frequest VALUES ($1 , $2)', [fromm,too], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}


const accept = (request, response) => {
  const { fromm,too } = request.body
  console.log('this si NOOOOOOO ',fromm,too,request.body)
  pool.query('delete from frequest where fromm=$1 and too=$2', [fromm,too], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}

const chatinfo = (request, response) => {
  const profile= request.params.profile;
  const profile2= request.params.profile2;
  console.log(request.params,'this sis not ');
  pool.query('SELECT convid FROM convtable WHERE (user1=$1 and user2=$2) or (user1=$2 and user2=$1)',[profile2,profile], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}

const createconv = (request, response) => {
  const { user1,user2 } = request.body
  console.log(request.params,'this sis not in convid ');
  pool.query('insert into convtable(user1,user2) values ($1,$2)',[user1,user2], (error, results) => {
    if (error) {
      throw error
    }
    console.log('this is result',results)
    response.status(200).json(results.rows)
  })
}


const getchat = (request, response) => {
  const convid= request.params.convid;
  console.log(request.params,'this sis not ');
  pool.query('SELECT * from message where convid = $1::int order by time ',[convid], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
    console.log('this is result',results)
    response.status(200).json(results.rows)}
  })
}


const postreview = (request, response) => {
  const {uid,profile,anime_uid,text } = request.body
  pool.query('INSERT INTO review VALUES ($1 ,$2,$3,$4)', [uid,profile,anime_uid,text], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}

const getmaxcount = (request, response) => {
  pool.query('SELECT uid from review order by uid desc limit 1  ', (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
    console.log('this is result',results)
    response.status(200).json(results.rows)}
  })
}

const postscores = (request, response) => {
  const {score,Overall,Story,Animation,Sound,Character,Enjoyment,uid} = request.body
  console.log('these are sovre',{uid,score,Overall,Story,Animation,Sound,Character,Enjoyment},request.body);
  pool.query('INSERT INTO scores VALUES ($1::int ,$2::int,$3::int,$4::int,$5::int,$6::int,$7::int,$8::int)', [uid,score,Overall,Story,Animation,Sound,Character,Enjoyment], (error, results) => {
    if (error) {
      console.log('this si an error',error);
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}



const addfav = (request, response) => {
  const {profile_id,favorite } = request.body
  pool.query('INSERT INTO favorite VALUES ($1::bigint ,$2::int)', [profile_id,favorite], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}


const deletefrnd = (request, response) => {
  const { user1,user2} = request.body
  console.log('this si NOOOOOOO ',request.body)
  pool.query('delete from friends where (id=$1 and friend=$2) or (id=$2 and friend=$1)', [user1,user2], (error, results) => {
    if (error) {
      console.log('this si an error');
      return response.status(400).send({ message:"This is an error"})
    }
    else{
      console.log("Success")
    }
    response.status(201).send({message:"success"})
  })
}



module.exports = {
  getUsers,
  login,
  register,
  animelist,
  friends,
  chatfriends,
  getprofile,
  favanime,
  animeinfo,
  fans,
  search1,
  search2,
  getconnected,
  totalreq,
  sendreq,
  accept,
  getreviewall,
  chatinfo,
  getchat,
  sendtext,
  createconv,
  postreview,
  getmaxcount,
  postscores,
  addfav,
  deletefrnd
}