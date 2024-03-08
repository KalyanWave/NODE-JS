const readline = require('readline');
const PORT = 8080;
const IP = '127.0.0.1';
const fs = require('fs');
const http= require('http');
const url = require('url');
const events = require('events');
const user = require('./Module/user');
const replaceHtml = require('./Module/replacehtml');

const html = fs.readFileSync('./Template/Index.html','utf-8');
let products=JSON.parse(fs.readFileSync('./Data/products.json','utf-8'));
let productlistHtml=fs.readFileSync('./Template/productlist.html','utf-8');
let productDetailHtml=fs.readFileSync('./Template/productdetail.html','utf-8');

const server = http.createServer()
server.on('request', (request, response)  =>
{
    let {query,pathname : path} = url.parse(request.url,true)
    console.log('REQ received');
       if(path === '/'  || path.toLocaleLowerCase() === '/home')
       {
           response.writeHead(200, {
               'Content-Type': 'text/html',
               'my-header': 'HELLO'
           });
           response.end(html.replace('{{%CONTENTS%}}',"You r in Home Page"));
       }
       else if(path.toLocaleLowerCase() === '/about')
       {
           response.writeHead(200,
               {
                   'Content-Type': 'text/html',
                   'my-header': 'HELLO'
               });
           response.end(html.replace('{{%CONTENTS%}}','About Page'));
       }
       else if(path.toLocaleLowerCase() === '/contact')
       {
           response.writeHead(200,
               {
                   'Content-Type': 'text/html',
                   'my-header': 'HELLO'
               });
           response.end(html.replace('{{%CONTENTS%}}','Contact Page'));
       }
       else if(path.toLocaleLowerCase() === '/products')
       {
           if(!query.id)
           {
               let productHtmlArray = products.map((prod) => {
                   return replaceHtml(productlistHtml,prod);

               })
               let productResponseHtml = html.replace('{{%CONTENTS%}}',productHtmlArray.join(' '));
               response.writeHead(200, {'Content-Type':'text/html' });
               response.end(productResponseHtml);
           }
           else
           {
               let prod = products [query.id]
               let productDetailResponseHtml = replaceHtml(productDetailHtml,prod)
               response.end(html.replace('{{%CONTENTS%}}',productDetailResponseHtml));
           }
       } 
       else 
       {
           response.writeHead(404,{
               'Content-Type': 'text/html',
               'my-header': 'HELLO'
           });
           response.end(html.replace('{{%CONTENTS%}}',"Error 404"));
       }
});

server.listen(PORT,IP, () =>{
    console.log(`Server started! \n${IP} : ${PORT}`);
})

let myEmitter = new user();
myEmitter.on('User Created',(name,id) =>{
    console.log(`user created name${name} ID${id}`)
})
myEmitter.on('User Created',(id,name) =>
{
    console.log(`User created Name: ${name}\nId: ${id} in DB`)
})
myEmitter.emit('User Created',101,'KALYAN');