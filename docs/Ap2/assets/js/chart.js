/**
 * Módulo para gerenciar os gráficos usando Chart.js
 */

// Este arquivo será carregado pela página de simulador e serve como um wrapper para a funcionalidade
// específica de gráficos que poderia ser expandida para uso em outras páginas

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos em uma página que contém gráficos
    if (document.getElementById('investment-chart')) {
        // A inicialização do gráfico é feita pelo arquivo slides.js quando necessário
        console.log('Módulo de gráficos carregado e pronto para uso');
    }
});

/**
 * Cria um gráfico de comparação de investimentos
 * @param {string} canvasId - O ID do elemento canvas
 * @param {Array} investimentos - Array de objetos com dados dos investimentos
 */
export function createInvestmentComparisonChart(canvasId, investimentos) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Extrai labels e dados
    const labels = investimentos.map(item => item.nome);
    const retornos = investimentos.map(item => item.retorno);
    const riscos = investimentos.map(item => item.risco);

    // Cria o gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Retorno Estimado (%)',
                    data: retornos,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Risco (Escala 1-10)',
                    data: riscos,
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const datasetLabel = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${datasetLabel}: ${value}${context.datasetIndex === 0 ? '%' : ''}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Cria um gráfico de linha para evolução de valores
 * @param {string} canvasId - O ID do elemento canvas
 * @param {Array} dados - Array de objetos com dados da série temporal
 * @param {string} labelField - Campo a ser usado como label
 * @param {string} valueField - Campo a ser usado como valor
 * @param {string} labelText - Texto para o label do dataset
 */
export function createLineChart(canvasId, dados, labelField, valueField, labelText) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Extrai labels e dados
    const labels = dados.map(item => item[labelField]);
    const values = dados.map(item => item[valueField]);

    // Cria o gráfico
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: labelText,
                data: values,
                backgroundColor: 'rgba(44, 62, 80, 0.2)',
                borderColor: 'rgba(44, 62, 80, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: 'rgba(44, 62, 80, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
