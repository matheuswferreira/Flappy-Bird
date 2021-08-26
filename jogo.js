console.log ('[MatheusWilliam] Flappy Bird');

const som_hit = new Audio();
som_hit.src = './efeitos/efeitos_hit.wav';

const som_pula = new Audio();
som_pula.src = './efeitos/efeitos_pulo.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


//[Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura:204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
    
};

//chao
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura:112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura
        );

        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura
        );    
    },
};

function fazColisao(flappybird, chao) {
    const flappybirdY = flappybird.y + flappybird.altura;
    const chaoY = chao.y;

    if(flappybirdY >= chaoY) {
        return true;
    }

    return false;

}

function criaFlappyBird() {
   const flappybird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y:50,
    pulo: 4.6,
    pula() {
        flappybird.velocidade = - flappybird.pulo;
        som_pula.play();
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza(){
        if(fazColisao(flappybird, chao)) {
            som_hit.play();
             setTimeout(() => {
                mudaParaTela(Telas.INICIO);
            }, 500);
            return;
        }
        flappybird.velocidade = flappybird.velocidade + flappybird.gravidade;
        flappybird.y = flappybird.y + flappybird.velocidade ; 
    },
    desenha(){
        contexto.drawImage(
            sprites,
            flappybird.spriteX, flappybird.spriteY, //Sprite X, Sprite Y
            flappybird.largura, flappybird.altura, // Tamanho do recorte na sprite
            flappybird.x, flappybird.y,
            flappybird.largura, flappybird.altura,
        );
    }
}
    return flappybird;
}

//[Mensagem Get Ready]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
        sprites,
        mensagemGetReady.sX, mensagemGetReady.sY,
        mensagemGetReady.w, mensagemGetReady.h,
        mensagemGetReady.x, mensagemGetReady.y,
        mensagemGetReady.w, mensagemGetReady.h
        );
    }
}

//
// [Telas]
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappybird = criaFlappyBird();
        },
        desenha() {
            planoDeFundo.desenha();
            chao.desenha();
            globais.flappybird.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {

        }
    } 
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        chao.desenha();
        globais.flappybird.desenha();
    },
    click() {
        globais.flappybird.pula();
    },
    atualiza(){
        globais.flappybird.atualiza();
    },
};

function loop(){
    
    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    };
});

mudaParaTela(Telas.INICIO);
loop();