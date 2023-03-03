var http = require ('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(handleRequest);

const userDir = __dirname + "/contacts/";

function handleRequest(req, res) {
    var pareseUrl = url.parse(req.url, true);
    var store = '';
    req.on('data', (chunk) => {
        store = store + chunk;
    });
    req.on('end', () => {
        if (req.url === "/form" && req.method === "POST"){
            var username = JSON.parse(store).username;
            console.log(userDir);
            fs.open(userDir + username + '.json' , 'wx', (err, fd) => {
                if (err) return console.log(`username taken`);
                fs.writeFile(fd, store, (err) => {
                    if (err) return console.log(err);
                    fs.close(fd, () => {
                        return res.end(`${username} created successfully`)
                    })
                })
            })
        }
           
        if (req.url === "/contact" && req.method === "GET") {
            var username = pareseUrl.query.username;
            console.log(username)
            fs.readFile(userDir + username + '.json', (err, content) => {
                if (err) return console.log(err);
                res.setHeader('Content-Type', "application/json");
                return res.end(content); 
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
            fs.unlink(userDir + username + '.json' , (err) => {    //   delete a username from users directory using `fs.unlink` method
                if (err) return console.log(err);
                return res.end(`${username} is deleted`)
            })
        }
        res.statusCode = 404;
        res.end('Page Not Found')
    })
}

server.listen(5001, () => {
    console.log('server listening on port 5001')
})