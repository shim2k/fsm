export const parseStockData = (data: any) => {
    const stockData = data['Time Series (Daily)'];
    if (!stockData) return { data: [], domain: [0, 100] };

    console.log('stock data');
    console.log(stockData);

    let domain: number[] = [];
    const results = Object.keys(stockData).map(key => {
        // @ts-ignore
        const close = +(stockData[key]['4. close']);
        if (domain.length === 0) {
            domain = [close, close];
        }
        if (domain[1] < close) {
            domain[1] = close;
        } else if (domain[0] > close) {
            domain[0] = close;
        }
        return { date: key, close: close }
    }).reverse();

    return {
        data: results,
        domain
    }
}