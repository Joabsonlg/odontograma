document.addEventListener('DOMContentLoaded', () => {

    const camada1 = document.querySelector('#camada1Odontograma')
    const contexto1 = camada1.getContext('2d')

    const camada2 = document.querySelector('#camada2Odontograma')
    const contexto2 = camada2.getContext('2d')

    const camada3 = document.querySelector('#camada3Odontograma')
    const contexto3 = camada3.getContext('2d')

    const camada4 = document.querySelector('#camada4Odontograma')
    const contexto4 = camada4.getContext('2d')

    const margemXEntreDentes = 8
    const margemYEntreDentes = 100
    let tamanhoColuna = camada1.width / 16
    let tamanhoDente = tamanhoColuna - (2 * margemXEntreDentes)

    let dimensoesTrapezio = {
        // Base maior será a altura e largura do dente
        // Base menor será 3/4 da base maior
        // Lateral será 1/4 da base maior

        baseMaior: tamanhoDente,
        lateral: tamanhoDente / 4,
        baseMenor: (tamanhoDente / 4) * 3
    }

    const posicaoYInicialDente = 20

    const registros = [{
        dente: 11,
        problema: {
            nome: 'Restauração a ser trocada',
            cor: 'teal',
            secao: 5
        }
    }]

    console.table(registros)

    const definePosicaoXInicialDente = (index) => {
        if (index === 0) return (index * tamanhoDente) + (margemXEntreDentes * index) + margemXEntreDentes;
        else return (index * tamanhoDente) + (2 * margemXEntreDentes * index) + margemXEntreDentes;
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

        if (numeroDente < 16) posicaoY = 20;
        else {
            numeroDente -= 16;
            posicaoY = dimensoesTrapezio.baseMaior + margemYEntreDentes + posicaoYInicialDente;
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

        let infoDentePosicaoAtual = {
            numeroDente: 0,
            secao: 0,
            indice: 0
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

    camada4.onclick = (event) => {
        const color = 'teal'
        const action = 'secao'

        let x = event.x
        let y = event.y

        x -= camada1.offsetLeft
        y -= camada1.offsetTop

        let infoDentePosicaoAtual = {
            numeroDente: 0,
            secao: 0,
            indice: 0
        }

        infoDentePosicaoAtual = getInfoDentePosicaoatual(infoDentePosicaoAtual, x, y)

        if (infoDentePosicaoAtual.secao) {
            console.table(infoDentePosicaoAtual)
            let marcacoes = JSON.parse(localStorage.getItem('marcacoes_dentes') || '[]')
            const jaAdicionado = marcacoes.find(marcacao => marcacao.numeroDente === infoDentePosicaoAtual.numeroDente && marcacao.secao === infoDentePosicaoAtual.secao) !== undefined
            if (!jaAdicionado) {
                marcacoes.push(infoDentePosicaoAtual)
                localStorage.setItem('marcacoes_dentes', JSON.stringify(marcacoes))
                pintarSecao(contexto2, infoDentePosicaoAtual, 'black', 'yellow')
            } else limparSecao(contexto2, infoDentePosicaoAtual)
        }
    }

    const exibirEstrutura = () => {
        // document.querySelector("#canva-group").style.display = 'block'

        for (let index = 0; index < 16; index++) {
            const posicaoX = definePosicaoXInicialDente(index)
            desenharDente(posicaoX, posicaoYInicialDente)
        }

        for (let index = 0; index < 16; index++) {
            const posicaoX = definePosicaoXInicialDente(index)
            desenharDente(posicaoX, margemYEntreDentes + tamanhoDente + posicaoYInicialDente)
        }
    }

    const pintarSecao = (contexto, infoDentePosicaoAtual, cor_linha, cor_interior) => {
        let numeroDente = infoDentePosicaoAtual.numeroDente - 1
        contexto.fillStyle = cor_interior
        contexto.strokeStyle = cor_linha

        let posicaoY = 0

        if (numeroDente < 16) posicaoY = 20;
        else {
            numeroDente -= 16;
            posicaoY = dimensoesTrapezio.baseMaior + margemYEntreDentes + posicaoYInicialDente;
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

    const limparSecao = (contexto, infoDentePosicaoAtual) => {
        pintarSecao(contexto, infoDentePosicaoAtual, 'black', 'white')
        let marcacoes = JSON.parse(localStorage.getItem('marcacoes_dentes') || '[]')
        const marcacao = marcacoes.find(marcacao => marcacao.numeroDente === infoDentePosicaoAtual.numeroDente && marcacao.secao == infoDentePosicaoAtual.secao)
        if (marcacao) {
            marcacoes.splice(marcacoes.indexOf(marcacao), 1)
            localStorage.setItem('marcacoes_dentes', JSON.stringify(marcacoes))
        }
    }

    const resizeCanvas = () => {
        if (window.innerWidth >= 800) {} else {
            alert("TELA MUITO PEQUENA! Acesse o odontrograma através de um dispositivo com uma tela maior!")
            // document.querySelector("#canva-group").style.display = 'none'
        }
        camada1.width = camada2.width = camada3.width = camada4.width = window.innerWidth - 25
        camada1.height = camada2.height = camada3.height = camada4.height = 600

        tamanhoColuna = camada1.width / 16
        tamanhoDente = tamanhoColuna - (2 * margemXEntreDentes)

        dimensoesTrapezio = {
            baseMaior: tamanhoDente,
            lateral: tamanhoDente / 4,
            baseMenor: (tamanhoDente / 4) * 3
        }

        getMarcacoes()
        exibirEstrutura()
    }

    const getInfoDentePosicaoatual = (infoDentePosicaoAtual, x, y) => {
        if (y >= posicaoYInicialDente && y <= posicaoYInicialDente + tamanhoDente) {
            if (x >= margemXEntreDentes && x <= margemXEntreDentes + tamanhoDente) infoDentePosicaoAtual.numeroDente = 1;
            else if (x >= (tamanhoDente + margemXEntreDentes * 3) && x <= (30 * margemXEntreDentes + 16 * tamanhoDente)) {
                infoDentePosicaoAtual.indice = parseInt(x / (tamanhoDente + 2 * margemXEntreDentes), 10);
                ini = (infoDentePosicaoAtual.indice * tamanhoDente) + (2 * margemXEntreDentes * infoDentePosicaoAtual.indice) + margemXEntreDentes;
                fin = ini + tamanhoDente;
                if (x >= ini && x <= fin) infoDentePosicaoAtual.numeroDente = infoDentePosicaoAtual.indice + 1
            }
        } else if (y >= (tamanhoDente + margemYEntreDentes + posicaoYInicialDente) && y <= (2 * tamanhoDente + margemYEntreDentes + posicaoYInicialDente)) {
            if (x >= margemXEntreDentes && x <= margemXEntreDentes + tamanhoDente) {
                infoDentePosicaoAtual.numeroDente = 17;
            } else if (x >= (tamanhoDente + margemXEntreDentes * 3) && x <= (30 * margemXEntreDentes + 16 * tamanhoDente)) {
                infoDentePosicaoAtual.indice = parseInt(x / (tamanhoDente + 2 * margemXEntreDentes), 10);
                ini = (infoDentePosicaoAtual.indice * tamanhoDente) + (2 * margemXEntreDentes * infoDentePosicaoAtual.indice) + margemXEntreDentes;
                fin = ini + tamanhoDente;
                if (x >= ini && x <= fin) infoDentePosicaoAtual.numeroDente = infoDentePosicaoAtual.indice + 17
            }
        }

        let px = x - ((infoDentePosicaoAtual.indice * tamanhoDente) + (2 * margemXEntreDentes * infoDentePosicaoAtual.indice) + margemXEntreDentes)
        let py = y - posicaoYInicialDente

        if (infoDentePosicaoAtual.numeroDente > 16) py -= (margemYEntreDentes + tamanhoDente)

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
            pintarSecao(contexto2, element, 'black', 'yellow')
        });
    }

    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)
})
