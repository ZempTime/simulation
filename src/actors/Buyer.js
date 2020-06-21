import { Machine, assign, sendParent } from "https://jspm.dev/xstate";
import { randomDelay } from "./shared.js";

const context = {
  balance: 200,
  hiddenValueFn: [1, 2, 3, 4, 5], // flesh out later
  bid: {},
  sentBids: [],
  transactions: [],
};

const config = Machine(
  {
    id: "buyer",
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
            target: "buying",
          },
        ],
        on: { TRADING_CLOSED: "resting" },
      },
      buying: {
        entry: ["defineBid", "sendBid", "updateSentBids"],
        on: {
          "": "contemplating",
        },
      },
    },
  },
  {
    actions: {
      defineBid: assign({
        bid: {
          quantity: 1,
          price: Math.ceil(Math.random() * 200),
        },
      }),
      placeBid: sendParent((ctx) => ({
        type: "BUYER.PLACE_BID",
        bid: ctx.bid,
      })),
      updateSentBids: assign((ctx) => {
        debugger;
        return {
          ...ctx,
          sentBids: [...ctx.sentBids, ctx.bid],
          bid: {},
        };
      }),
    },
  }
);

export const Buyer = {
  config,
  context,
};
