document.addEventListener('DOMContentLoaded', () => {

    const camada1 = document.querySelector('#camada1Odontograma')
    const contexto1 = camada1.getContext('2d')

    const camada2 = document.querySelector('#camada2Odontograma')
    const contexto2 = camada2.getContext('2d')

    const camada3 = document.querySelector('#camada3Odontograma')
    const contexto3 = camada3.getContext('2d')

    const camada4 = document.querySelector('#camada4Odontograma')
    const contexto4 = camada4.getContext('2d')

    const camadaPincel = document.querySelector('#camadaPincel')
    const contextoPincel = camadaPincel.getContext('2d')

    const modal = new bootstrap.Modal(document.getElementById('modal'))

    let posicoesPadrao = {
        posicaoYInicialDente: 180,
        margemXEntreDentes: 8,
        margemYEntreDentes: 200
    }

    const tamanhoTelaReferencia = 1895
    const alturaTelaReferencia = 872

    const itensProcedimento = [{
        nome: 'Lesão branca ativa de cárie',
        cor: '#008000'
    }, {
        nome: 'Lesão branca inativa de cárie',
        cor: '#FFFF00'
    }, {
        nome: 'Lesão de cárie cavitada',
        cor: '#FF0000'
    }, {
        nome: 'Cárie paralisada/ pigmentação do sulco',
        cor: '#000000'
    }, {
        nome: 'Restaurações em bom estado',
        cor: '#0000FF'
    }, {
        nome: 'Restauração a ser trocada',
        cor: '#FFC0CB'
    }, {
        nome: 'Lesão cervical não- cariosa',
        cor: '#8B0000'
    }, {
        nome: 'Faceta de desgaste',
        cor: '#FA8072'
    }, {
        nome: 'Limpar seção',
        cor: '#FFFFFF'
    }, {
        nome: 'Outro',
        cor: '#008080'
    }]

    let procedimentos = []
    class Procedimento {
        constructor(nome, cor, numeroDente, faceDente, informacoesAdicionais) {
            this.nome = nome;
            this.cor = cor;
            this.numeroDente = numeroDente;
            this.faceDente = faceDente;
            this.informacoesAdicionais = informacoesAdicionais;
        }
        valido() {
            const campos = ['nome', 'cor', 'numeroDente', 'faceDente']
            if (this.nome === null || this.nome === undefined || this.nome === '') return false
            if (this.cor === null || this.cor === undefined || this.cor === '') return false
            if (this.numeroDente === null || this.numeroDente === undefined || this.numeroDente === '') return false
            if (this.faceDente === null || this.faceDente === undefined || this.faceDente === '') return false
            return true
        }
        criaObjeto() {
            return {
                nome: this.nome,
                cor: this.cor,
                numeroDente: this.numeroDente,
                faceDente: this.faceDente,
                informacoesAdicionais: this.informacoesAdicionais
            }
        }
        limpar() {
            this.nome = null;
            this.cor = null;
            this.numeroDente = null;
            this.faceDente = null;
            this.informacoesAdicionais = null;
        }
        salvar() {
            if (this.valido()) {
                const procedimento = procedimentos.find(prc => prc.nome === this.nome && prc.numeroDente === this.numeroDente && prc.faceDente === this.faceDente)
                if (procedimento === undefined) procedimentos.push(this.criaObjeto())
                else procedimentos[procedimentos.indexOf(procedimento)] = this.criaObjeto()
                storage.save(procedimentos)
            }
        }
        remover() {
            procedimentos.splice(procedimentos.indexOf(this.criaObjeto()), 1)
            storage.save(procedimentos)
        }
    }

    let procedimento = new Procedimento()
    procedimento.indice = null

    const storage = {
        fetch() {
            return JSON.parse(localStorage.getItem('procedimentos') || '[]')
        },
        save(procedimentos) {
            localStorage.setItem('procedimentos', JSON.stringify(procedimentos))
            procedimentos = this.fetch()
            return procedimentos
        }
    };

    let tamanhoColuna = camada1.width / 16
    let tamanhoDente = tamanhoColuna - (2 * posicoesPadrao.margemXEntreDentes)

    let dimensoesTrapezio = {
        // Base maior será a altura e largura do dente
        // Base menor será 3/4 da base maior
        // Lateral será 1/4 da base maior

        baseMaior: tamanhoDente,
        lateral: tamanhoDente / 4,
        baseMenor: (tamanhoDente / 4) * 3
    }

    let numeroDentes = {
        superior: ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
        inferior: ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']
    }

    let numeroDenteXOrdemExibicaoDente = new Array()

    /**
     *Define a posição inicial do dente no eixo x a partir de seu índice.
     * 
     * @example 
     *   definePosicaoXInicialDente(5)
     * 
     * @param   {Number}    index      Parâmetro obrigatório
     * @returns {Number}
     */
    const definePosicaoXInicialDente = (index) => {
        if (index === 0) return (index * tamanhoDente) + (posicoesPadrao.margemXEntreDentes * index) + posicoesPadrao.margemXEntreDentes;
        else return (index * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * index) + posicoesPadrao.margemXEntreDentes;
    }

    /**
     * Desenha os dentes com suas respectivas faces.
     * 
     * @example 
     *   desenharDente(20, 20)
     * 
     * @param   {Number} posicaoX      Parâmetro obrigatório
     * @param   {Number} posicaoY      Parâmetro obrigatório
     */
    const desenharDente = (posicaoX, posicaoY) => {
        contexto1.fillStyle = 'black';
        contexto1.strokeStyle = 'black';

        /* 1º trapézio */
        contexto1.beginPath();
        contexto1.moveTo(posicaoX, posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
        contexto1.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
        contexto1.closePath();
        contexto1.stroke();

        /* 2º trapézio */
        contexto1.beginPath();
        contexto1.moveTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
        contexto1.closePath();
        contexto1.stroke();

        /* 3º trapézio */
        contexto1.beginPath();
        contexto1.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
        contexto1.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
        contexto1.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
        contexto1.closePath();
        contexto1.stroke();

        /* 4º trapézio */
        contexto1.beginPath();
        contexto1.moveTo(posicaoX, posicaoY);
        contexto1.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
        contexto1.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
        contexto1.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
        contexto1.closePath();
        contexto1.stroke();
    }

    /**
     * Faz o efeito 'hover' ao passar o mouse sobre alguma face.
     * 
     * @example 
     *   marcarSecao(contexto, 2, 5)
     * 
     * @param   {Object} contexto                Parâmetro obrigatório
     * @param   {Number} ordemExibicaoDente      Parâmetro obrigatório
     * @param   {Number} face                    Parâmetro obrigatório
     */
    const marcarSecao = (contexto, ordemExibicaoDente, face) => {
        contexto.lineWidth = 2
        let cor_linha = 'orange';
        let posicaoY = 0

        if (ordemExibicaoDente < 17) posicaoY = posicoesPadrao.posicaoYInicialDente;
        else {
            ordemExibicaoDente -= 16;
            posicaoY = dimensoesTrapezio.baseMaior + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente;
        }

        let posicaoX = definePosicaoXInicialDente(ordemExibicaoDente - 1)

        /* 1ª zona */
        if (face === 1) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'orange';
                contexto.stroke();
            }
        }
        /* 2ª zona */
        if (face === 2) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.closePath();
                //contexto.fill();
                contexto.strokeStyle = 'orange';
                contexto.stroke();
            }
        }
        /* 3ª zona */
        if (face === 3) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'orange';
                contexto.stroke();
            }
        }
        /* 4ª zona */
        if (face === 4) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'orange';
                contexto.stroke();
            }
        }
        /* 5ª zona(medio) */
        if (face === 5) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'orange';
                contexto.stroke();
            }
        }
    }

    camada4.onmousemove = (event) => {
        let x = event.x
        let y = event.y

        x -= camada1.offsetLeft
        y -= camada1.offsetTop

        procedimento.limpar()
        procedimento.indice = null

        procedimento = getInfoDentePosicaoatual(procedimento, x, y)
        if (getOrdemExibicaoPorNumeroDente(procedimento.numeroDente) > 0) {
            if (procedimento.faceDente) {
                color = 'orange';
                contexto3.clearRect(0, 0, camada3.width, camada3.height)
                marcarSecao(contexto3, getOrdemExibicaoPorNumeroDente(procedimento.numeroDente), procedimento.faceDente);
            } else contexto3.clearRect(0, 0, camada3.width, camada3.height)
        } else contexto3.clearRect(0, 0, camada3.width, camada3.height)
    }

    camada4.touchstart = (event) => {
        alert('touch')
    }

    camada4.onclick = (event) => {
        let x = event.x
        let y = event.y

        x -= camada1.offsetLeft
        y -= camada1.offsetTop

        procedimento.limpar()
        procedimento.indice = null

        procedimento = getInfoDentePosicaoatual(procedimento, x, y)

        if (procedimento.faceDente) modal.show()
        atualizaTabela()
    }

    const atualizaTabela = () => {
        const tbody = document.getElementById('bodyProcedimentos')
        let trs = ''
        procedimentos.filter(prc => prc.numeroDente === procedimento.numeroDente && prc.faceDente === procedimento.faceDente).forEach(item => {
            const tr = `
                <tr>
                    <td>
                        ${item.nome}
                    </td>
                    <td>
                        <input type="color" disabled class="form-control form-control-color" value="${item.cor}">
                    </td>
                    <td>
                        ${item.informacoesAdicionais || 'NÃO INFORMADO'}
                    </td>
                    <td>
                        <a onclick="apagar('${item.nome}', ${item.numeroDente}, ${item.faceDente})" class="btn btn-danger">
                            <i class="far fa-trash-alt"></i>
                        </a>
                    </td>
                </tr>
            `
            trs += tr
        })
        tbody.innerHTML = trs
    }

    window.apagar = (nome, numeroDente, faceDente) => {
        const procd = procedimentos.find(prc => prc.nome === nome && prc.numeroDente === numeroDente && prc.faceDente === faceDente)
        procedimentos.splice(procedimentos.indexOf(procd), 1)
        storage.save(procedimentos)
        atualizaTabela()
        resizeCanvas()
    }

    /**
     * Exibe o 'esqueleto' do odontograma (os dentes e sua numeração).
     */
    const exibirEstrutura = () => {
        // document.querySelector("#canva-group").style.display = 'block'

        for (let index = 0; index < 16; index++) {
            const posicaoX = definePosicaoXInicialDente(index)
            desenharDente(posicaoX, posicoesPadrao.posicaoYInicialDente)
        }

        for (let index = 0; index < 16; index++) {
            const posicaoX = definePosicaoXInicialDente(index)
            desenharDente(posicaoX, posicoesPadrao.margemYEntreDentes + tamanhoDente + posicoesPadrao.posicaoYInicialDente)
        }

        numeroDentes.superior.forEach((numero, index) => {
            const posicaoX = definePosicaoXInicialQuadrado(index)
            desenharQuadradoNumDente({
                position: {
                    x: posicaoX,
                    y: (posicoesPadrao.margemYEntreDentes / 5) + tamanhoDente + posicoesPadrao.posicaoYInicialDente
                },
                primeiroOuUltimoDente: index === 0 || index === 15,
                numeroDente: numero,
                altura: tamanhoDente / 1.8,
                largura: index === 0 || index === 15 ? tamanhoDente + posicoesPadrao.margemXEntreDentes : tamanhoDente + 2 * posicoesPadrao.margemXEntreDentes
            })
        })

        numeroDentes.inferior.forEach((numero, index) => {
            const posicaoX = definePosicaoXInicialQuadrado(index)
            desenharQuadradoNumDente({
                position: {
                    x: posicaoX,
                    y: (posicoesPadrao.margemYEntreDentes / 5) + (tamanhoDente / 1.8) + tamanhoDente + posicoesPadrao.posicaoYInicialDente
                },
                primeiroOuUltimoDente: index === 0 || index === 15,
                numeroDente: numero,
                altura: tamanhoDente / 1.8,
                largura: index === 0 || index === 15 ? tamanhoDente + posicoesPadrao.margemXEntreDentes : tamanhoDente + 2 * posicoesPadrao.margemXEntreDentes
            })
        })
    }

    /**
     * Define a posição inicial do quadrado no eixo x a partir de seu índice.
     *
     * @param {Number} index 
     */
    const definePosicaoXInicialQuadrado = (index) => {
        if (index === 0) return (index * tamanhoDente) + posicoesPadrao.margemXEntreDentes;
        else return (index * tamanhoDente) + (2 * index * posicoesPadrao.margemXEntreDentes);
    }

    /**
     * Desenha o quadrado que informa o número do dente.
     * 
     * @example 
     *   desenharQuadradoNumDente(quadrado)
     * 
     * @param   {Object} quadrado   Parâmetro obrigatório
     */
    const desenharQuadradoNumDente = (quadrado) => {
        let tamanhoFonte = (40 * (quadrado.primeiroOuUltimoDente ? quadrado.largura + posicoesPadrao.margemXEntreDentes : quadrado.largura)) / 118.4375
        contexto1.font = `${tamanhoFonte}px arial`
        contexto1.strokeRect(quadrado.position.x, quadrado.position.y, quadrado.largura, quadrado.altura)
        contexto1.fillText(quadrado.numeroDente, quadrado.position.x + tamanhoDente / 2.8, quadrado.position.y + (tamanhoDente / 2.5));
    }

    /**
     * Pinta a face do dente de acordo com o procedimento adicionado.
     * 
     * @example 
     *   pintarFace(contexto, procedimento, 'black', 'orange')
     * 
     * @param   {Object} contexto                Parâmetro obrigatório
     * @param   {Object} procedimento   Parâmetro obrigatório
     * @param   {String} cor_linha               Parâmetro obrigatório
     * @param   {String} cor_interior            Parâmetro obrigatório
     */
    const pintarFace = (contexto, procedimento, cor_linha, cor_interior) => {
        let numeroDente = getOrdemExibicaoPorNumeroDente(procedimento.numeroDente) - 1
        contexto.fillStyle = cor_interior
        contexto.strokeStyle = cor_linha

        let posicaoY = 0

        if (numeroDente < 16) posicaoY = posicoesPadrao.posicaoYInicialDente;
        else {
            numeroDente -= 16;
            posicaoY = dimensoesTrapezio.baseMaior + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente;
        }

        const prcdms = getProcedimentosPorDente(procedimento.numeroDente, procedimento.faceDente)
        const numeroDivisoes = prcdms.length - 1
        let dividir = false
        if (numeroDivisoes > 0) dividir = true

        let posicaoX = definePosicaoXInicialDente(numeroDente)

        /* 1ª zona */
        if (procedimento.faceDente === 1 && !dividir) {
            if (contexto) {
                contexto.beginPath();
                contexto.moveTo(posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.closePath();
                contexto.fill();
                contexto.stroke();
            }
        } else if (procedimento.faceDente === 1 && dividir) {
            if (contexto) {
                const larguraDivisao = dimensoesTrapezio.baseMaior / (numeroDivisoes + 1)
                prcdms.forEach((procedimentoItem, divisao) => {
                    contexto.fillStyle = procedimentoItem.cor
                    const ultimo = divisao === numeroDivisoes
                    const primeiro = divisao === 0
                    const dentroAreaTriangular = larguraDivisao * (divisao + 1) < dimensoesTrapezio.lateral
                    contexto.beginPath();
                    contexto.moveTo((larguraDivisao * divisao) + posicaoX, posicaoY);
                    contexto.lineTo(larguraDivisao * (divisao + 1) + posicaoX, posicaoY);
                    if (ultimo) {
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                        contexto.lineTo((larguraDivisao * divisao) + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                    } else if (!primeiro) {
                        contexto.lineTo(larguraDivisao * (divisao + 1) + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                        contexto.lineTo((larguraDivisao * divisao) + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                    } else {
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                        contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                    }
                    contexto.closePath();
                    contexto.fill();
                    contexto.stroke();
                })
            }
        }


        /* 2ª zona */
        if (procedimento.faceDente === 2 && !dividir) {
            if (contexto) {
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.closePath();
                contexto.fill();
                contexto.stroke();
            }
        } else if (procedimento.faceDente === 2 && dividir) {
            if (contexto) {
                const larguraDivisao = dimensoesTrapezio.baseMaior / (numeroDivisoes + 1)
                prcdms.forEach((procedimentoItem, divisao) => {
                    contexto.fillStyle = procedimentoItem.cor
                    const ultimo = divisao === numeroDivisoes
                    const primeiro = divisao === 0
                    contexto.beginPath();
                    contexto.moveTo(dimensoesTrapezio.baseMaior + posicaoX, (larguraDivisao * divisao) + posicaoY);
                    contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                    if (ultimo) {
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, (larguraDivisao * divisao) + posicaoY);
                    } else if (!primeiro) {
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, (larguraDivisao * divisao) + posicaoY);
                    } else {
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                    }
                    contexto.closePath();
                    contexto.fill();
                    contexto.stroke();
                })
            }
        }

        /* 3ª zona */
        if (procedimento.faceDente === 3 && !dividir) {
            if (contexto) {
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.closePath();
                contexto.fill();
                contexto.stroke();
            }
        } else if (procedimento.faceDente === 3 && dividir) {
            if (contexto) {
                const larguraDivisao = dimensoesTrapezio.baseMaior / (numeroDivisoes + 1)
                prcdms.forEach((procedimentoItem, divisao) => {
                    contexto.fillStyle = procedimentoItem.cor
                    const ultimo = divisao === numeroDivisoes
                    const primeiro = divisao === 0
                    const dentroAreaTriangular = larguraDivisao * (divisao + 1) < dimensoesTrapezio.lateral
                    contexto.beginPath();
                    contexto.moveTo((larguraDivisao * divisao) + posicaoX, posicaoY + tamanhoDente);
                    contexto.lineTo(larguraDivisao * (divisao + 1) + posicaoX, posicaoY + tamanhoDente);
                    if (ultimo) {
                        contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo((larguraDivisao * divisao) + posicaoX, dimensoesTrapezio.lateral + posicaoY + dimensoesTrapezio.baseMenor);
                    } else if (!primeiro) {
                        contexto.lineTo(larguraDivisao * (divisao + 1) + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo((larguraDivisao * divisao) + posicaoX, posicaoY + dimensoesTrapezio.baseMenor);
                    } else {
                        contexto.lineTo((larguraDivisao * (divisao + 1)) + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo(posicaoX, dimensoesTrapezio.lateral + posicaoY + dimensoesTrapezio.baseMenor);
                    }
                    contexto.closePath();
                    contexto.fill();
                    contexto.stroke();
                })
            }
        }

        /* 4ª zona */
        if (procedimento.faceDente === 4 && !dividir) {
            if (contexto) {
                contexto.beginPath();
                contexto.moveTo(posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.closePath();
                contexto.fill();
                contexto.stroke();
            }
        } else if (procedimento.faceDente === 4 && dividir) {
            if (contexto) {
                const larguraDivisao = dimensoesTrapezio.baseMaior / (numeroDivisoes + 1)
                prcdms.forEach((procedimentoItem, divisao) => {
                    contexto.fillStyle = procedimentoItem.cor
                    const ultimo = divisao === numeroDivisoes
                    const primeiro = divisao === 0
                    contexto.beginPath();
                    contexto.moveTo(posicaoX, (larguraDivisao * divisao) + posicaoY);
                    contexto.lineTo(posicaoX, larguraDivisao * (divisao + 1) + posicaoY);
                    if (ultimo) {
                        contexto.lineTo(posicaoX + dimensoesTrapezio.lateral, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo(posicaoX + dimensoesTrapezio.lateral, (larguraDivisao * divisao) + posicaoY);
                    } else if (!primeiro) {
                        contexto.lineTo(posicaoX + dimensoesTrapezio.lateral, dimensoesTrapezio.baseMenor + posicaoY);
                        contexto.lineTo(posicaoX + dimensoesTrapezio.lateral, (larguraDivisao * divisao) + posicaoY);
                    } else {
                        contexto.lineTo(posicaoX + dimensoesTrapezio.lateral, larguraDivisao * (divisao + 1) + posicaoY);
                        contexto.lineTo(posicaoX + dimensoesTrapezio.lateral, dimensoesTrapezio.lateral + posicaoY);
                    }
                    contexto.closePath();
                    contexto.fill();
                    contexto.stroke();
                })
            }
        }

        /* 5ª zona(medio) */
        if (procedimento.faceDente === 5 && !dividir) {
            if (contexto) {
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.closePath();
                contexto.fill();
                contexto.stroke();
            }
        } else if (procedimento.faceDente === 5 && dividir) {
            if (contexto) {
                const larguraDivisao = (dimensoesTrapezio.baseMenor - dimensoesTrapezio.lateral) / (numeroDivisoes + 1)
                prcdms.forEach((procedimentoItem, divisao) => {
                    contexto.fillStyle = procedimentoItem.cor
                    contexto.beginPath();
                    contexto.moveTo(dimensoesTrapezio.lateral + (divisao * larguraDivisao) + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                    contexto.lineTo(dimensoesTrapezio.lateral + ((divisao + 1) * larguraDivisao) + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                    contexto.lineTo(dimensoesTrapezio.lateral + ((divisao + 1) * larguraDivisao) + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                    contexto.lineTo(dimensoesTrapezio.lateral + (divisao * larguraDivisao) + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                    contexto.closePath();
                    contexto.fill();
                    contexto.stroke();
                })
            }
        }
    }

    /**
     * Redimensiona os canvas do odontograma e seu conteúdo proporcionalmente ao tamanho da janela.
     */
    const resizeCanvas = () => {
        if (window.innerWidth >= 800) {
            document.querySelector("#canva-group").style.display = 'display'
        } else {
            alert("TELA MUITO PEQUENA! Acesse o odontrograma através de um dispositivo com uma tela maior!")
            document.querySelector("#canva-group").style.display = 'none'
        }

        camada1.width = camada2.width = camada3.width = camada4.width = window.innerWidth - 25
        const altura = (camada1.width * alturaTelaReferencia) / tamanhoTelaReferencia
        camada1.height = camada2.height = camada3.height = camada4.height = altura

        valoresBase = {
            x: (camada1.width * 24) / tamanhoTelaReferencia,
            y: (camada1.width * 20) / tamanhoTelaReferencia,
            largura: (camada1.width * 70) / tamanhoTelaReferencia,
            altura: (camada1.width * 150) / tamanhoTelaReferencia
        }

        base_image = new Image();
        base_image.src = 'images/dentes/18.png';
        base_image.onload = function() {
            contexto1.drawImage(base_image, valoresBase.x, valoresBase.y, valoresBase.largura, valoresBase.altura);
        }

        posicoesPadrao.margemXEntreDentes = (camada1.width * 8) / tamanhoTelaReferencia
        posicoesPadrao.margemYEntreDentes = (camada1.width * 200) / tamanhoTelaReferencia
        posicoesPadrao.posicaoYInicialDente = (camada1.width * 180) / tamanhoTelaReferencia

        tamanhoColuna = camada1.width / 16
        tamanhoDente = tamanhoColuna - (2 * posicoesPadrao.margemXEntreDentes)

        dimensoesTrapezio = {
            baseMaior: tamanhoDente,
            lateral: tamanhoDente / 4,
            baseMenor: (tamanhoDente / 4) * 3
        }

        exibeMarcacoes()
        exibirEstrutura()
    }

    /**
     * Retorna os dados do dente em relação a posição do mouse na tela
     * 
     * @example 
     *   getInfoDentePosicaoatual(infoDentePosicaoAtual, 300, 255)
     * 
     * @param   {Object} infoDentePosicaoAtual   Parâmetro obrigatório
     * @param   {Number} x                       Parâmetro obrigatório
     * @param   {Number} y                       Parâmetro obrigatório
     * @returns {Object}
     */
    const getInfoDentePosicaoatual = (procedimento, x, y) => {
        if (y >= posicoesPadrao.posicaoYInicialDente && y <= posicoesPadrao.posicaoYInicialDente + tamanhoDente) {
            if (x >= posicoesPadrao.margemXEntreDentes && x <= posicoesPadrao.margemXEntreDentes + tamanhoDente) procedimento.numeroDente = getNumeroDentePorOrdemExibicao(1);
            else if (x >= (tamanhoDente + posicoesPadrao.margemXEntreDentes * 3) && x <= (30 * posicoesPadrao.margemXEntreDentes + 16 * tamanhoDente)) {
                procedimento.indice = parseInt(x / (tamanhoDente + 2 * posicoesPadrao.margemXEntreDentes), 10);
                ini = (procedimento.indice * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * procedimento.indice) + posicoesPadrao.margemXEntreDentes;
                fin = ini + tamanhoDente;
                if (x >= ini && x <= fin) {
                    procedimento.numeroDente = getNumeroDentePorOrdemExibicao(procedimento.indice + 1)
                }
            }
        } else if (y >= (tamanhoDente + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente) && y <= (2 * tamanhoDente + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente)) {
            if (x >= posicoesPadrao.margemXEntreDentes && x <= posicoesPadrao.margemXEntreDentes + tamanhoDente) {
                procedimento.numeroDente = getNumeroDentePorOrdemExibicao(17);
            } else if (x >= (tamanhoDente + posicoesPadrao.margemXEntreDentes * 3) && x <= (30 * posicoesPadrao.margemXEntreDentes + 16 * tamanhoDente)) {
                procedimento.indice = parseInt(x / (tamanhoDente + 2 * posicoesPadrao.margemXEntreDentes), 10);
                ini = (procedimento.indice * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * procedimento.indice) + posicoesPadrao.margemXEntreDentes;
                fin = ini + tamanhoDente;
                if (x >= ini && x <= fin) procedimento.numeroDente = getNumeroDentePorOrdemExibicao(procedimento.indice + 17)
            }
        }

        let px = x - ((procedimento.indice * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * procedimento.indice) + posicoesPadrao.margemXEntreDentes)
        let py = y - posicoesPadrao.posicaoYInicialDente

        if (getOrdemExibicaoPorNumeroDente(procedimento.numeroDente) > 16) py -= (posicoesPadrao.margemYEntreDentes + tamanhoDente)

        if (py > 0 && py < (tamanhoDente / 4) && px > py && py < tamanhoDente - px) {
            procedimento.faceDente = 1;
        } else if (px > (tamanhoDente / 4) * 3 && px < tamanhoDente && py < px && tamanhoDente - px < py) {
            procedimento.faceDente = 2;
        } else if (py > (tamanhoDente / 4) * 3 && py < tamanhoDente && px < py && px > tamanhoDente - py) {
            procedimento.faceDente = 3;
        } else if (px > 0 && px < (tamanhoDente / 4) && py > px && px < tamanhoDente - py) {
            procedimento.faceDente = 4;
        } else if (px > (tamanhoDente / 4) && px < (tamanhoDente / 4) * 3 && py > (tamanhoDente / 4) && py < (tamanhoDente / 4) * 3) {
            procedimento.faceDente = 5;
        }

        return procedimento
    }

    /**
     * Exibe todos os procedimentos adicionados nos respectivos dentes e faces
     */
    const exibeMarcacoes = () => {
        procedimentos.forEach(element => {
            pintarFace(contexto2, element, 'black', element.cor)
        });
    }

    /**
     * Redimensiona o canvas do pincel e seu conteúdo proporcionalmente ao tamanho da janela.
     */
    const resizeCanvasPincel = () => {
        camadaPincel.width = window.innerWidth - 25
        const altura = (camadaPincel.width * alturaTelaReferencia) / tamanhoTelaReferencia
        camadaPincel.height = altura

        const dataImage = localStorage.getItem('desenho')

        desenho = new Image();
        desenho.src = dataImage;
        desenho.onload = function() {
            contextoPincel.clearRect(0, 0, camadaPincel.width, camadaPincel.height)
            contextoPincel.drawImage(desenho, 0, 0, camadaPincel.width, camadaPincel.height);
        }
    }

    /**
     * Dá o start no odontograma, Desenhando a estrutura, carregando os dados, etc.
     */
    const iniciaOdontograma = () => {
        const options = itensProcedimento.map(problema => {
            return `\n<option value='${problema.nome}'>${problema.nome}</option>`
        })
        document.querySelector("#nomeProcedimento").innerHTML += options

        document.querySelector("#nomeProcedimento").addEventListener('change', (event) => {
            let procedimento = document.querySelector("#nomeProcedimento")
            if (procedimento.value !== '') {
                procedimento = itensProcedimento.find(problemaAtual => problemaAtual.nome === procedimento.value)
                document.querySelector("#cor").value = procedimento.cor
                if (procedimento.nome === 'Outro') {
                    document.querySelector("#cor").disabled = false
                    document.getElementById("colOutroProcedimento").style.display = 'block'
                } else {
                    document.querySelector("#cor").disabled = true
                    document.getElementById("colOutroProcedimento").style.display = 'none'
                }
            } else {
                document.querySelector("#cor").disabled = true
                document.getElementById("colOutroProcedimento").style.display = 'none'
            }
        })

        document.querySelector("#nomeProcedimento").dispatchEvent(new Event('change'))

        document.querySelector("#botaoAdicionar").onclick = (event) => {
            procedimento.nome = document.querySelector("#nomeProcedimento").value
            procedimento.cor = document.querySelector("#cor").value
            procedimento.informacoesAdicionais = document.querySelector("#informacoesAdicionais").value

            procedimento.salvar()

            pintarFace(contexto2, procedimento, 'black', procedimento.cor)
            atualizaTabela()
        }

        procedimentos = storage.fetch()

        numeroDentes.superior.forEach((numero, index) => numeroDenteXOrdemExibicaoDente[numero] = index)
        numeroDentes.inferior.forEach((numero, index) => numeroDenteXOrdemExibicaoDente[numero] = index + 16)

        resizeCanvas()
        resizeCanvasPincel()
    }

    /**
     * Retorna a ordem de exibição do dente a partir de seu número.
     * 
     * @example 
     *   getOrdemExibicaoPorNumeroDente(17); // 2
     * 
     * @param   {Number} numero   Parâmetro obrigatório
     * @returns {Number}
     */
    const getOrdemExibicaoPorNumeroDente = (numero) => {
        return numeroDenteXOrdemExibicaoDente[numero] + 1
    }

    /**
     * Retorna o número do dente a partir de sua ordem de exibição.
     * 
     * @example 
     *   getNumeroDentePorOrdemExibicao(2); // 17
     * 
     * @param   {Number} ordem   Parâmetro obrigatório
     * @returns {Number}
     */
    const getNumeroDentePorOrdemExibicao = (ordem) => {
        return numeroDenteXOrdemExibicaoDente.indexOf(ordem - 1)
    }

    /**
     * Retorna Todos os procedimentos adicionados para o dente informado.
     * 
     * @example 
     *   getProcedimentosPorDente(17); // [{...}]
     * 
     * @param   {Number} numero   Parâmetro obrigatório
     * @returns {Array}
     */
    const getProcedimentosPorDente = (numero, face) => {
        return procedimentos.filter(procedimento => procedimento.numeroDente === numero && procedimento.faceDente === face)
    }

    window.addEventListener("resize", () => {
        resizeCanvas()
        resizeCanvasPincel()
    })

    iniciaOdontograma()
})