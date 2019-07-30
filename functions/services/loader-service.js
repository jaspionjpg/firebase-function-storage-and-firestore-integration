const readline = require('readline');
const fs = require('fs');

class LoaderService {

    async readFile(enderecoArquivo) {
        const leitor = readline.createInterface({
            input: fs.createReadStream(enderecoArquivo),
            console: false
         });

        let valor = 0;

        return new Promise(
            function(resolve, reject) {
                leitor.on('line', function(linha) {
                    let linhaSplitada = linha.split(';');
                    
                    let transacao = {
                        id: linhaSplitada[0],
                        valor: parseFloat(linhaSplitada[1].replace(',', '.')),
                        cartao: linhaSplitada[2],
                        data: new Date(linhaSplitada[3]),
                        tipo: linhaSplitada[4],
                        formaPagamento: linhaSplitada[5]
                    }
        
                    if (transacao.valor) {
                        valor += transacao.valor;
                    }
                }).on('close', function() {
                    console.log(valor);
                    resolve(valor);
                })
            }
        );
    }
    
}

module.exports = new LoaderService