console.log ('[MatheusWilliam] Flappy Bird');

let frames = 0;
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
function criaChao() {
    const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura:112,
    x: 0,
    y: canvas.height - 112,
    atualiza () {
        const movimentoDoChao = 1;
        const repeteEm = chao.largura / 2;
        const movimentacao = chao.x - movimentoDoChao;

        //console.log('[chao.x]', chao.x);
        //console.log('[repeteEm]', repeteEm);
        //console.log('[movimentacao]', movimentacao % repeteEm);

        chao.x = movimentacao % repeteEm;
    },
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
    return chao;
}


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
        if(fazColisao(flappybird, globais.chao)) {
            som_hit.play();
             
            mudaParaTela(Telas.GAME_OVER);
            
            return;
        }
        flappybird.velocidade = flappybird.velocidade + flappybird.gravidade;
        flappybird.y = flappybird.y + flappybird.velocidade ; 
    },
    movimentos: [
        { spriteX: 0, spriteY: 0, }, //asa para cima
        { spriteX: 0, spriteY: 26, }, //asa no meio
        { spriteX: 0, spriteY: 52, }, //asa para baixo  
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
        const intervaloDeFrames = 10;
        const passouOIntervalo = frames % intervaloDeFrames === 0;

        if(passouOIntervalo) {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + flappybird.frameAtual;
            const baseRepeticao = flappybird.movimentos.length;
            flappybird.frameAtual = incremento % baseRepeticao;
        }

        
    },
    desenha() {
        flappybird.atualizaOFrameAtual();
        const { spriteX, spriteY } = flappybird.movimentos[flappybird.frameAtual];

        contexto.drawImage(
            sprites,
            spriteX, spriteY, //Sprite X, Sprite Y
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

//[Mensagem Game Over]
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
        sprites,
        mensagemGameOver.sX, mensagemGameOver.sY,
        mensagemGameOver.w, mensagemGameOver.h,
        mensagemGameOver.x, mensagemGameOver.y,
        mensagemGameOver.w, mensagemGameOver.h
        );
    }
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
           

            canos.pares.forEach(function(par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;

                //[Cano do Céu]
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura
                )

                //[Cano do Chão]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                }
                par.canoChao = {
                    x: canoChaoX,
                    y:canoChaoY,
                }
            })
            
        },
        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappybird.y;
            const peDoFlappy = globais.flappybird.y + globais.flappybird.altura;
            if(globais.flappybird.x  + globais.flappybird.largura>= par.x) {

                if(cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if(peDoFlappy >= par.canoChao.y) {
                    return true;
                }



            }


        },
        pares: [],
        atualiza() {
            const passou100frames = frames % 100 === 0;
            if(passou100frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2;

                if(canos.temColisaoComOFlappyBird(par)) {
                    som_hit.play();
                   mudaParaTela(Telas.GAME_OVER); 
                }

                if(par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }

            });

        }
    }

    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle ='white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualiza() {
            const intervaloDeFrames = 230;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }
             
        }
    }

    return placar;
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
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            
            globais.flappybird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
            
        }
    } 
};

Telas.JOGO = {
    inicializa() {
        globais.placar = criaPlacar();
    },
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappybird.desenha();
        globais.placar.desenha();
    },
    click() {
        globais.flappybird.pula();
    },
    atualiza(){
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappybird.atualiza();
        globais.placar.atualiza();
    },
};

Telas.GAME_OVER = {
    desenha() {
        mensagemGameOver.desenha();
    },
    atualiza() {

    },
    click() {
        mudaParaTela(Telas.INICIO);
    }
}

function loop(){
    
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    };
});

mudaParaTela(Telas.INICIO);
loop();