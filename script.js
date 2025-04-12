document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contagem de ouro
    let goldCount = 0;
    const goldCounter = document.getElementById('gold-count');
    
    // Efeito de partículas douradas
    createParticles();
    
    // Elementos DOM para as novas funcionalidades
    const achievementFlash = document.getElementById('achievement-flash');
    
    // Sistema de músicas
    const initialMusic = new Audio('sounds/MUSIC NORDIC CELTIC NO COPYRIGHT MELHOR MÚSICA NÓRDICA SEM DIREITOS AUTORAIS PARA VIDEOS DO YOUTUB.mp3');
    const secondMusic = new Audio('sounds/Whitesand - Tenacity (Instrumental Music).mp3');
    const thirdMusic = new Audio('sounds/Eternity.mp3');
    const fourthMusic = new Audio('sounds/The Wolf And The Moon.mp3');
    
    // Array com todas as músicas para controle de volume
    const allMusic = [initialMusic, secondMusic, thirdMusic, fourthMusic];
    
    // Sons de efeitos
    const alertSound = new Audio('sounds/Alarme de Emergência - Som de Alerta Vermelho Emergency Alarm - Red Alert Sound आपातका.mp3');
    const ideaSound = new Audio('sounds/som de ideia nova efeito sonoro.mp3');
    const pigSound = new Audio('sounds/Som Do Porco - barulho do porco ..mp3');
    
    // Array com todos os efeitos sonoros
    const allSounds = [alertSound, ideaSound, pigSound];
    
    // Volume padrão
    let currentVolume = 0.2;
    
    // Configurações das músicas
    allMusic.forEach(music => {
        music.volume = currentVolume;
        music.loop = true;
    });
    
    // Configurações dos sons
    allSounds.forEach(sound => {
        sound.volume = currentVolume * 1.5; // Efeitos sonoros um pouco mais altos
    });
    
    // Controle de qual música está tocando
    let currentMusic = 'initial';
    let imagesUnlocked = 0;
    let musicEnabled = false;
    
    // Configurar overlay de música
    const musicOverlay = document.getElementById('music-overlay');
    const startMusicButton = document.getElementById('start-music');
    const noMusicButton = document.getElementById('no-music');
    
    // Controles de volume
    const volumeBar = document.getElementById('volume-bar');
    const volumeDown = document.querySelector('.volume-down');
    const volumeUp = document.querySelector('.volume-up');
    
    // Atualizar a barra de volume visualmente
    function updateVolumeBar() {
        volumeBar.style.width = `${currentVolume * 100}%`;
    }
    
    // Diminuir volume
    volumeDown.addEventListener('click', function() {
        if (currentVolume > 0.1) {
            currentVolume -= 0.1;
            currentVolume = Math.max(0, currentVolume);
            
            // Atualizar volume em todas as músicas e sons
            allMusic.forEach(music => music.volume = currentVolume);
            allSounds.forEach(sound => sound.volume = currentVolume * 1.5);
            
            updateVolumeBar();
        }
    });
    
    // Aumentar volume
    volumeUp.addEventListener('click', function() {
        if (currentVolume < 1) {
            currentVolume += 0.1;
            currentVolume = Math.min(1, currentVolume);
            
            // Atualizar volume em todas as músicas e sons
            allMusic.forEach(music => music.volume = currentVolume);
            allSounds.forEach(sound => sound.volume = currentVolume * 1.5);
            
            updateVolumeBar();
        }
    });
    
    // Controles de volume com funcionalidade de arrastar
    volumeBar.parentElement.addEventListener('mousedown', function(e) {
        const handleDrag = (e) => {
            const rect = volumeBar.parentElement.getBoundingClientRect();
            let ratio = (e.clientX - rect.left) / rect.width;
            ratio = Math.min(1, Math.max(0, ratio));
            
            currentVolume = ratio;
            
            // Atualizar volume em todas as músicas e sons
            allMusic.forEach(music => music.volume = currentVolume);
            allSounds.forEach(sound => sound.volume = currentVolume * 1.5);
            
            updateVolumeBar();
        };
        
        handleDrag(e);
        
        const handleMouseMove = (e) => {
            handleDrag(e);
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });
    
    startMusicButton.addEventListener('click', function() {
        musicEnabled = true;
        initialMusic.play().catch(e => console.error("Erro ao iniciar música:", e));
        musicOverlay.classList.add('hidden');
    });
    
    noMusicButton.addEventListener('click', function() {
        musicEnabled = false;
        musicOverlay.classList.add('hidden');
    });
    
    // Ativar fade-in para imagens quando clicadas
    const imageContainers = document.querySelectorAll('.image-container');
    
    // Dica visual para clicar na imagem
    const imageHint = document.getElementById('image-hint');
    
    // Timers para mostrar dicas
    let hintTimers = {};
    
    // Verificar visibilidade e mostrar dicas quando estiver próximo
    function handleScroll() {
        imageContainers.forEach((container, index) => {
            // Pular imagens já desbloqueadas
            if (container.classList.contains('active')) return;
            
            // Verificar se a imagem está na ordem correta para ser desbloqueada
            if (index > 0 && !imageContainers[index - 1].classList.contains('active')) {
                // Esconder qualquer dica se a imagem anterior não estiver desbloqueada
                const unlockHint = container.querySelector('.unlock-hint');
                if (unlockHint) unlockHint.classList.remove('visible');
                return;
            }
            
            const rect = container.getBoundingClientRect();
            
            // Verificar se a imagem está visível na tela
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Se a imagem está visível, iniciar timer para mostrar dica
                if (!hintTimers[index]) {
                    // Tempos diferentes para cada imagem
                    let tempoEspera = 5000; // 5 segundos para primeira imagem
                    if (index === 1) tempoEspera = 10000; // 10 segundos para segunda imagem
                    if (index === 2) tempoEspera = 15000; // 15 segundos para terceira imagem
                    
                    // Primeiro vamos desaparecer com o ponto de interrogação
                    const questionMark = container.querySelector('.question-mark');
                    if (questionMark) {
                        // Timer intermediário para esconder o ponto de interrogação antes de mostrar a dica
                        setTimeout(() => {
                            questionMark.style.opacity = '0';
                            setTimeout(() => {
                                questionMark.style.display = 'none';
                            }, 500);
                        }, tempoEspera - 1000); // 1 segundo antes da dica aparecer
                    }
                    
                    hintTimers[index] = setTimeout(() => {
                        const unlockHint = container.querySelector('.unlock-hint');
                        if (unlockHint) {
                            unlockHint.classList.add('visible');
                        }
                    }, tempoEspera);
                }
            } else {
                // Se a imagem não está visível, limpar timer e esconder dica
                if (hintTimers[index]) {
                    clearTimeout(hintTimers[index]);
                    hintTimers[index] = null;
                    
                    const unlockHint = container.querySelector('.unlock-hint');
                    if (unlockHint) {
                        unlockHint.classList.remove('visible');
                    }
                }
            }
        });
    }
    
    // Adicionar listener de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Verificar inicialmente
    setTimeout(handleScroll, 1000);
    
    // Adicionar evento de clique para as imagens
    imageContainers.forEach((container, index) => {
        container.addEventListener('click', function() {
            // Se a imagem já estiver ativa, não faz nada
            if (this.classList.contains('active')) return;
            
            // Verificar se a imagem está na ordem correta para ser desbloqueada
            if (index > 0 && !imageContainers[index - 1].classList.contains('active')) {
                // Adicionar efeito de "sacudida" para indicar que não pode desbloquear
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
                return;
            }
            
            // Adiciona a classe active
            this.classList.add('active');
            
            // Remover o bloqueador de conteúdo
            const contentBlocker = this.querySelector('.content-blocker');
            if (contentBlocker) {
                contentBlocker.style.display = 'none';
            }
            
            // Esconder a dica de desbloqueio
            const unlockHint = this.querySelector('.unlock-hint');
            if (unlockHint) {
                unlockHint.classList.remove('visible');
            }
            
            // Limpar o timer de dica para esta imagem
            if (hintTimers[index]) {
                clearTimeout(hintTimers[index]);
                hintTimers[index] = null;
            }
            
            // Esconde a dica global se estiver visível
            imageHint.classList.remove('visible');
            
            // Garante que o ponto de interrogação desapareça
            const questionMark = this.querySelector('.question-mark');
            if (questionMark) {
                questionMark.style.opacity = '0';
                setTimeout(() => {
                    questionMark.style.display = 'none';
                }, 500);
            }
            
            // Exibe o conteúdo desbloqueado com uma animação suave
            // CSS já cuida disso com os seletores :not(.active) ~ p, etc.
            
            // Incrementa a contagem de ouro e atualiza o display
            goldCount += Math.floor(Math.random() * 5) + 3; // Ganhar entre 3 e 7 moedas
            goldCounter.textContent = goldCount;
            
            // Cria efeito de explosão de ouro próximo ao contador
            const goldIcon = document.querySelector('.gold-icon');
            const rect = goldIcon.getBoundingClientRect();
            const fakeEvent = {
                pageX: rect.left + window.scrollX,
                pageY: rect.top + window.scrollY
            };
            createGoldBurst(fakeEvent);
            
            // Incrementa o contador de imagens desbloqueadas
            imagesUnlocked++;
            
            // Gerencia a mudança de música baseada nas imagens desbloqueadas
            if (musicEnabled) {
                if (imagesUnlocked === 1) {
                    // Muda para a segunda música (Whitesand - Tenacity)
                    fadeOutMusic(initialMusic, function() {
                        currentMusic = 'second';
                        secondMusic.play().catch(e => console.error("Erro ao iniciar música:", e));
                    });
                } else if (imagesUnlocked === 2) {
                    // Muda para a terceira música (Eternity)
                    fadeOutMusic(secondMusic, function() {
                        currentMusic = 'third';
                        thirdMusic.play().catch(e => console.error("Erro ao iniciar música:", e));
                    });
                } else if (imagesUnlocked === 3) {
                    // Muda para a quarta música (The Wolf And The Moon)
                    fadeOutMusic(thirdMusic, function() {
                        currentMusic = 'fourth';
                        fourthMusic.play().catch(e => console.error("Erro ao iniciar música:", e));
                    });
                }
            }
        });
    });
    
    // Botão para ativar o pensamento do Midoria
    const thoughtButton = document.getElementById('thought-button');
    const thoughtPopup = document.getElementById('thought-popup');
    const creditsContainer = document.getElementById('credits-container');
    const achievementContainer = document.getElementById('achievement-container');
    
    // Ativa a sequência de pensamentos quando o botão é clicado
    thoughtButton.addEventListener('click', function() {
        // Efeito de flash de conquista
        achievementFlash.classList.add('active');
        setTimeout(() => {
            achievementFlash.classList.remove('active');
        }, 1000);
        
        // Exibe o popup com o balão de pensamento
        setTimeout(() => {
            thoughtPopup.classList.remove('hidden');
            setTimeout(() => {
                thoughtPopup.classList.add('visible');
                
                // Para a música atual
                if (musicEnabled) {
                    fadeOutMusic(getCurrentMusic());
                }
                
                // Inicia a sequência de pensamentos
                startThoughtSequence();
            }, 50);
        }, 1000);
    });
    
    // Função para obter a música atual
    function getCurrentMusic() {
        switch(currentMusic) {
            case 'initial': return initialMusic;
            case 'second': return secondMusic;
            case 'third': return thirdMusic;
            case 'fourth': return fourthMusic;
            default: return initialMusic;
        }
    }
    
    // Função para fazer fade out na música
    function fadeOutMusic(music, callback) {
        if (!music || !musicEnabled) {
            if (typeof callback === 'function') {
                callback();
            }
            return;
        }
        
        const originalVolume = music.volume;
        const fadeInterval = setInterval(() => {
            if (music.volume > 0.05) {
                music.volume -= 0.05;
            } else {
                clearInterval(fadeInterval);
                music.pause();
                music.currentTime = 0;
                music.volume = originalVolume;
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }, 100);
    }
    
    // Inicializar volume
    updateVolumeBar();
});

