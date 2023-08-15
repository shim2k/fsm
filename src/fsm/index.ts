'use client';

import { Actions, MachineOptions, State, StateDefinition, States } from "./types";

export enum CommonEvents {
    NewState = 'new-state',
    InvalidEvent = 'invalid-event',
    GuardFailed = 'guard-failed',
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
        this.transitionToState(initialState);
    }

    input = (event: State, eventData?: any) => {
        const populatedState = this.states[this.currentState];
        const populatedEvent = populatedState.events[event];
        if (!populatedEvent) {
            this.dispatchEvent(new Event(CommonEvents.InvalidEvent));
            return this;
        }

        if (populatedEvent.guard && !populatedEvent.guard(this.currentState, eventData)) {
            this.dispatchEvent(new Event(CommonEvents.GuardFailed));
            return this;
        }

        if (populatedEvent.action) {
            this.executeAction(populatedEvent.action, event, eventData);
        }

        this.handleBeforeExitHook(populatedState, event);

        const populatedNextState = this.states[populatedEvent.target];
        if (!populatedNextState) return this;

        this.transitionToState(populatedEvent.target);

        this.handleAfterEnterHook(populatedState, event);

        return this;
    }

    on = (event: CommonEvents, cb: (payload: any, e: CommonEvents) => void) => {
        this.addEventListener(event, (e: any) => {
            cb(e?.detail || null, event);
        });
    }

    private handleBeforeExitHook = (populatedState: StateDefinition, event: string) => {
        if (populatedState.actions?.beforeExit && this.actions[populatedState.actions.beforeExit]) {
            this.actions[populatedState.actions.beforeExit](this.currentState, event);
        }
    }

    private handleAfterEnterHook = (populatedState: StateDefinition, event: string) => {
        if (populatedState.actions?.beforeExit && this.actions[populatedState.actions.beforeExit]) {
            this.actions[populatedState.actions.beforeExit](this.currentState, event);
        }
    }

    private executeAction(action: string | string[], event: State, eventData?: any) {
        if (Array.isArray(action)) {
            action
                .filter(a => this.actions[a])
                .forEach(a => this.actions[a](this.currentState, event, eventData));
        } else if (this.actions[action]) {
            this.actions[action](this.currentState, event, eventData);
        }
    }

    private transitionToState = (target: string) => {
        this.currentState = target;
        this.dispatchEvent(new CustomEvent(CommonEvents.NewState, {
            detail: this.currentState
        }));
    }
}