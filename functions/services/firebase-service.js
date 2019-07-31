const admin = require('firebase-admin');
admin.initializeApp();

const os = require('os');
const path = require('path');

class FirebaseService {

    async getFile(bucketArquivo, 
                    enderecoArquivo, 
                    nomeArquivo = (Math.random().toString(36).substring(7) + '.txt')) {
        
        const tempEnderecoArquivo = path.join(os.tmpdir(), nomeArquivo);
        
        const file = admin.storage()
                            .bucket(bucketArquivo)
                            .file(enderecoArquivo);

        await file.download({destination: tempEnderecoArquivo});
            
        return {
            tempEnderecoArquivo,
            file
        }
    }

    async moveFile(file, novoEndereco) {
        await file.move(novoEndereco);
    }

    async adicionarSumarios(valores, nomeArquivo) {
        let firestore = admin.firestore();
        
        let sumarios = firestore.collection('sumarios');
        let arquivos = firestore.collection('arquivos');
        
        valores.sumarios.forEach(sumario => {
            sumarios.add(sumario)
        });
        
        let arquivo = {
            dataCriacao: new Date().getTime(),
            linhas: valores.quantidade,
            endereco: nomeArquivo,
            transacoes: valores.transacoes
        }

        return arquivos.add(arquivo);
    }
}

module.exports = new FirebaseService