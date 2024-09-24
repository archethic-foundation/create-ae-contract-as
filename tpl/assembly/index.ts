import {
    TransactionResult,
    NoArgs,
    Context,
    TriggerType,
} from "@archethicjs/ae-contract-as/assembly";

class State {
    counter: i32 = 0;
}

export function onInit(context: Context<State, NoArgs>): State {
    return new State();
}


class IncArgs {
    value!: u32;
}

@action(TriggerType.Transaction)
export function inc(context: Context<State, IncArgs>): TransactionResult<State> {
    const state = context.state;
    assert(state.counter >= 0, "state cannot be negative");

    const args = context.arguments;
    if (args == null)
        throw new Error("invalid args")

    if (args.value == 0)
        throw new Error("increment value must be greater than 0")

    state.counter += args.value;

    return new TransactionResult<State>().setState(state)
}
