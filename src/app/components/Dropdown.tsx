'use client';

import { useState } from "react";
import { MenuItem, Select } from "@mui/material";

type DropdownProps = {
    onChange: (e: any) => void;
    width: number | string;
}

const StockDropdown = ({ width, onChange }: DropdownProps) => {
    const [value, setValue] = useState('AAPL');

    return (<Select
            value={value}
            sx={{
                width
            }}
            onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
        >
            <MenuItem value={'AAPL'}>AAPL</MenuItem>
            <MenuItem value={'INTU'}>INTUIT</MenuItem>
            <MenuItem value={'GOOG'}>GOOG</MenuItem>
        </Select>
    )
}

export default StockDropdown;