'use client';

import { ReactNode, useState } from "react";
import { Box } from "@mui/material";

type ButtonProps = {
    onClick: (e: any) => void;
    children: ReactNode
}

const Button = ({ onClick, children }: ButtonProps) => {
    const [value, setValue] = useState('');

    return (<Box
            sx={{
                width: 200,
                display: 'flex',
                background: '#bdbdbd',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
            onClick={onClick}>
            {children}
        </Box>
    )
}

export default Button;