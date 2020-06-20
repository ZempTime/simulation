import { Machine } from "https://jspm.dev/xstate";

export const Agent = Machine({
  id: "agent",
  context: {
    balance: 100,
  },
  initial: "trading",
  states: {
    trading: {},
  },
});
