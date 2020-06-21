import { interpret } from "https://jspm.dev/xstate";
import { Market } from "../actors/Market.js";

/**
 * There are two kinds of information we can store in XState.
 *  1) "Finite State," or a deterministic (but nestable) state machine that's represented as a graph (think, "on" or "off" of a lightswitch)
 *  2) "Extended State," aka, anything arbitrary we might want to store. You can think of this like a plain old javascript object, because it is.
 */

/**
 * First, we'll start a "market". This takes the config specified in ../actors/market.js
 * and starts an instance of it. This will populate a set of agents, and store them in it's own
 * context inside the `agents` property.
 */

/**
 * We can register a callback to let us know any time the state of the market has changed.
 * In JS you have to declare a function before you use it, we do that here:
 */

const logMarketState = (state) => {
  console.log("Event occurred: ", state.event.type);
  console.log("# Bids:", state.context.bids.length);
  console.log("# Asks:", state.context.asks.length);
};

const market = interpret(Market).onTransition(logMarketState).start();
