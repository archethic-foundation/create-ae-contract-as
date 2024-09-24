import { readFileSync } from "fs";
import { getContract } from "@archethicjs/ae-contract-test";

describe("inc", () => {
    it("should increment the state", async () => {
        const wasmBuffer = readFileSync("./dist/contract.wasm");
        const contract = await getContract(wasmBuffer);

        const result = contract.inc({ value: 1 }, { state: { counter: 2 } });
        expect(result?.state.counter).toBe(3);
    });
});
