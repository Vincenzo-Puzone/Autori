const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const sqlite3 = require('sqlite3');

app = express();
const port = 8081;

app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use('/css', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use( morgan('dev') );

const db = new sqlite3.Database('./libri.db',()=>{
    app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
    console.log('database open')
});

app.get('/',(req,res)=>{
    let sql = "SELECT * FROM Autori";
    db.all(sql,(err,rows)=>{
        autori=rows;
        if (err) res.send('è esploso');
        else {
            sql = "SELECT * FROM Libri";
            db.all(sql,(err,rows)=>{
                libri=rows;
                if (err) res.send('è esploso parte 2');
                else {
                    sql = "SELECT * FROM autori_libri";
                    db.all(sql,(err,rows)=>{
                        relazioni=rows
                        if (err) res.send('è esploso parte 3');
                        else res.render('admin',{autori,libri,relazioni});
                    });
                }
            });
        }
    });
});

app.get('/modifica/autore/:id',(req,res)=>{
    sql=`select * from Autori where id = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        res.render('modAutori',{autore:row});
    });
});

app.post('/modautore',(req,res)=>{
    const id=parseInt(req.body.id);
    sql=`UPDATE Autori SET nome='${req.body.nome}',cognome='${req.body.cognome}' WHERE Autori.id = ${id}`;
    db.run(sql);
    res.redirect("/");
});

app.post('/delautore',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `DELETE FROM Autori WHERE Autori.id=${id}`;
    db.run(sql);
    res.redirect('/');
});

app.post('/addautore',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `INSERT INTO Autori(nome,cognome) VALUES('${req.body.nome}','${req.body.cognome}')`;
    db.run(sql);
    res.redirect('/');
});

app.get('/modifica/libro/:id',(req,res)=>{
    sql=`select * from Libri where id = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        res.render('modLibri',{libro:row});
    });
});

app.post('/modlibro',(req,res)=>{
    const id=parseInt(req.body.id);
    sql=`UPDATE Libri SET titolo='${req.body.titolo}' WHERE Libri.id = ${id}`;
    db.run(sql);
    res.redirect("/");
});

app.post('/dellibro',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `DELETE FROM Libri WHERE Libri.id=${id}`;
    db.run(sql);
    res.redirect('/');
});

app.post('/addlibro',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `INSERT INTO Libri(titolo) VALUES('${req.body.titolo}')`;
    db.run(sql);
    res.redirect('/');
});

app.get('/modifica/relazione/:id',(req,res)=>{
    sql=`select * from autori_libri where id = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        res.render('modRelazione',{relazione:row});
    });
});

app.post('/modrelazione',(req,res)=>{
    const id=parseInt(req.body.id);
    sql=`UPDATE autori_libri SET id_autore='${req.body.id_autore}',id_libro='${req.body.id_libro}' WHERE autori_libri.id = ${id}`;
    db.run(sql);
    res.redirect("/");
});

app.post('/delrelazione',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `DELETE FROM autori_libri WHERE autori_libri.id=${id}`;
    db.run(sql);;
    res.redirect('/');
});