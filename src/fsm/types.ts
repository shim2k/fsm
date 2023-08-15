type State = string;

type States = {
    [state: State]: {
        events: {
            [event: string]: {
                target: State,
                action?: string | string[]
            }
        },
        actions?: {
            afterEnter?: string,
            beforeExit?: string,
        }
    }
};

type Actions = {
    [key: string]: (state: State, event: string) => any;
};

type MachineOptions = {
    initialState: State;
    states: States;
    actions?: Actions;
};

enum CommonEvents {
    NewState = 'new-state',
    NoEvent = 'no-event',
}

export class Machine extends EventTarget {
    private readonly states: States;
    private readonly actions: Actions;
    public currentState: State;

    constructor(options: MachineOptions) {
        super();
        const { initialState, states, actions } = options;
        this.currentState = initialState;
        this.states = states;
        this.actions = actions || {};
    }

    input = (event: State) => {
        const populatedState = this.states[this.currentState];
        const populatedEvent = populatedState.events[event];
        if (!populatedEvent) {
            this.dispatchEvent(new Event(CommonEvents.NoEvent));
            return;
        }
        if (populatedEvent.action) {
            if (Array.isArray(populatedEvent.action)) {
                populatedEvent.action
                    .filter(a => this.actions[a])
                    .forEach(a => this.actions[a](this.currentState, event));
            } else if (this.actions[populatedEvent.action]) {
                this.actions[populatedEvent.action](this.currentState, event);
            }
        }
        if (populatedState.actions?.beforeExit && this.actions[populatedState.actions.beforeExit]) {
            this.actions[populatedState.actions.beforeExit](this.currentState, event);
        }
        const populatedNextState = this.states[populatedEvent.target];
        if (!populatedNextState) return;

        this.currentState = populatedEvent.target;
        this.dispatchEvent(new CustomEvent(CommonEvents.NewState, {
            detail: this.currentState
        }));

        if (populatedNextState.actions?.afterEnter && this.actions[populatedNextState.actions?.afterEnter]) {
            this.actions[populatedNextState.actions?.afterEnter](this.currentState, event);
        }
    }
}