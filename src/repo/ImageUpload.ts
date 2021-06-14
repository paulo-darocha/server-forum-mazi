import fs from "fs";

export const imageUpload = (file: any) => {
  
  console.log(file);

  fs.writeFile('./test.png', file, null, (erro) => {
    console.log(file);
    
    if (erro) console.log("Erro ao salvar o arquivo");
    console.log("Arquivo salvo com sucesso");
  }) 

};