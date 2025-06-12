/**
 * Módulo para funcionalidades específicas da página de economia
 */

import { createLineChart } from './chart.js';
import { formatPercent } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página de economia
    if (window.location.href.includes('economia.html')) {
        initEconomyCharts();
    }
});

/**
 * Inicializa gráficos na página de economia
 */
function initEconomyCharts() {
    // Verifica se o elemento para o gráfico existe
    const chartContainer = document.querySelector('.charts-container');
    if (!chartContainer) return;

    // Gera dados históricos simulados para SELIC
    const selicHistoricalData = generateHistoricalData(12, 13.25, 0.5);

    // Gera dados históricos simulados para IPCA
    const ipcaHistoricalData = generateHistoricalData(12, 4.65, 0.3);

    // Cria gráficos com os dados
    createLineChart('selic-chart', selicHistoricalData, 'month', 'value', 'Taxa Selic (% a.a.)');
    createLineChart('ipca-chart', ipcaHistoricalData, 'month', 'value', 'IPCA (% a.a.)');
}

/**
 * Gera dados históricos simulados para gráficos
 * @param {number} months - Quantidade de meses para gerar
 * @param {number} currentValue - Valor atual do indicador
 * @param {number} volatility - Volatilidade máxima mês a mês
 * @returns {Array} - Array de objetos com mês e valor
 */
function generateHistoricalData(months, currentValue, volatility) {
    const data = [];
    let value = currentValue;

    // Gera dados de trás para frente
    for (let i = months; i >= 0; i--) {
        // Variação aleatória dentro da volatilidade
        const variation = (Math.random() * 2 - 1) * volatility;

        // Quanto mais no passado, mais chance de diferença
        value = value - variation;

        // Garante que o valor não fique negativo
        if (value < 0) value = Math.abs(variation);

        // Nome do mês relativo ao mês atual
        const date = new Date();
        date.setMonth(date.getMonth() - i);

        const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);

        data.push({
            month: monthName,
            value: value.toFixed(2)
        });
    }

    return data;
}

export { initEconomyCharts };
