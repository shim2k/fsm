export type State = string;

export type GuardCondition = (currentState: State, eventData?: any) => boolean;

export type EventDefinition = {
    target: State,
    action?: string | string[]
    guard?: GuardCondition;

};

export type StateDefinition = {
    events: {
        [event: string]: EventDefinition
    },
    actions?: {
        afterEnter?: string,
        beforeExit?: string,
    }
};

export type States = {
    [state: State]: StateDefinition
};

export type Actions = {
    [key: string]: (state: State, event: string, eventData?: any) => any;
};

export type MachineOptions = {
    initialState: State;
    states: States;
    actions?: Actions;
};