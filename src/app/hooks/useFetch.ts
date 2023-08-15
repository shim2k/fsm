'use client';

import { useMemo, useState } from "react";
import { CommonEvents, Machine } from "@/fsm";
import { MachineOptions } from "@/fsm/types";

const machineConfig: MachineOptions = {
    initialState: 'Idle',
    states: {
        Idle: {
            events: {
                fetchData: {
                    target: 'Fetching',
                    action: 'startFetch'
                }
            }
        },
        Fetching: {
            events: {
                success: {
                    target: 'Fetched'
                },
                fail: {
                    target: 'Error'
                }
            }
        },
        Fetched: {
            events: {
                reFetch: {
                    target: 'Fetching',
                    action: 'startFetch'
                }
            }
        },
        Error: {
            events: {
                reFetch: {
                    target: 'Fetching',
                    action: 'startFetch'
                }
            }
        }
    },
    actions: {}
};

export default function useFetch(url: string) {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [state, setState] = useState('Idle');

    const fsm = useMemo(() => new Machine({
        ...machineConfig,
        actions: {
            startFetch: async (currentState, event, { url }) => {
                setData(null);
                setError('');
                try {
                    const response = await window.fetch(url);
                    if (response.ok) {
                        const result = await response.json();
                        setData(result);
                        fsm.input('success')
                    } else {
                        setError('Network Error');
                        fsm.input('fail')
                    }
                } catch (err: any) {
                    setError(err.message || '');
                    fsm.input('fail')
                }
            }
        }
    }), []);

    fsm.on(CommonEvents.NewState, (newState) => {
        setState(newState);
    });

    const fetch = () => {
        fsm.input('fetchData', { url });
    };

    const reFetch = () => {
        fsm.input('reFetch', { url });
    };

    return { data, error, state, fetch, reFetch };
};
