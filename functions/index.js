const functions = require('firebase-functions');
const firebaseService  = require('./services/firebase-service');
const loaderService  = require('./services/loader-service');

const fs = require('fs');
const path = require('path');

exports.loaderArquivo1 = functions
    .storage
    .object()
    .onFinalize(async (object) => {
        const bucketArquivo = object.bucket;
        const enderecoArquivo = object.name;
        const nomeArquivo = path.basename(enderecoArquivo);

        if (!enderecoArquivo.startsWith('arquivo1/') || enderecoArquivo.startsWith('arquivo1/processados')) {
            return console.log('Não precisa ser processado.');
        }

        let arquivo = await firebaseService.getFile(bucketArquivo, enderecoArquivo);

        let carregados = await loaderService.readFile(arquivo.tempEnderecoArquivo);
        
        const novoEnderecoArquivo = path.join(path.dirname(enderecoArquivo) + '/processados/', nomeArquivo);

        await firebaseService.adicionarSumarios(carregados, novoEnderecoArquivo);
        await firebaseService.moveFile(arquivo.file, novoEnderecoArquivo)

        return fs.unlinkSync(arquivo.tempEnderecoArquivo);
    });

exports.excluirArquivos = functions
    .https
    .onRequest(async (req, res) => {  
        res.send('Excluidos');
    });