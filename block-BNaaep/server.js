var http = require ('http');
var url = require('url');
var fs = require('fs');


var server = http.createServer(handleRequest);

const userDir = __dirname + "/contacts/";

function handleRequest(req, res) {
    console.log (req.url);
    var pareseUrl = url.parse(req.url, true);
    var store = '';
    req.on('data', (chunk) => {
        store = store + chunk;
    });
    req.on('end', () => {
        if(req.url === '/'  &&  req.method === 'GET') {
            res.setHeader('Content-Type', "text/html");
            fs.createReadStream('./index.html').pipe(res);
        }
        if(req.url === '/assets/stylesheet/style.css'  &&  req.method === 'GET') {
            res.setHeader('Content-Type', "text/css");
            fs.createReadStream('./assets/stylesheet/style.css').pipe(res);
        }
        if (req.url === "/about" && req.method === "GET"){
            res.setHeader('Content-Type', "text/html")
            fs.createReadStream('./about.html').pipe(res)
        }
        if (req.url === "/contact" && req.method === "GET") {
            var username = pareseUrl.query.username;
            console.log(username)
            fs.readFile(userDir + username + '.json', (err, content) => {
                console.log(`hi`)
                if (err) return console.log(err);
                res.setHeader('Content-Type', "application/json");
                return res.end(content); 
                /*
                var parsedData = qs.parse(store);
                res.setHeader('Content-Type', "test/html");
                res.write(`<h1>${username}</h1>`);
                res.end()
                */
            })
        }
        if (req.url === "/form" && req.method === "POST"){
            var username = JSON.parse(store).username;
            // console.log(userDir);
            fs.open(userDir + username + '.json' , 'wx', (err, fd) => {
                if (err) return console.log(`username taken`);
                fs.writeFile(fd, store, (err) => {
                    if (err) return console.log(err);
                    fs.close(fd, () => {
                        res.setHeader('Content-Type', "test/html");
                        return res.end(`<h1>Contacts saved</h1>`)
                        // return res.end(`<h1>${username} created successfully </h1>`); 
                    })
                })
            })
        }
        if (pareseUrl.pathname === "/users" && req.method === "PUT") {
            var username = pareseUrl.query.username;
            fs.open(userDir + username + '.json' , 'r+', (err, fd) => {
                if (err) return console.log(err);
                fs.ftruncate(fd, (err) => {     // remove the content of file using `fs.ftruncate`
                    if (err) return console.log(err);
                    fs.writeFile(fd, store, (err) => {
                        if (err) return console.log(err);
                        fs.close(fd, () => {
                            return res.end(`${username} updated successfully`)
                        })
                    })
                })  
            })
        }
        if (pareseUrl.pathname === "/users" && req.method === "DELETE") {
            var username = pareseUrl.query.username;
            // console.log(username)
            fs.unlink(userDir + username + '.json' , (err) => {    //   delete a username from users directory using `fs.unlink` method
                if (err) return console.log(err);
                return res.end(`${username} is deleted`)
            })
        }
        if (pareseUrl.pathname === "/users" && req.method === "GET"){
            var username = pareseUrl.query.username;
            console.log(username)
        }


        /*
            res.statusCode = 404;
            res.end('Page Not Found')
        */
    })
}

server.listen(5001, () => {
    console.log('server listening on port 5001')
})