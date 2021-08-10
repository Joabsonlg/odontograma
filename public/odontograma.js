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

    const problemas = [{
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
        nome: 'Extração indicada',
        cor: '#F5F5DC'
    }, {
        nome: 'Necessidade de prótese fixa',
        cor: '#A52A2A'
    }, {
        nome: 'Prótese fixa',
        cor: '#FFA500'
    }, {
        nome: 'Dente ausente',
        cor: '#800080'
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

    let infoDentePosicaoAtual = {
        numeroDente: 0,
        secao: 0,
        indice: 0,
        cor: ''
    }

    let numeroDentes = {
        superior: ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
        inferior: ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']
    }

    const definePosicaoXInicialDente = (index) => {
        if (index === 0) return (index * tamanhoDente) + (posicoesPadrao.margemXEntreDentes * index) + posicoesPadrao.margemXEntreDentes;
        else return (index * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * index) + posicoesPadrao.margemXEntreDentes;
    }

    const desenharDente = (posicaoX, posicaoY) => {
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

    const marcarSecao = (contexto, numeroDente, secao) => {
        numeroDente -= 1;
        contexto.lineWidth = 2

        let cor_linha = 'yellow';
        let posicaoY = 0

        if (numeroDente < 16) posicaoY = posicoesPadrao.posicaoYInicialDente;
        else {
            numeroDente -= 16;
            posicaoY = dimensoesTrapezio.baseMaior + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente;
        }

        let posicaoX = definePosicaoXInicialDente(numeroDente)

        /* 1ª zona */
        if (secao === 1) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'yellow';
                contexto.stroke();
            }
        }
        /* 2ª zona */
        if (secao === 2) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.closePath();
                //contexto.fill();
                contexto.strokeStyle = 'yellow';
                contexto.stroke();
            }
        }
        /* 3ª zona */
        if (secao === 3) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMaior + posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'yellow';
                contexto.stroke();
            }
        }
        /* 4ª zona */
        if (secao === 4) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(posicaoX, posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(posicaoX, dimensoesTrapezio.baseMaior + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'yellow';
                contexto.stroke();
            }
        }
        /* 5ª zona(medio) */
        if (secao === 5) {
            if (contexto) {
                contexto.fillStyle = cor_linha;
                contexto.beginPath();
                contexto.moveTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.lateral + posicaoY);
                contexto.lineTo(dimensoesTrapezio.baseMenor + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.lineTo(dimensoesTrapezio.lateral + posicaoX, dimensoesTrapezio.baseMenor + posicaoY);
                contexto.closePath();
                contexto.strokeStyle = 'yellow';
                contexto.stroke();
            }
        }
    }

    camada4.onmousemove = (event) => {
        let x = event.x
        let y = event.y

        x -= camada1.offsetLeft
        y -= camada1.offsetTop

        infoDentePosicaoAtual = {
            numeroDente: 0,
            secao: 0,
            indice: 0,
            cor: ''
        }

        infoDentePosicaoAtual = getInfoDentePosicaoatual(infoDentePosicaoAtual, x, y)

        if (infoDentePosicaoAtual.numeroDente > 0) {
            if (infoDentePosicaoAtual.secao) {
                color = 'yellow';
                contexto3.clearRect(0, 0, camada3.width, camada3.height)
                marcarSecao(contexto3, infoDentePosicaoAtual.numeroDente, infoDentePosicaoAtual.secao);
            } else contexto3.clearRect(0, 0, camada3.width, camada3.height)
        } else contexto3.clearRect(0, 0, camada3.width, camada3.height)
    }

    camada4.touchstart = (event) => {
        alert('touch')
    }

    camada4.onclick = (event) => {
        const color = 'teal'
        const action = 'secao'

        let x = event.x
        let y = event.y

        x -= camada1.offsetLeft
        y -= camada1.offsetTop

        infoDentePosicaoAtual = {
            numeroDente: 0,
            secao: 0,
            indice: 0,
            cor: ''
        }

        infoDentePosicaoAtual = getInfoDentePosicaoatual(infoDentePosicaoAtual, x, y)

        if (infoDentePosicaoAtual.secao) modal.show()
    }

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

    const definePosicaoXInicialQuadrado = (index) => {
        if (index === 0) return (index * tamanhoDente) + posicoesPadrao.margemXEntreDentes;
        else return (index * tamanhoDente) + (2 * index * posicoesPadrao.margemXEntreDentes);
    }

    const desenharQuadradoNumDente = (quadrado) => {
        let tamanhoFonte = (40 * (quadrado.primeiroOuUltimoDente ? quadrado.largura + posicoesPadrao.margemXEntreDentes : quadrado.largura)) / 118.4375
        contexto1.font = `${tamanhoFonte}px arial`
        contexto1.strokeRect(quadrado.position.x, quadrado.position.y, quadrado.largura, quadrado.altura)
        contexto1.fillText(quadrado.numeroDente, quadrado.position.x + tamanhoDente / 2.8, quadrado.position.y + (tamanhoDente / 2.5));
    }

    const pintarSecao = (contexto, infoDentePosicaoAtual, cor_linha, cor_interior) => {
        let numeroDente = infoDentePosicaoAtual.numeroDente - 1
        contexto.fillStyle = cor_interior
        contexto.strokeStyle = cor_linha

        let posicaoY = 0

        if (numeroDente < 16) posicaoY = posicoesPadrao.posicaoYInicialDente;
        else {
            numeroDente -= 16;
            posicaoY = dimensoesTrapezio.baseMaior + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente;
        }

        let posicaoX = definePosicaoXInicialDente(numeroDente)

        /* 1ª zona */
        if (infoDentePosicaoAtual.secao === 1) {
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
        }
        /* 2ª zona */
        if (infoDentePosicaoAtual.secao === 2) {
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
        }
        /* 3ª zona */
        if (infoDentePosicaoAtual.secao === 3) {
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
        }
        /* 4ª zona */
        if (infoDentePosicaoAtual.secao === 4) {
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
        }
        /* 5ª zona(medio) */
        if (infoDentePosicaoAtual.secao === 5) {
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
        }
    }

    const resizeCanvas = () => {
        if (window.innerWidth >= 800) {} else {
            alert("TELA MUITO PEQUENA! Acesse o odontrograma através de um dispositivo com uma tela maior!")
            // document.querySelector("#canva-group").style.display = 'none'
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

        getMarcacoes()
        exibirEstrutura()
    }

    const getInfoDentePosicaoatual = (infoDentePosicaoAtual, x, y) => {
        if (y >= posicoesPadrao.posicaoYInicialDente && y <= posicoesPadrao.posicaoYInicialDente + tamanhoDente) {
            if (x >= posicoesPadrao.margemXEntreDentes && x <= posicoesPadrao.margemXEntreDentes + tamanhoDente) infoDentePosicaoAtual.numeroDente = 1;
            else if (x >= (tamanhoDente + posicoesPadrao.margemXEntreDentes * 3) && x <= (30 * posicoesPadrao.margemXEntreDentes + 16 * tamanhoDente)) {
                infoDentePosicaoAtual.indice = parseInt(x / (tamanhoDente + 2 * posicoesPadrao.margemXEntreDentes), 10);
                ini = (infoDentePosicaoAtual.indice * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * infoDentePosicaoAtual.indice) + posicoesPadrao.margemXEntreDentes;
                fin = ini + tamanhoDente;
                if (x >= ini && x <= fin) infoDentePosicaoAtual.numeroDente = infoDentePosicaoAtual.indice + 1
            }
        } else if (y >= (tamanhoDente + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente) && y <= (2 * tamanhoDente + posicoesPadrao.margemYEntreDentes + posicoesPadrao.posicaoYInicialDente)) {
            if (x >= posicoesPadrao.margemXEntreDentes && x <= posicoesPadrao.margemXEntreDentes + tamanhoDente) {
                infoDentePosicaoAtual.numeroDente = 17;
            } else if (x >= (tamanhoDente + posicoesPadrao.margemXEntreDentes * 3) && x <= (30 * posicoesPadrao.margemXEntreDentes + 16 * tamanhoDente)) {
                infoDentePosicaoAtual.indice = parseInt(x / (tamanhoDente + 2 * posicoesPadrao.margemXEntreDentes), 10);
                ini = (infoDentePosicaoAtual.indice * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * infoDentePosicaoAtual.indice) + posicoesPadrao.margemXEntreDentes;
                fin = ini + tamanhoDente;
                if (x >= ini && x <= fin) infoDentePosicaoAtual.numeroDente = infoDentePosicaoAtual.indice + 17
            }
        }

        let px = x - ((infoDentePosicaoAtual.indice * tamanhoDente) + (2 * posicoesPadrao.margemXEntreDentes * infoDentePosicaoAtual.indice) + posicoesPadrao.margemXEntreDentes)
        let py = y - posicoesPadrao.posicaoYInicialDente

        if (infoDentePosicaoAtual.numeroDente > 16) py -= (posicoesPadrao.margemYEntreDentes + tamanhoDente)

        if (py > 0 && py < (tamanhoDente / 4) && px > py && py < tamanhoDente - px) {
            infoDentePosicaoAtual.secao = 1;
        } else if (px > (tamanhoDente / 4) * 3 && px < tamanhoDente && py < px && tamanhoDente - px < py) {
            infoDentePosicaoAtual.secao = 2;
        } else if (py > (tamanhoDente / 4) * 3 && py < tamanhoDente && px < py && px > tamanhoDente - py) {
            infoDentePosicaoAtual.secao = 3;
        } else if (px > 0 && px < (tamanhoDente / 4) && py > px && px < tamanhoDente - py) {
            infoDentePosicaoAtual.secao = 4;
        } else if (px > (tamanhoDente / 4) && px < (tamanhoDente / 4) * 3 && py > (tamanhoDente / 4) && py < (tamanhoDente / 4) * 3) {
            infoDentePosicaoAtual.secao = 5;
        }

        return infoDentePosicaoAtual
    }

    const getMarcacoes = () => {
        let marcacoes = JSON.parse(localStorage.getItem('marcacoes_dentes') || '[]')

        marcacoes.forEach(element => {
            pintarSecao(contexto2, element, 'black', element.cor)
        });
    }

    resizeCanvas()

    const options = problemas.map(problema => {
        return `\n<option value='${problema.nome}'>${problema.nome}</option>`
    })
    document.querySelector("#problema").innerHTML += options

    document.querySelector("#problema").addEventListener('change', (event) => {
        let problema = event.target
        if (problema.value) {
            problema = problemas.find(problemaAtual => problemaAtual.nome === problema.value)
            document.querySelector("#cor").value = problema.cor
            if (problema.nome === 'Outro') document.querySelector("#cor").disabled = false
            else document.querySelector("#cor").disabled = true
        }
    })

    document.querySelector("#botaoSalvarMarcacao").onclick = (event) => {
        let marcacoes = JSON.parse(localStorage.getItem('marcacoes_dentes') || '[]')
        const marcacao = marcacoes.find(marcacao => marcacao.numeroDente === infoDentePosicaoAtual.numeroDente && marcacao.secao === infoDentePosicaoAtual.secao)
        const procedimento = document.querySelector("#problema").value

        infoDentePosicaoAtual.cor = document.querySelector("#cor").value
        if (marcacao === undefined) marcacoes.push(infoDentePosicaoAtual)
        else {
            if (procedimento.value === 'Limpar seção') marcacoes.splice(marcacoes.indexOf(marcacao), 1)
            else marcacoes[marcacoes.indexOf(marcacao)] = infoDentePosicaoAtual
        }

        localStorage.setItem('marcacoes_dentes', JSON.stringify(marcacoes))
        pintarSecao(contexto2, infoDentePosicaoAtual, 'black', infoDentePosicaoAtual.cor)
        modal.hide()
    }


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

    resizeCanvasPincel()

    window.addEventListener("resize", () => {
        resizeCanvas()
        resizeCanvasPincel()
    })
})