const jogar = {};
const tecla = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    SPACE: 32
}
var energias = 3;
var pontos = 0;
var salvos = 0;
var perdidos = 0;
var fimdeJogo = false;
var podeAtirar = true;
var velocidade = parseInt(Math.random() * 5 + 2);
var velocidadeCar = parseInt(Math.random() * 4 + 2);
var posicaoY = parseInt(Math.random() * 334);
jogar.pressionou = [];
var jogo = {};
var somDisparo = document.getElementById("somDisparo");
var somExplosao = document.getElementById("somExplosao");
var musica = document.getElementById("musica");
var somGameOver = document.getElementById("somGameOver");
var somPerdido = document.getElementById("somPerdido");
var somResgate = document.getElementById("somResgate");

function start() {

    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima2'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    loopGame();
}


function loopGame() {

    jogo.timer = setInterval(loop, 15);
    function loop() {
        moverFundo();
        moverPersonagem();
        moverInimigo1();
        moverInimigo2();
        moverAmigo();
        colisao();
        placar();
        vidas();
        musicaLoopGame();
    }
    return;
}
//Musica LoopGame
function musicaLoopGame() {
    if (!fimdeJogo) {
        musica.addEventListener("ended", function () {
            musica.currentTime = 0; musica.play();
        }, false);
        musica.play();
    }
    return;
}
//Fim da musica loopGame

function moverFundo() {
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
    return;
}

function moverPersonagem() {
    var topo = parseInt($("#jogador").css("top"));
    var lados = parseInt($("#jogador").css("left"));

    //Verifica se o usuario pressionou alguma tecla	

    $(document).keydown(function (e) {
        jogar.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) {
        jogar.pressionou[e.which] = false;
    });

    //mover pra cima
    if (jogar.pressionou[tecla.W] && topo >= 10) {
        $("#jogador").css("top", topo - 5);
    }

    //mover pra direita
    if (jogar.pressionou[tecla.D] && lados <= 694) {
        $("#jogador").css("left", lados + 5);
    }

    //mover pra baixo
    if (jogar.pressionou[tecla.S] && topo <= 410) {
        $("#jogador").css("top", topo + 5);
    }

    //mover pra esquerda
    if (jogar.pressionou[tecla.A] && lados >= 10) {
        $("#jogador").css("left", lados - 5);
    }

    //Atirar
    if (jogar.pressionou[tecla.SPACE]) {
        disparo();
    }


    return;
}

function moverInimigo1() {

    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX - velocidade);
    $("#inimigo1").css("top", posicaoY);

    if (posicaoX <= 0) {
        velocidade = parseInt(Math.random() * 5 + 2);
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("inimigo1").css("top", posicaoY)
    }
    return;
}

function moverInimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - velocidadeCar);

    if (posicaoX <= 0) {
        velocidadeCar = parseInt(Math.random() * 4 + 2);
        $("#inimigo2").css("left", 775);

    }
    return;
}

function moverAmigo() {
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX + 1.5);
    if (posicaoX >= 910) {
        $("#amigo").css("left", 0);
    }

}

function disparo() {
    if (podeAtirar == true) {
        podeAtirar = false;

        somDisparo.play();
        topo = parseInt($("#jogador").css("top"));
        posicaoX = parseInt($("#jogador").css("left"));
        tiroX = posicaoX + 190;
        topoTiro = topo + 37;
        $("#fundoGame").append("<div id = 'disparo'></div>");
        $("#disparo").css("top", topoTiro);
        $("#disparo").css("left", tiroX);

        tempoDisparo = window.setInterval(executaDisparo, 30);
    }

    function executaDisparo() {

        posicaoX = parseInt($("#disparo").css("left"));
        $("#disparo").css("left", posicaoX + 15);
        if (posicaoX > 900) {
            window.clearInterval(tempoDisparo);
            tempoDisparo = null;
            $("#disparo").remove();
            podeAtirar = true;
        }
        return;
    }

    return;
}



