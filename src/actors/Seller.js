import { Machine, assign, sendParent } from "https://jspm.dev/xstate";
import { randomDelay } from "./shared.js";

const context = {
  balance: 200,
  hiddenValueFn: [1, 2, 3, 4, 5], // flesh out later
  ask: {},
  sentAsks: [],
  transactions: [],
};

const config = Machine(
  {
    id: "seller",
    initial: "resting",
    states: {
      resting: {
        on: {
          TRADING_OPEN: "contemplating",
        },
      },
      contemplating: {
        after: [
          {
            delay: randomDelay(10),
            target: "selling",
          },
        ],
        on: { TRADING_CLOSED: "resting" },
      },
      selling: {
        entry: ["defineAsk", "sendAsk", "updateSentAsks"],
        on: {
          "": "contemplating",
        },
      },
    },
  },
  {
    actions: {
      defineAsk: assign({
        bid: {
          quantity: 1,
          price: Math.ceil(Math.random() * 200),
        },
      }),
      sendBid: sendParent((ctx) => ({
        type: "SELLER.PLACE_ASK",
        bid: ctx.bid,
      })),
      updateSentBids: assign((ctx) => {
        return {
          ...ctx,
          sentBids: [...ctx.sentBids, ctx.bid],
          bid: {},
        };
      }),
    },
  }
);

export const Seller = {
  config,
  context,
};
