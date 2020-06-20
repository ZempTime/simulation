import { Machine, assign, spawn } from "https://jspm.dev/xstate";
import { Agent } from "./agent.js";

export const Market = Machine(
  {
    id: "market",
    context: {
      configuration: {
        numberOfAgents: 10,
      },
      agents: [],
      offers: [],
    },
    initial: "initializing",
    states: {
      initializing: {
        entry: assign({
          agents: (ctx) => {
            return new Array(ctx.configuration.numberOfAgents)
              .fill("1")
              .map((_val, index) => ({
                id: index,
                ref: spawn(Agent),
              }));
          },
        }),
        on: {
          "": "ready",
        },
      },
      ready: {},
    },
  },
  {}
);
