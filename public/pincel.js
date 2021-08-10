document.addEventListener('DOMContentLoaded', () => {
    const pincel = {
        ativo: false,
        movendo: false,
        origem: null,
        destino: {
            x: 0,
            y: 0
        },
        cor: '#000000',
        espessura: '2'
    }

    const borracha = {
        ativo: false,
        movendo: false,
        coordenadas: {
            x: 0,
            y: 0
        },
        espessura: '2'
    }

    const camadaPincel = document.querySelector('#camadaPincel')
    const contexto = camadaPincel.getContext('2d')
    const saveBtn = document.getElementById("saveBtn");

    const desenhaLinha = (linha) => {
        contexto.lineWidth = pincel.espessura
        contexto.strokeStyle = pincel.cor
        contexto.beginPath()
        contexto.moveTo(linha.origem.x, linha.origem.y)
        contexto.lineTo(linha.destino.x, linha.destino.y)
        contexto.stroke()
    }

    const apagar = (coordenadas) => {
        contexto.lineWidth = borracha.espessura
        contexto.clearRect(coordenadas.x - 7, coordenadas.y - 7, 15, 15);
    }


    document.querySelector("#mouse").addEventListener('change', function() {
        usaPincel()
    })

    document.querySelector("#pincel").addEventListener('change', function() {
        usaPincel()
    })

    document.querySelector("#borracha").addEventListener('change', function() {
        usaBorracha()
    })

    document.querySelector("#limparDesenho").addEventListener('click', function() {
        limparDesenhos()
    })

    const usaBorracha = () => {
        let ativo = false
        const usarBorracha = document.getElementById("borracha").checked
        if (usarBorracha) {
            document.querySelector("#camadaPincel").style.zIndex = "5"
            document.querySelector("#configBtn").disabled = false
            document.querySelector("#saveBtn").disabled = false
            ativo = true
        } else if (!document.getElementById("pincel").checked) {
            ativo = false
            document.querySelector("#camadaPincel").style.zIndex = "3"
            document.querySelector("#configBtn").disabled = true
        }
        return ativo
    }

    const usaPincel = () => {
        let ativo = false
        const usarPincel = document.getElementById("pincel").checked
        if (usarPincel) {
            document.querySelector("#camadaPincel").style.zIndex = "5"
            document.querySelector("#configBtn").disabled = false
            document.querySelector("#saveBtn").disabled = false
            ativo = true
        } else if (!document.getElementById("borracha").checked) {
            ativo = false
            document.querySelector("#configBtn").disabled = true
            document.querySelector("#camadaPincel").style.zIndex = "3"
        }
        return ativo
    }

    camadaPincel.onmousedown = () => {
        if (usaPincel()) {
            pincel.ativo = true
        } else if (usaBorracha()) {
            borracha.ativo = true
        }
    }

    camadaPincel.onmouseup = () => {
        pincel.ativo = false
        borracha.ativo = false
    }

    camadaPincel.onmousemove = (event) => {
        pincel.destino.x = event.clientX - camadaPincel.offsetLeft
        pincel.destino.y = event.clientY - camadaPincel.offsetTop
        pincel.movendo = true

        borracha.coordenadas.x = event.clientX - camadaPincel.offsetLeft
        borracha.coordenadas.y = event.clientY - camadaPincel.offsetTop
        borracha.movendo = true
    }

    saveBtn.onclick = (event) => {
        localStorage.setItem('desenho', camadaPincel.toDataURL())
    }

    const limparDesenhos = () => {
        contexto.clearRect(0, 0, camadaPincel.width, camadaPincel.height);
    }

    const ciclo = () => {
        if (pincel.ativo && pincel.movendo && pincel.origem) {
            desenhaLinha({
                destino: pincel.destino,
                origem: pincel.origem
            })
            pincel.movendo = false
        }
        pincel.origem = {
            ...pincel.destino
        }
        if (borracha.ativo && borracha.movendo && borracha.coordenadas) {
            apagar(borracha.coordenadas)
            borracha.movendo = false
        }
        setTimeout(ciclo, 0.1)
    }
    ciclo()

    document.querySelector("#tamanhoPincel").addEventListener('change', function() {
        if (usaBorracha()) borracha.espessura = document.querySelector("#tamanhoPincel").value
        else pincel.espessura = document.querySelector("#tamanhoPincel").value
    })

    document.querySelector("#corPincel").addEventListener('change', function() {
        pincel.cor = document.querySelector("#corPincel").value
    })

    document.querySelector("#tamanhoPincel").dispatchEvent(new Event('change'))
    document.querySelector("#corPincel").dispatchEvent(new Event('change'))
})