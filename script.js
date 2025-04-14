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
    
    // Elementos para o pop-up de imagem
    const imagePopupOverlay = document.getElementById('image-popup-overlay');
    const popupImage = document.getElementById('popup-image');
    const closePopupButton = document.querySelector('.close-popup');
    
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
            if (this.classList.contains('active')) {
                // Se já estiver ativa, mostrar a imagem no pop-up
                showImageInPopup(this);
                return;
            }
            
            // Verificar se a imagem está na ordem correta para ser desbloqueada
            if (index > 0 && !imageContainers[index - 1].classList.contains('active')) {
                // Adicionar efeito de "sacudida" para indicar que não pode desbloquear
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
                return;
            }
            
            // Marca a imagem como ativa mas não altera a aparência dela ainda
            this.classList.add('active-pending');
            
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
            
            // Mostrar a imagem no pop-up imediatamente
            showImageInPopup(this);
            
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
    
    // Função para mostrar imagem no pop-up
    function showImageInPopup(container) {
        // Obter o ID da imagem e o caminho do arquivo
        const parallaxImage = container.querySelector('.parallax-image');
        let imagePath = '';
        let imageType = '';
        
        if (parallaxImage.id === 'gold-image') {
            imagePath = 'images/O ouro que tanto me cegava....webp';
            imageType = 'gold';
        } else if (parallaxImage.id === 'factory-image') {
            imagePath = 'images/A fábrica abandonada onde minha vida mudou....png';
            imageType = 'factory';
        } else if (parallaxImage.id === 'piglin-image') {
            imagePath = 'images/Minha nova forma.webp';
            imageType = 'piglin';
        }
        
        // Configurar a imagem no pop-up
        popupImage.src = imagePath;
        
        // Aplicar estilo específico à moldura do pop-up
        const popupContainer = document.querySelector('.image-popup-container');
        popupContainer.className = 'image-popup-container';
        popupContainer.classList.add(`image-popup-${imageType}`);
        
        // Aplicar estilo específico ao botão de fechar
        const closeButton = document.querySelector('.close-popup');
        closeButton.className = 'close-popup';
        closeButton.classList.add(`close-popup-${imageType}`);
        
        // Mostrar o pop-up
        document.body.classList.add('scroll-locked');
        imagePopupOverlay.style.display = 'flex';
        
        // Guardar referência ao container atual no pop-up
        imagePopupOverlay.dataset.currentContainer = Array.from(imageContainers).indexOf(container);
        imagePopupOverlay.dataset.imageType = imageType;
    }
    
    // Fechar o pop-up quando clicar no botão X
    closePopupButton.addEventListener('click', function() {
        // Esconder o pop-up
        imagePopupOverlay.style.display = 'none';
        document.body.classList.remove('scroll-locked');
        
        // Pegar o container atual e mostrar a citação
        const containerIndex = parseInt(imagePopupOverlay.dataset.currentContainer);
        const currentContainer = imageContainers[containerIndex];
        const imageType = imagePopupOverlay.dataset.imageType;
        
        // Primeiro tornar a imagem realmente ativa se estava pendente
        if (currentContainer.classList.contains('active-pending')) {
            currentContainer.classList.remove('active-pending');
            currentContainer.classList.add('active');
        }
        
        // Esconder a imagem parallax e mostrar a citação
        const parallaxImage = currentContainer.querySelector('.parallax-image');
        const imageCaption = currentContainer.querySelector('.image-caption');
        const imageQuote = currentContainer.querySelector('.image-quote');
        
        parallaxImage.style.display = 'none';
        imageCaption.style.display = 'none';
        
        // Mostrar a citação diretamente, sem efeito flashbang
        imageQuote.style.display = 'flex';
        
        // Aplicar classe específica para personalização baseada no tipo de imagem
        imageQuote.classList.add(`image-quote-${imageType}`);
    });
    
    // Fechar o pop-up quando clicar fora da imagem
    imagePopupOverlay.addEventListener('click', function(e) {
        if (e.target === imagePopupOverlay) {
            closePopupButton.click();
        }
    });
    
    // Botão para ativar o pensamento do Midoria
    const thoughtButton = document.getElementById('thought-button');
    const thoughtPopup = document.getElementById('thought-popup');
    const creditsContainer = document.getElementById('credits-container');
    
    // Elementos de conquistas
    const mindreadAchievement = document.getElementById('mindread-achievement');
    const chapterAchievement = document.getElementById('chapter-achievement');
    
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
    const thoughtBubble = document.getElementById('midoria-thoughts');
    const thoughtPopup = document.getElementById('thought-popup');
    const creditsContainer = document.getElementById('credits-container');
    
    // Elementos de conquistas
    const mindreadAchievement = document.getElementById('mindread-achievement');
    const chapterAchievement = document.getElementById('chapter-achievement');
    
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
                thoughtBubble.classList.add('danger');
                
                setTimeout(() => {
                    action1.classList.remove('active');
                    dangerAlert.style.display = 'none';
                    thoughtBubble.classList.remove('danger');
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
                                        
                                        // Mostra a conquista de quebra da quarta parede aqui, no final do pensamento
                                        mindreadAchievement.classList.remove('hidden');
                                        
                                        // Tocar som de ideia para a conquista
                                        const mindreadSound = new Audio('sounds/som de ideia nova efeito sonoro.mp3');
                                        mindreadSound.volume = currentVolume * 1.5;
                                        mindreadSound.play();
                                        
                                        setTimeout(() => {
                                            mindreadAchievement.classList.add('visible');
                                        }, 500);
                                        
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
                                                                
                                                                // Após o tempo dos créditos
                                                                setTimeout(() => {
                                                                    creditsContainer.classList.remove('visible');
                                                                    
                                                                    setTimeout(() => {
                                                                        creditsContainer.classList.add('hidden');
                                                                        
                                                                        // Após os créditos, mostrar a conquista do capítulo
                                                                        chapterAchievement.classList.remove('hidden');
                                                                        
                                                                        // Tocar som de ideia para a conquista
                                                                        const achievementSound = new Audio('sounds/som de ideia nova efeito sonoro.mp3');
                                                                        achievementSound.volume = currentVolume * 1.5;
                                                                        achievementSound.play();
                                                                        
                                                                        setTimeout(() => {
                                                                            chapterAchievement.classList.add('visible');
                                                                        }, 500);
                                                                        
                                                                        // Rolar para o topo da página
                                                                        window.scrollTo({
                                                                            top: 0,
                                                                            behavior: 'smooth'
                                                                        });
                                                                    }, 500);
                                                                }, 35000); // Ajustado para 35 segundos
                                                            }, 50);
                                                        }, 800);
                                                    }, 500);
                                                }, 1000);
                                            }, 1500);
                                        }, 3000);
                                    }, 1500);
                                }, 3000);
                            }, 1500);
                        }, 3000);
                    }, 1500);
                }, 3000);
            }, 1500);
        }, 3000);
    }, 1000);
}

// Função para criar partículas douradas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posição aleatória
        particle.style.left = `${Math.random() * 100}%`;
        
        // Distribuir as partículas em diferentes alturas iniciais
        // para evitar que todas comecem do fundo
        particle.style.top = `${Math.random() * 100 + 10}%`;
        
        // Tamanho variado 
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Opacidade variada
        particle.style.opacity = `${Math.random() * 0.4 + 0.2}`;
        
        // Velocidade variada - mais rápido = menos atraso perceptível
        const duration = Math.random() * 15 + 10;
        particle.style.animation = `float ${duration}s linear infinite`;
        
        // Delays mais curtos e variados para dar impressão de movimento contínuo
        const delay = Math.random() * 3;
        particle.style.animationDelay = `-${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Adicionar keyframe animation modificado
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0);
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