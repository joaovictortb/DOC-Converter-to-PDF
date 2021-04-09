const express = require('express');
var app = express();
var upload = require('express-fileupload');
var docxConverter = require('docx-pdf');
var path = require('path');
var fs = require('fs');

const extend_pdf = '.pdf'
const extend_docx = '.docx'

var down_name

app.use(upload());

 
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
})


app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
      
    // Arquivo onde .docx será baixado
    var uploadpath = __dirname + '/uploads/' + name;
    const First_name = name.split('.')[0];
    // Nome do arquivo --ex test, example
    down_name = First_name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log(err);
      }else{
        // Caminho do arquivo baixado ou enviado
        var initialPath = path.join(__dirname, `./uploads/${First_name}${extend_docx}`);
        // Caminho onde o pdf convertido será colocado / carregado
        var upload_path = path.join(__dirname, `./uploads/${First_name}${extend_pdf}`);
        // Conversor para converter docx para pdf -> docx-pdf é usado
        // Se você quiser, pode usar qualquer outro conversor
        // Por exemplo - libreoffice-convert ou --awesome-unoconv
        docxConverter(initialPath,upload_path,function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
        res.sendFile(__dirname+'/down_html.html')
        });
      }
    });
  }else{
    res.send("No File selected !");
    res.end();
  }
});

app.get('/download', (req,res) =>{
  // Isso será usado para baixar o arquivo convertido
  res.download(__dirname +`/uploads/${down_name}${extend_pdf}`,`${down_name}${extend_pdf}`,(err) =>{
    if(err){
      res.send(err);
    }else{
      // Exclua os arquivos do diretório após o uso
      console.log('Files deleted');
      const delete_path_doc = process.cwd() + `/uploads/${down_name}${extend_docx}`;
      const delete_path_pdf = process.cwd() + `/uploads/${down_name}${extend_pdf}`;
      try {
        fs.unlinkSync(delete_path_doc)
        fs.unlinkSync(delete_path_pdf)
        //file removed
      } catch(err) {
      console.error(err)
      }
    }
  })
})

app.get('/thankyou',(req,res) => {
    res.sendFile(__dirname+'/thankyou.html')
})

  
app.listen(3000,() => {
    console.log("Server Started at port 3000...");
})
