'use client';

import { useEffect, useState } from "react";
import useFetch from "@/app/hooks/useFetch";
import Dropdown from "@/app/components/Dropdown";
import { Box, Card } from "@mui/material";
import Button from "@/app/components/Button";
import Chart from "@/app/components/Chart";
import { parseStockData } from "@/app/utils";

export default function Home() {
    const [stock, setStock] = useState('AAPL');
    const [chartData, setChartData] = useState<{data: any, domain: any}>({ data: [], domain: [] });

    const {
        data,
        error,
        state,
        fetch,
        reFetch
    } = useFetch(`----https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${stock}&apikey=U0YDG9GE6IU62BJW`);

    useEffect(() => {
        console.log(state)
        if (data) {
            const parsed = parseStockData(data)
            setChartData({
                data: parsed.data,
                domain: parsed.domain
            });
        }
    }, [data])

    useEffect(() => {
        fetch();
    }, []);

    return (
        <Box sx={{ padding: 15 }}>
            <Card sx={{ display: 'flex' }}>
                <Dropdown onChange={(s) => {
                    setStock(s);
                    reFetch();
                }} width={'100%'}/>
                <Button onClick={reFetch}>Re-fetch Data!</Button>
            </Card>
            {/*<Card sx={{ marginTop: 5, padding: 5, display: 'flex', justifyContent: 'center' }}>*/}
            <Box sx={{
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {state === 'Fetching' ? 'Loading...' : null}
                {state === 'Error' || error ? error : null}
                {true || state === 'Fetched' && data ? <Chart data={chartData.data} domain={chartData.domain}/> : null}
            </Box>
            {/*</Card>*/}
        </Box>
    )
}