// Função para animar a sequência de pensamentos
function startThoughtSequence() {
    const thought1 = document.getElementById('thought-1');
    const action1 = document.getElementById('action-1');
    const thought2 = document.getElementById('thought-2');
    const action2 = document.getElementById('action-2');
    const thought3 = document.getElementById('thought-3');
    const dangerAlert = document.querySelector('.danger-alert');
    const ideaLight = document.querySelector('.idea-light');
    const pigContainer = document.querySelector('.pig-image-container');
    const pigImage = document.querySelector('.pig-image');
    const thoughtPopup = document.getElementById('thought-popup');
    const creditsContainer = document.getElementById('credits-container');
    const achievementContainer = document.getElementById('achievement-container');
    
    // Sons
    const alertSound = new Audio('sounds/Alarme de Emergência - Som de Alerta Vermelho Emergency Alarm - Red Alert Sound आपातका.mp3');
    const ideaSound = new Audio('sounds/som de ideia nova efeito sonoro.mp3');
    const pigSound = new Audio('sounds/Som Do Porco - barulho do porco ..mp3');
    
    // Ajusta os volumes (usando o volume global definido anteriormente)
    const currentVolume = parseFloat(document.getElementById('volume-bar').style.width) / 100 || 0.2;
    alertSound.volume = currentVolume * 1.5;
    ideaSound.volume = currentVolume * 1.5;
    pigSound.volume = currentVolume * 1.5;
    
    // Sequência de animação
    setTimeout(() => {
        thought1.classList.add('active');
        
        setTimeout(() => {
            thought1.classList.remove('active');
            
            setTimeout(() => {
                action1.classList.add('active');
                dangerAlert.style.display = 'flex';
                // Reproduz o som de alerta
                alertSound.play();
                
                // Adiciona uma classe ao balão de pensamento para garantir o efeito vermelho
                document.getElementById('midoria-thoughts').classList.add('danger');
                
                setTimeout(() => {
                    action1.classList.remove('active');
                    dangerAlert.style.display = 'none';
                    document.getElementById('midoria-thoughts').classList.remove('danger');
                    // Para o som de alerta
                    alertSound.pause();
                    alertSound.currentTime = 0;
                    
                    setTimeout(() => {
                        thought2.classList.add('active');
                        
                        setTimeout(() => {
                            thought2.classList.remove('active');
                            
                            setTimeout(() => {
                                action2.classList.add('active');
                                ideaLight.style.display = 'flex';
                                // Reproduz o som de ideia
                                ideaSound.play();
                                
                                setTimeout(() => {
                                    action2.classList.remove('active');
                                    ideaLight.style.display = 'none';
                                    // Para o som de ideia
                                    ideaSound.pause();
                                    ideaSound.currentTime = 0;
                                    
                                    setTimeout(() => {
                                        thought3.classList.add('active');
                                        
                                        setTimeout(() => {
                                            // Esconde o texto quando o porco aparece
                                            thought3.classList.add('hide');
                                            
                                            pigContainer.classList.add('active');
                                            pigImage.classList.add('active');
                                            // Reproduz o som do porco por 1.5 segundos
                                            pigSound.play();
                                            
                                            setTimeout(() => {
                                                pigSound.pause();
                                                pigSound.currentTime = 0;
                                                
                                                // Espera mais 1 segundo após o som terminar antes de fechar
                                                setTimeout(() => {
                                                    // Fechamos primeiro o popup de pensamento
                                                    thoughtPopup.classList.remove('visible');
                                                    
                                                    // Após o popup desaparecer, esperamos um pouco para esconder o porco
                                                    setTimeout(() => {
                                                        // Animação de saída do porco
                                                        pigImage.style.animation = 'kickIn 0.8s reverse forwards';
                                                        
                                                        setTimeout(() => {
                                                            thoughtPopup.classList.add('hidden');
                                                            
                                                            // Mostra a tela de créditos
                                                            creditsContainer.classList.remove('hidden');
                                                            
                                                            setTimeout(() => {
                                                                creditsContainer.classList.add('visible');
                                                                
                                                                // Após o tempo dos créditos, exibe a conquista
                                                                setTimeout(() => {
                                                                    creditsContainer.classList.remove('visible');
                                                                    
                                                                    setTimeout(() => {
                                                                        creditsContainer.classList.add('hidden');
                                                                        
                                                                        // Rolar para o topo da página
                                                                        window.scrollTo({
                                                                            top: 0,
                                                                            behavior: 'smooth'
                                                                        });
                                                                        
                                                                        // Mostra a conquista
                                                                        setTimeout(() => {
                                                                            achievementContainer.classList.remove('hidden');
                                                                            achievementContainer.classList.add('visible');
                                                                            // Toca o som da ideia para a conquista
                                                                            const achievementSound = new Audio('sounds/som de ideia nova efeito sonoro.mp3');
                                                                            achievementSound.volume = currentVolume * 1.5;
                                                                            achievementSound.play();
                                                                            
                                                                            // Esconde automaticamente após o tempo da animação
                                                                            setTimeout(() => {
                                                                                achievementContainer.classList.remove('visible');
                                                                                
                                                                                setTimeout(() => {
                                                                                    achievementContainer.classList.add('hidden');
                                                                                }, 500);
                                                                            }, 5000);
                                                                        }, 1000);
                                                                    }, 1000);
                                                                }, 35000); // Tempo dos créditos
                                                            }, 50);
                                                        }, 1000);
                                                    }, 500);
                                                }, 1000);
                                            }, 1500); // Tempo do som do porco
                                        }, 1800); // Após "HUNF!"
                                    }, 800);
                                }, 2000); // Duração da ação 2
                            }, 800);
                        }, 2500); // Duração do pensamento 2
                    }, 800);
                }, 2000); // Duração da ação 1
            }, 800);
        }, 2500); // Duração do pensamento 1
    }, 1000); // Início da sequência após o balão aparecer
}

// Função para criar partículas douradas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Estilo das partículas
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 6 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.8)';
        
        // Posição aleatória
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animação
        particle.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Adicionar keyframe animation para float
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .gold-icon.clicked {
            transform: scale(1.3);
            transition: transform 0.3s ease;
            color: #ffdc73;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Função para criar explosão de partículas ao clicar no ouro
function createGoldBurst(event) {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'fixed';
    burstContainer.style.top = `${event.pageY}px`;
    burstContainer.style.left = `${event.pageX}px`;
    burstContainer.style.zIndex = '1000';
    burstContainer.style.pointerEvents = 'none';
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Estilo das partículas
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = '#ffd700';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 6px rgba(255, 215, 0, 0.8)';
        
        // Animação
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const distance = Math.random() * 80 + 20;
        
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.animation = `burst 0.8s ease-out forwards`;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes burst {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(
                        calc(-50% + ${Math.cos(angle) * distance}px), 
                        calc(-50% + ${Math.sin(angle) * distance}px)
                    ) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
        
        burstContainer.appendChild(particle);
    }
    
    document.body.appendChild(burstContainer);
    
    // Remover após a animação
    setTimeout(() => {
        document.body.removeChild(burstContainer);
    }, 1000);
} 