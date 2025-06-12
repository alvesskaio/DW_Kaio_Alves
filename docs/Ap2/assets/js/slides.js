/**
 * Módulo para controlar a navegação por slides no simulador
 * Versão simplificada para melhor compatibilidade
 */

import { getEconomicIndicators } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página do simulador
    const slidesContainer = document.querySelector('.slides-container');
    if (!slidesContainer) return;

    // Inicializa o sistema de slides
    initSlider();
});

/**
 * Inicializa o sistema de navegação por slides
 */
function initSlider() {
    // Elementos do DOM
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const submitButton = document.querySelector('.submit-simulation');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Estado atual
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Funções de navegação
    function showSlide(index) {
        // Esconde todos os slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Mostra o slide atual
        slides[index].classList.add('active');

        // Atualiza os passos do progresso
        updateProgressSteps(index);

        // Atualiza o estado dos botões
        updateButtonsState();
    }

    function updateProgressSteps(index) {
        // Atualiza o estado dos passos de progresso
        progressSteps.forEach((step, i) => {
            if (i < index) {
                // Passos anteriores
                step.classList.remove('active');
                step.classList.add('done');
            } else if (i === index) {
                // Passo atual
                step.classList.add('active');
                step.classList.remove('done');
            } else {
                // Passos posteriores
                step.classList.remove('active');
                step.classList.remove('done');
            }
        });
    }

    function nextSlide() {
        // Valida o slide atual
        if (!validateCurrentSlide()) {
            return;
        }

        // Avança para o próximo slide se possível
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }

    function prevSlide() {
        // Volta para o slide anterior se possível
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    }

    function updateButtonsState() {
        // Habilita/desabilita o botão anterior
        prevButton.disabled = currentSlide === 0;

        // Controla a visibilidade do botão próximo e do botão de envio
        if (currentSlide === totalSlides - 2) {
            // Penúltimo slide - mostra o botão de envio
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else if (currentSlide === totalSlides - 1) {
            // Último slide - esconde ambos
            nextButton.style.display = 'none';
            submitButton.style.display = 'none';
            prevButton.style.display = 'none';
        } else {
            // Outros slides - mostra apenas o botão próximo
            nextButton.style.display = 'block';
            submitButton.style.display = 'none';
        }
    }

    /**
     * Valida os campos do slide atual
     * @returns {boolean} - Verdadeiro se o slide for válido
     */
    function validateCurrentSlide() {
        const currentSlideElement = slides[currentSlide];

        switch (currentSlide) {
            case 0: // Perfil do investidor
                const perfilSelecionado = currentSlideElement.querySelector('input[name="perfil"]:checked');
                if (!perfilSelecionado) {
                    alert('Por favor, selecione um perfil de investidor.');
                    return false;
                }
                break;

            case 1: // Valor a investir
                const valorInicial = currentSlideElement.querySelector('#valor-inicial').value;
                const tempoInvestimento = currentSlideElement.querySelector('#tempo-investimento').value;

                if (!valorInicial || valorInicial <= 0) {
                    alert('Por favor, informe um valor inicial válido.');
                    return false;
                }

                if (!tempoInvestimento || tempoInvestimento <= 0) {
                    alert('Por favor, informe um período de investimento válido.');
                    return false;
                }
                break;

            case 2: // Tipos de investimentos
                const tiposSelecionados = currentSlideElement.querySelectorAll('input[name="tipo"]:checked');
                if (tiposSelecionados.length === 0) {
                    alert('Por favor, selecione pelo menos um tipo de investimento.');
                    return false;
                }
                break;
        }

        return true;
    }

    /**
     * Processa a simulação e exibe os resultados
     */
    function submitSimulation() {
        // Valida o slide atual
        if (!validateCurrentSlide()) {
            return;
        }

        // Coleta os dados do formulário
        const perfil = document.querySelector('input[name="perfil"]:checked').value;
        const valorInicial = parseFloat(document.querySelector('#valor-inicial').value);
        const aporteMensal = parseFloat(document.querySelector('#aporte-mensal').value || 0);
        const tempoInvestimento = parseInt(document.querySelector('#tempo-investimento').value);

        const tiposSelecionados = [];
        document.querySelectorAll('input[name="tipo"]:checked').forEach(checkbox => {
            tiposSelecionados.push(checkbox.value);
        });

        // Processa os resultados
        const resultado = processResults(perfil, valorInicial, aporteMensal, tempoInvestimento, tiposSelecionados);

        // Exibe os resultados no último slide
        displayResults(resultado);

        // Avança para o último slide
        currentSlide = totalSlides - 1;
        showSlide(currentSlide);
    }

    /**
     * Processa e calcula os resultados da simulação
     * @returns {Object} - Objeto com os resultados processados
     */
    function processResults(perfil, valorInicial, aporteMensal, tempoInvestimento, tiposSelecionados) {
        // Utiliza dados econômicos pré-definidos para garantir funcionamento confiável
        const economicData = {
            selic: 10.75,
            cdi: 10.65,
            ipca: 4.23
        };

        // Tenta carregar dados reais (assincronamente)
        getEconomicIndicators().then(indicators => {
            if (indicators) {
                economicData.selic = indicators.selic.raw;
                economicData.cdi = indicators.cdi.raw;
                economicData.ipca = indicators.ipca.raw;
                console.log('Dados econômicos atualizados para o simulador:', economicData);
            }
        }).catch(err => {
            console.warn('Usando valores padrão para o simulador:', err);
        });

        // Determinação das taxas com base no perfil
        let taxaBase;
        let recomendacoes = [];

        switch (perfil) {
            case 'conservador':
                taxaBase = economicData.cdi / 100 / 12; // Taxa mensal
                recomendacoes = [
                    'Tesouro Direto (Tesouro SELIC)',
                    'CDBs de bancos grandes',
                    'Fundos DI'
                ];
                break;

            case 'moderado':
                taxaBase = (economicData.cdi * 1.1) / 100 / 12; // 110% do CDI
                recomendacoes = [
                    'Tesouro IPCA+',
                    'Fundos Multimercado',
                    'Fundos Imobiliários'
                ];
                break;

            case 'arrojado':
                taxaBase = (economicData.cdi * 1.3) / 100 / 12; // 130% do CDI
                recomendacoes = [
                    'Ações de empresas consolidadas',
                    'ETFs',
                    'Fundos de Ações'
                ];
                break;
        }

        // Ajuste da taxa com base nos tipos de investimento
        if (tiposSelecionados.includes('cripto')) {
            taxaBase *= 1.2; // Aumenta a taxa esperada
        }

        // Cálculo do montante final
        let montanteFinal = valorInicial;
        let totalInvestido = valorInicial;
        const rendimentosMensais = [];

        for (let i = 1; i <= tempoInvestimento; i++) {
            // Adiciona o aporte mensal
            if (i > 1) { // A partir do segundo mês
                montanteFinal += aporteMensal;
                totalInvestido += aporteMensal;
            }

            // Calcula o rendimento do mês
            const rendimentoMes = montanteFinal * taxaBase;
            montanteFinal += rendimentoMes;

            // Guarda os valores para o gráfico
            if (i % 3 === 0 || i === tempoInvestimento) { // A cada 3 meses ou no final
                rendimentosMensais.push({
                    mes: i,
                    valor: montanteFinal
                });
            }
        }

        // Calcula retorno total e mensal
        const retornoTotal = montanteFinal - totalInvestido;
        const retornoPercentual = (retornoTotal / totalInvestido) * 100;

        return {
            montanteFinal,
            totalInvestido,
            retornoTotal,
            retornoPercentual,
            rendimentosMensais,
            taxaMensal: taxaBase * 100,
            taxaAnual: (Math.pow(1 + taxaBase, 12) - 1) * 100,
            perfil,
            tempoInvestimento,
            recomendacoes
        };
    }

    /**
     * Exibe os resultados no slide final
     */
    function displayResults(resultado) {
        // Seleciona os elementos no DOM
        const recommendationElement = document.querySelector('.recommendation');
        const returnsGridElement = document.querySelector('.returns-grid');

        // Formata os valores monetários
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Atualiza a recomendação
        let recomendacaoHTML = `
            <h3>Perfil: ${resultado.perfil.charAt(0).toUpperCase() + resultado.perfil.slice(1)}</h3>
            <p>Com base no seu perfil, recomendamos os seguintes investimentos:</p>
            <ul>
                ${resultado.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;

        // Adiciona badge para indicar a origem dos dados
        if (resultado.dadosReais) {
            recomendacaoHTML += `
                <div class="data-badge real">
                    <i class="fas fa-check-circle"></i>
                    Simulação com taxas reais atualizadas do mercado
                </div>
            `;
        } else {
            recomendacaoHTML += `
                <div class="data-badge simulated">
                    <i class="fas fa-info-circle"></i>
                    Simulação com taxas estimadas
                </div>
            `;
        }

        recommendationElement.innerHTML = recomendacaoHTML;

        // Atualiza os retornos estimados
        let returnsHTML = `
            <div class="return-item">
                <h4>Valor inicial</h4>
                <p>${formatter.format(resultado.totalInvestido)}</p>
            </div>
            <div class="return-item">
                <h4>Montante final</h4>
                <p>${formatter.format(resultado.montanteFinal)}</p>
            </div>
            <div class="return-item">
                <h4>Retorno total</h4>
                <p>${formatter.format(resultado.retornoTotal)}</p>
            </div>
            <div class="return-item">
                <h4>Retorno percentual</h4>
                <p>${resultado.retornoPercentual.toFixed(2)}%</p>
            </div>
            <div class="return-item">
                <h4>Taxa mensal</h4>
                <p>${resultado.taxaMensal.toFixed(2)}%</p>
            </div>
            <div class="return-item">
                <h4>Taxa anual</h4>
                <p>${resultado.taxaAnual.toFixed(2)}%</p>
            </div>
        `;
        returnsGridElement.innerHTML = returnsHTML;

        // Cria o gráfico
        createChart(resultado.rendimentosMensais, formatter);
    }

    /**
     * Cria um gráfico com os resultados
     */
    function createChart(dados, formatter) {
        const ctx = document.getElementById('investment-chart').getContext('2d');

        // Se já existir um gráfico, destrua-o
        if (window.investmentChart) {
            window.investmentChart.destroy();
        }

        // Extrai meses e valores dos dados
        const meses = dados.map(item => `Mês ${item.mes}`);
        const valores = dados.map(item => item.valor);

        // Cria o novo gráfico
        window.investmentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Valor do Investimento',
                    data: valores,
                    backgroundColor: 'rgba(33, 161, 121, 0.2)', // Cor alinhada com o design
                    borderColor: 'rgba(33, 161, 121, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(33, 161, 121, 1)',
                    pointRadius: 4,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatter.format(context.parsed.y);
                            }
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return formatter.format(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Adiciona os listeners de eventos
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    if (submitButton) submitButton.addEventListener('click', submitSimulation);

    // Define o slide inicial (o primeiro slide já deve estar com display: block)
    currentSlide = 0;
    updateProgressSteps(currentSlide);
    updateButtonsState();
}