function colisao() {
    //Colisão do jogador com inimigo1
    //Variaveis
    var colisao1 = ($("#jogador").collision($("#inimigo1")));
    var colisao2 = ($("#jogador").collision($("#inimigo2")));
    var colisaoDisparo = ($("#disparo").collision($("#inimigo1")));
    var colisaoDisparo2 = ($("#disparo").collision($("#inimigo2")));
    var colisaoJogadoAmg = ($("#jogador").collision($("#amigo")));
    var coliInimigo2Amg = ($("#inimigo2").collision($("#amigo")));


    //Colisao com inimigo1
    if (colisao1.length > 0) {
        energias--;
        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X, inimigo1Y);

        velocidade = parseInt(Math.random() * 5 + 2);
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("inimigo1").css("top", posicaoY);


    }
    if (colisaoDisparo.length > 0) {
        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X, inimigo1Y);

        velocidade = parseInt(Math.random() * 5 + 2);
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("inimigo1").css("top", posicaoY);

        pontos = pontos + 100;
        $("#disparo").remove();
        window.clearInterval(tempoDisparo);
        podeAtirar = true;
    }
    //Fim da colisao com inimigo1

    //Colisao com inimigo2
    if (colisao2.length > 0) {
        energias--;
        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        explosao2(inimigo2X, inimigo2Y);
        $("#inimigo2").remove();
        respawnInimigo2();



    }

    if (colisaoDisparo2.length > 0) {
        pontos = pontos + 50;

        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        explosao2(inimigo2X, inimigo2Y);

        $("#inimigo2").remove();
        respawnInimigo2();
        $("#disparo").remove();
        window.clearInterval(tempoDisparo);
        podeAtirar = true;
    }
    //fim da colisao com inimigo2

    //Colisao do Amigo
    if (colisaoJogadoAmg.length > 0) {
        salvos++;
        $("#amigo").remove();
        respawnAmigo();
    }//Fim da colisao com Amigo

    if (coliInimigo2Amg.length > 0) {
        perdidos++;
        amigoX = parseInt($("#amigo").css("left"));
        amigoY = parseInt($("#amigo").css("top"));
        explosao3(amigoX, amigoY);
        $("#amigo").remove();
        respawnAmigo();
    }
}

function explosao1(inimigo1X, inimigo1Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div>");
    $("#explosao1").css("background-image", "url(imgs/explosao.png)");
    var div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 500);

    function removeExplosao() {
        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao = null;
    }
}
function explosao2(inimigo2X, inimigo2Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div>");
    $("#explosao2").css("background-image", "url(imgs/explosao.png)");
    var div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 500);

    function removeExplosao2() {
        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2 = null;
    }
}

function explosao3(amigoX, amigoY) {
    somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);

    var tempoExplosao3 = window.setInterval(removeExplosao3, 1000);

    function removeExplosao3() {
        $("#explosao3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3 = null;
    }
}

function respawnAmigo() {
    var tempoAmigo = window.setInterval(reposicionarAmg, 6000);

    function reposicionarAmg() {
        window.clearInterval(tempoAmigo);
        tempoAmigo = null;

        if (fimdeJogo == false) {

            $("#fundoGame").append("<div id='amigo' class='anima2'></div>");

        }
    }
    return;
}

function respawnInimigo2() {
    var tempoResInim2 = window.setInterval(reposicionaInim, 5000);

    function reposicionaInim() {
        window.clearInterval(tempoResInim2);
        tempoResInim2 = null;

        if (fimdeJogo == false) {
            $("#fundoGame").append("<div id='inimigo2'></div>");

        }
    }

    return;
}

function placar() {
    $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
}

function vidas() {
    if (energias == 3) {
        $("#energia").css("background-image", "url(imgs/energia3.png)");
    } else if (energias == 2) {
        $("#energia").css("background-image", "url(imgs/energia2.png)");
    } else if (energias == 1) {
        $("#energia").css("background-image", "url(imgs/energia1.png)");
    } else {
        $("#energia").css("background-image", "url(imgs/energia0.png)");
        fimdoJogo();
        //Fim do game
    }
}

function fimdoJogo() {
    fimdeJogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html("<h1>Voce Morreu! </h1><p> Sua pontuação foi: " + pontos + "</p> " + "<div id='reinicia' onclick='reiniciaJogo()'><h3> Jogar Novamente</h3></div>");

    return;
}

function reiniciaJogo(){
    energias = 3;
    somGameover.pause();
    $("#fim").remove();
    start();
    
}