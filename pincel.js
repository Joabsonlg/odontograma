document.addEventListener('DOMContentLoaded', () => {
    const pincel = {
        ativo: false,
        movendo: false,
        origem: null,
        destino: {
            x: 0,
            y: 0
        }
    }

    const camadaPincel = document.querySelector('#camadaPincel')
    const contexto2 = camadaPincel.getContext('2d')
    const saveBtn = document.getElementById("saveBtn");

    camadaPincel.width = window.innerWidth - 25
    camadaPincel.height = 600

    const desenhaLinha = (linha) => {
        contexto2.beginPath()
        contexto2.moveTo(linha.origem.x, linha.origem.y)
        contexto2.lineTo(linha.destino.x, linha.destino.y)
        contexto2.stroke()
    }

    document.querySelector("#pincel").addEventListener('change', function() {
        usaPincel()
    })

    const usaPincel = () => {
        let ativo = false
        const usarPincel = document.getElementById("pincel").checked
        if (usarPincel) {
            document.querySelector("#camadaPincel").style.zIndex = "5"
            ativo = true
        } else {
            ativo = false
            document.querySelector("#camadaPincel").style.zIndex = "3"
        }
        return ativo
    }

    camadaPincel.onmousedown = () => {
        if (usaPincel()) pincel.ativo = true
    }

    camadaPincel.onmouseup = () => pincel.ativo = false

    camadaPincel.onmousemove = (event) => {
        pincel.destino.x = event.clientX - camadaPincel.offsetLeft
        pincel.destino.y = event.clientY - camadaPincel.offsetTop
        pincel.movendo = true
    }

    saveBtn.onclick = (event) => {
        saveBtn.download = 'Screenshot';
        saveBtn.href = camadaPincel.toDataURL();
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
        setTimeout(ciclo, 10)
    }
    ciclo()
})