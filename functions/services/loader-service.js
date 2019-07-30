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
            (resolve, reject) => {
                leitor.on('line', (linha) => {
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
                        quantidade: 1
                    };
                    
                    let resumo = LoaderService.gerarToStringTransacao(resumoTransacao);

                    if (mapa.has(resumo)) {
                        let t = mapa.get(resumo); 
                        t.valor += transacao.valor;
                        t.quantidade++;
                    } else {
                        mapa.set(resumo, resumoTransacao);
                    }

                }).on('close', () => {
                    resolve({
                        transacoes, 
                        sumarios: mapa,
                        quantidade: valor
                    });
                })
            }
        );
    }  
    
    static gerarToStringTransacao(transacao) {
        return transacao.tipo + transacao.formaPagamento + transacao.ano + transacao.mes + transacao.data + transacao.hora;
    }
}

module.exports = new LoaderService