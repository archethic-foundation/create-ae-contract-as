import {
    ActionResult,
    Context,
    ContextWithParams,
    TriggerType,
} from "@archethicjs/ae-contract-as/assembly";

class State {
    counter: i32 = 0;
}

export function onInit(context: Context<State>): State {
    return new State();
}

class IncArgs {
    value!: u32;
}

@action(TriggerType.Transaction)
export function inc(context: ContextWithParams<State, IncArgs>): ActionResult<State> {
    const state = context.state;
    assert(state.counter >= 0, "state cannot be negative");

    if (context.arguments.value == 0)
        throw new Error("increment value must be greater than 0")

    state.counter += context.arguments.value;

    return new ActionResult<State>().setState(state)
}
