const readline = require('readline');
const fs = require('fs');

class LoaderService {

    async readFile(enderecoArquivo) {
        const leitor = readline.createInterface({
            input: fs.createReadStream(enderecoArquivo),
            console: false
         });

        let valor = 0;

        var mapa = new Map();
        var transacoes = [];

        return new Promise(
            function(resolve, reject) {
                leitor.on('line', function(linha) {
                    let linhaSplitada = linha.split(';');
                    valor++;

                    const transacao = {
                        id: linhaSplitada[0],
                        valor: parseFloat(linhaSplitada[1].replace(',', '.')),
                        cartao: linhaSplitada[2],
                        data: new Date(linhaSplitada[3]),
                        tipo: linhaSplitada[4],
                        formaPagamento: linhaSplitada[5]
                    }

                    transacoes.push(transacao);
        
                    let resumoTransacao = {
                        tipo: transacao.tipo,
                        formaPagamento: transacao.formaPagamento,
                        ano: transacao.data.getFullYear(),
                        mes: transacao.data.getMonth(),
                        data: transacao.data.getDate(),
                        hora: transacao.data.getHours(),
                        valor: 1,
                        quantidade: 1,
                        toString: function(){ 
                            return this.tipo+this.formaPagamento+this.ano+this.mes+this.data+this.hora;
                        }
                    };
                    
                    if (mapa.has(resumoTransacao.toString())) {
                        let t = mapa.get(resumoTransacao.toString()); 
                        t.valor += transacao.valor;
                        t.quantidade++;
                    } else {
                        mapa.set(resumoTransacao.toString(), resumoTransacao);
                    }

                }).on('close', function() {
                    resolve({
                        transacoes, 
                        sumarios: mapa,
                        quantidade: valor
                    });
                })
            }
        );
    }  
}

module.exports = new LoaderService