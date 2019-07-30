const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const path = require('path');
const os = require('os');
const fs = require('fs');

exports.loaderArquivo1 = functions
    .storage
    .object('arquivo1/')
    .onFinalize(async (object) => {
        const bucketArquivo = object.bucket;
        const enderecoArquivo = object.name;
        
        const nomeArquivo = path.basename(enderecoArquivo);

        if (!enderecoArquivo.startsWith('arquivo1/') || enderecoArquivo.startsWith('arquivo1/processados')) {
            return console.log('Não precisa ser processado.');
        }

        const tempEnderecoArquivo = path.join(os.tmpdir(), nomeArquivo);
        
        const file = admin.storage()
                            .bucket(bucketArquivo)
                            .file(enderecoArquivo);

        await file.download({destination: tempEnderecoArquivo});
            
        const novoEnderecoArquivo = path.join(path.dirname(enderecoArquivo) + '/processados/', nomeArquivo);
        await file.move(novoEnderecoArquivo);

        return fs.unlinkSync(tempEnderecoArquivo);
    });