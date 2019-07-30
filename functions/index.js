const functions = require('firebase-functions');
const firebaseService  = require('./services/firebase-service')

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

        const novoEnderecoArquivo = path.join(path.dirname(enderecoArquivo) + '/processados/', nomeArquivo);
        await firebaseService.moveFile(arquivo.file, novoEnderecoArquivo)

        return fs.unlinkSync(arquivo.tempEnderecoArquivo);
    });