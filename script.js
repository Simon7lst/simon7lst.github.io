document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavbar = document.getElementById('mobile-navbar');

    mobileMenuToggle.addEventListener('click', () => {
        if (mobileNavbar.style.display === 'block') {
            mobileNavbar.style.display = 'none';
        } else {
            mobileNavbar.style.display = 'block';
        }
    });

    // Ensure mobile menu closes when a link is clicked
    document.querySelectorAll('.mobile-navbar a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavbar.style.display = 'none';
        });
    });


    function unpack(data, key) {
        return data.map(row => row[key]);
    }

    Plotly.d3.csv("csv/PurchasePower.csv", PurchasePower_data => {
        Plotly.d3.csv("csv/BLM Sentiment.csv", function (BLMSentimentCsv) {
            // Extract sentiment scores from the CSV data
            const PositiveValue = BLMSentimentCsv.map(row => parseFloat(row.Positive));
            const NegativeValue = BLMSentimentCsv.map(row => parseFloat(row.Negative));
            const NeutralValue = BLMSentimentCsv.map(row => parseFloat(row.Neutral));

            // Calculate total counts for each sentiment
            const totalPositive = PositiveValue.reduce((acc, val) => acc + val, 0);
            const totalNegative = NegativeValue.reduce((acc, val) => acc + val, 0);
            const totalNeutral = NeutralValue.reduce((acc, val) => acc + val, 0);

            // Define custom colors for each sentiment
            const colors = ['#808080', '#000000', '#FF0000'];

            // Create data for the pie chart with custom colors
            const SentimentData = [{
                values: [totalPositive, totalNegative, totalNeutral],
                labels: ['Positive', 'Negative', 'Neutral'],
                type: 'pie',
                marker: {
                    colors: colors
                }
            }];

            // Layout for the pie chart
            const SentimentLayout = {
                // height: 400,
                // width: 500,
                title: 'Sentiment Distribution',
                paper_bgcolor: 'rgb(237, 237, 237)'
                
            };

            // Create the pie chart
            Plotly.newPlot('Sentiment_Plot', SentimentData, SentimentLayout, {responsive: true});
        });

        Plotly.d3.csv("csv/BLM Timeline.csv", BLMTimelineCsv => {
            const ProfitX = unpack(BLMTimelineCsv, 'Month');
            const ProfitY = unpack(BLMTimelineCsv, 'Backlivematters Hashtag');

            const TimelineData = [{
                x: ProfitX, y: ProfitY,
                type: 'scatter',
                mode: 'lines',
                line: { color: 'rgb(241, 90, 34)' }
            }];

            const TimelineLayout = {
                title: "BLM search history Timeline (Month)",
                yaxis: { title: 'BLM Timeline' },
                paper_bgcolor: 'rgb(237, 237, 237)',
                font: { family: 'Baskerville', size: 12, color: 'rgb(3, 3, 3)' }
            };

            Plotly.newPlot('Timeline_plot', TimelineData, TimelineLayout);
        });

        Plotly.d3.csv("csv/Cyberbullying ratio.csv", function (CyberbullyingRatioCsv) {
            const AbusiveValue = CyberbullyingRatioCsv.map(row => parseFloat(row.Abusive));
            const NormalValue = CyberbullyingRatioCsv.map(row => parseFloat(row.Normal));

            const totalAbusive = AbusiveValue.reduce((acc, val) => acc + val, 0);
            const totalNormal = NormalValue.reduce((acc, val) => acc + val, 0);

            const colors = ['#000000', '#808080'];

            const CyberbullyingData = [{
                values: [totalAbusive, totalNormal],
                labels: ['Abusive', 'Normal'],
                type: 'pie',
                marker: {
                    colors: colors
                }
            }];

            const CyberbullyingLayout = {
                
                title: 'Cyberbullying ratio'
               
            };

            Plotly.newPlot('Cyberbullying_Plot', CyberbullyingData, CyberbullyingLayout);
        });

        const location = unpack(PurchasePower_data, 'Code');
        const pop_z = unpack(PurchasePower_data, 'Purchasing power index');
        const country = unpack(PurchasePower_data, 'Country/Region');

        let data = [
            {
                type: 'choropleth',
                locations: location,
                z: pop_z,
                zmin: 0,
                zmax: 100,
                text: country,
                colorscale: [
                    [0, 'rgb(64, 64, 64)'],
                    [0.2, 'rgb(92, 25, 25)'],
                    [0.4, 'rgb(128, 0, 0)'],
                    [0.6, 'rgb(153, 50, 204)'],
                    [0.8, 'rgb(220, 20, 60)'],
                    [1, 'rgb(255, 0, 0)']
                ],
                marker: {
                    line: {
                        color: 'rgb(128, 0, 0)',
                        width: 0.5
                    }
                },
                colorbar: {
                    ticksuffix: '%',
                    title: 'Purchase Power'
                }
            }
        ];

        let layout = {
            title: {
                text: '100 countries by purchase power index worldwide',
                automargin: true
            },
            geo: {
                showframe: false,
                projection: {
                    type: 'orthographic'
                },
                showocean: true,
                oceancolor: "#dedede",
                bgcolor: 'rgb(237, 237, 237)',
            },
            paper_bgcolor: 'rgb(255, 255, 255)',
            font: { family: 'Baskerville', size: 18, color: 'rgb(3, 3, 3)' }
        };

        var config = {
            responsive: true,
            scrollZoom: true,
            displayModeBar: false
        };

        Plotly.newPlot("choropleth", data, layout, config);

        Plotly.d3.csv("csv/Profit.csv", ProfitCsv => {
            const ProfitX = unpack(ProfitCsv, 'Year');
            const ProfitY = unpack(ProfitCsv, 'Profit SEK');

            const ProfitChartData = [{
                x: ProfitX, y: ProfitY,
                type: 'scatter',
                mode: 'lines',
                line: { color: 'rgb(241, 90, 34)' }
            }];

            const ProfitChartLayout = {
                title: "Profit stock price",
                yaxis: { title: 'Profit stock price(SEK)' },
                paper_bgcolor: 'rgb(255, 255, 255)',
                bgcolor: 'rgb(255, 255, 255)',
                font: { family: 'Baskerville', size: 12, color: 'rgb(3, 3, 3)' }
            };

            Plotly.newPlot('Profit_plot', ProfitChartData, ProfitChartLayout, config);
        });

        Plotly.d3.csv("csv/Brand.csv", BrandCsv => {
            const years = unpack(BrandCsv, 'Year');
            const Brand = unpack(BrandCsv, 'Brand Value');

            const BrandData = [{
                x: years,
                y: Brand,
                type: 'bar',
                marker: { color: 'rgb(255, 0, 0)' }
            }];

            const Brandlayout = {
                title: "H&M's brand value worldwide from 2016 to 2022 (in million U.S. dollars)",
                xaxis: { title: 'Year' },
                yaxis: { title: 'Total brand value worldwide' },
                showlegend: false,
                font: { family: 'Baskerville', size: 12, color: 'rgb(3, 3, 3)' }
            };

            Plotly.newPlot('Brand_Plot', BrandData, Brandlayout, config);
        });

        Plotly.d3.csv("csv/SalesSEK.csv", SalesCsv => {
            const Year = unpack(SalesCsv, 'Years');
            const Sales = unpack(SalesCsv, 'Sales(SEK)');

            const SalesData = [{
                x: Sales,
                y: Year,
                type: 'bar',
                marker: { color: 'rgb(255, 0, 0)' },
                orientation: 'h'
            }];

            const Saleslayout = {
                title: "H&M's Sales in SEK",
                xaxis: { title: 'Year' },
                yaxis: { title: 'Total Sales(SEK)' },
                showlegend: false,
                font: { family: 'Baskerville', size: 12, color: 'rgb(3, 3, 3)' }
                
            };

            Plotly.newPlot('Sales_Plot', SalesData, Saleslayout, config);
        });
    });
});