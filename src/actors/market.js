import { Machine, assign, spawn } from "https://jspm.dev/xstate";
import { Buyer } from "./Buyer.js";
import { Seller } from "./Seller.js";

export const Market = Machine(
  {
    id: "market",
    context: {
      configuration: {
        numberOfSellers: 6,
        numberOfBuyers: 6,
        hiddenRedemptionPrice: 1, // flesh out later
        marketSupplyFunction: 1, // flesh out later
      },
      sellers: [],
      buyers: [],
      bids: [],
      asks: [],
      transactions: [],
    },
    initial: "initializing",
    states: {
      initializing: {
        entry: ["populateBuyers", "populateSellers"],
        on: {
          "": "open",
        },
      },
      open: {
        entry: ["notifyOpen"],
        after: {
          30000: "closed",
        },
        on: {
          "BUYER.PLACE_BID": {
            actions: ["trackBid"],
          },
          "SELLER.PLACE_ASK": {
            actions: ["trackAsk"],
          },
        },
      },
      closed: {
        entry: ["notifyClosed"],
      },
    },
  },
  {
    actions: {
      populateBuyers: assign({
        buyers: (ctx) => {
          const buyers = [];
          for (let id = 0; id < ctx.configuration.numberOfBuyers; id++) {
            buyers.push({
              id: `buyer-${id}`,
              ref: spawn(
                Machine(Buyer.config).withContext(Buyer.context),
                `buyer-${id}`
              ),
            });
          }
          return buyers;
        },
      }),
      populateSellers: assign({
        sellers: (ctx) => {
          const sellers = [];
          for (let id = 0; id < ctx.configuration.numberOfSellers; id++) {
            sellers.push({
              id: `seller-${id}`,
              ref: spawn(
                Machine(Seller.config).withContext(Seller.context),
                `seller-${id}`
              ),
            });
          }
          return sellers;
        },
      }),
      notifyOpen: (ctx) => {
        ctx.buyers.forEach((buyer) => buyer.ref.send("TRADING_OPEN"));
        ctx.sellers.forEach((seller) => seller.ref.send("TRADING_OPEN"));
      },
      notifyClosed: (ctx) => {
        ctx.buyers.forEach((buyer) => buyer.ref.send("TRADING_CLOSED"));
        ctx.sellers.forEach((seller) => seller.ref.send("TRADING_CLOSED"));
      },
      trackBid: assign({
        bids: (ctx, e) => {
          debugger;
        },
      }),
    },
  }
);
