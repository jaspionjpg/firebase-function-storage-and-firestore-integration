const admin = require('firebase-admin');

class FirebaseService {

    getFile(bucketArquivo, enderecoArquivo) {
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

}