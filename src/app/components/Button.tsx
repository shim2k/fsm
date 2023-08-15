'use client';

import { useState } from "react";
import { MenuItem, Select } from "@mui/material";

type DropdownProps = {
    onChange: (e: any) => void;
    width: number | string;
}

const StockDropdown = ({ width, onChange }: DropdownProps) => {
    const [value, setValue] = useState('');

    return (<Select
            value={value}
            sx={{
                width
            }}
            placeholder={'Choose a stock'}
            onChange={onChange}
        >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
        </Select>
    )
}

export default StockDropdown;