/*!
 * Optio v0.0.1
 * (c) Blujedis <blujedicorp@gmail.com>
 * Released under the MIT License.
 */

import readline from 'readline';
import MuteStream from 'mute-stream';
import split from 'split-string';
import figures from 'figures';
import { spawn } from 'child_process';
import ansiStyles from 'ansi-colors';
import supportsColor from 'supports-color';
import { join } from 'path';
import { homedir } from 'os';
import fsExtra from 'fs-extra';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var runtime = {exports: {}};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (module) {
var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
}(runtime));

var regenerator = runtime.exports;

var defaultCommands = {
  ':clear': {
    type: 'command',
    action: function action(args, optio) {
      optio === null || optio === void 0 ? void 0 : optio.cursorTo(0, 0);
      optio === null || optio === void 0 ? void 0 : optio.clearDown();
      optio === null || optio === void 0 ? void 0 : optio.rl.prompt();
    }
  },
  ':exit': {
    type: 'command',
    alias: [':quit'],
    action: function action(args, optio) {
      optio === null || optio === void 0 ? void 0 : optio.kill(false);
    }
  },
  ':run': {
    type: 'command',
    action: function action(args, optio) {
      // spawnSync(args.shift() as string, args, { stdio: 'inherit' });
      spawn(args.shift(), args, {
        stdio: 'inherit'
      });
    }
  }
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

// Check Is

/**
 * Checks if a value is a given type.
 *
 * @param value the value to inspect as type.
 * @param type the type that's expected.
 * @returns A type guard by the specified type.
 */
function isType(value, type) {
  if (!['date', 'regexp', 'array', 'null', 'plainObject', 'object'].includes(type)) return _typeof(value) === type;
  if (type === 'object') return value !== null && _typeof(value) === 'object';
  if (type === 'plainObject') return value !== null && _typeof(value) === 'object' && Object.prototype.toString.call(value) === '[object Object]' && typeof value.constructor === 'function' && value.constructor.name === 'Object';
  if (type === 'null') return value === null;
  if (type === 'date') return value instanceof Date;
  if (type === 'regexp') return value instanceof RegExp;
  if (type === 'array') return Array.isArray(value);
  return false;
}
/**
 * Checks if a value is a string.
 *
 * @param value the value to inspect as string.
 * @returns A bool indicating if is string.
 */

function isString(value) {
  return isType(value, 'string');
}
/**
 * Checks if a value is a number.
 *
 * @param value the value to inspect as number.
 * @returns A bool indicating if is number.
 */

function isNumber(value) {
  return isType(value, 'number');
}
/**
 * Checks if a value is a boolean.
 *
 * @param value the value to inspect as boolean.
 * @returns A bool indicating if is boolean.
 */

function isBoolean(value) {
  return isType(value, 'boolean');
}
/**
 * Checks if a value is an array.
 *
 * @param value the value to inspect as array.
 * @returns A bool indicating if is an array.
 */

function isArray(value) {
  return isType(value, 'array');
}
/**
 * Checks if a value is null.
 *
 * @param value the value to inspect as null.
 * @returns A bool indicating if is a null.
 */

function isNull(value) {
  return isType(value, 'null');
}
/**
 * Checks if a value is undefined.
 *
 * @param value the value to inspect as undefined.
 * @returns A bool indicating if is undefined.
 */

function isUndefined(value) {
  return isType(value, 'undefined');
}
/**
 * Checks if a value is a regular expression.
 *
 * @param value the value to inspect as regular expression.
 * @returns A bool indicating if is a regular expression.
 */

function isRegExp(value) {
  return isType(value, 'regexp');
}

/**
 * Cast value as string.
 *
 * @param value the value to cast as string.
 * @returns A string.
 */

function toString(value) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  if (isString(value)) return value;
  if (!isUndefined(value) && !isNull(value)) return value + '';
  return def;
}
/**
 * Cast value as boolean.
 *
 * @param value the value to cast as boolean.
 * @returns A boolean.
 */

function toBoolean(value) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (isBoolean(value)) return value;
  if (isString(value)) return /(true|yes|0)/.test(value) ? true : false;
  if (isNumber(value)) return value === 1 ? true : false;
  return def;
}
/**
 * Cast value as number.
 *
 * @param value the value to cast as number.
 * @returns A number.
 */

function toNumber(value) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (isNumber(value)) return value;
  if (isString(value)) value = parseFloat(value);
  if (!isNaN(value)) return value;
  return def;
}
/**
 * Cast value as an array of type.
 *
 * @param value the value to cast as an array.
 * @returns An array of type.
 */

function toArray(value) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (isUndefined(value)) return def;
  if (isArray(value)) return value;
  return [value];
}

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var appendFileSync = fsExtra.appendFileSync,
    ensureDirSync = fsExtra.ensureDirSync,
    existsSync = fsExtra.existsSync,
    readFileSync = fsExtra.readFileSync,
    readJSONSync = fsExtra.readJSONSync;
var PKG = readPkg();
var PACKAGE_NAME = 'optio';
var APP_NAME = PKG.name || PACKAGE_NAME; // Base Utils
/**
 * Checks if the current environment/terminal supports color.
 *
 * @returns A bool indicating whether terminal supports color.
 */

function hasColorSupport() {
  return !!supportsColor;
}
function readPkg(path) {
  path = path || join(process.cwd(), 'package.json');
  return readJSONSync(path, {
    "throws": false
  }) || {};
}
/**
 * Gets a history path for use with repl.
 *
 * @param appName the application's name.
 * @param rootDir the root directory where history is stored.
 * @returns A history path normalized with appName.
 */

function getHistoryPath(appName, rootDir) {
  rootDir = !rootDir ? join(homedir(), ".".concat(APP_NAME)) : rootDir;
  ensureDirSync(rootDir);
  return join(rootDir, (appName || 'default') + '.txt');
}
/**
 * Loads the REPL history file.
 *
 * @param path the path to the history file.
 * @param max the maximum lines for the history file.
 * @returns The repl history file.
 */

function loadHistory(path) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8').toString().split('\n').slice(0, -1).reverse().slice(0, max);
}
/**
 * Appends to history file.
 *
 * @param path the path to save the history to.
 * @param line the line to be appended.
 */

function appendHistory(path, line) {
  appendFileSync(path, line + '\n');
} // Helpers
/**
 * Converts a function to a promise.
 *
 * @param fn the function to be promisified.
 * @param options isMulti to return all params, isNode for node style callbacks, rejectErrors.
 * @returns A promisified function.
 */

function promisify(fn, options) {
  options = _objectSpread$4({
    isNode: false,
    isMulti: false,
    rejectErrors: false
  }, options);
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise( /*#__PURE__*/function () {
      var _promiseWrapper = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(res, rej) {
        var cb, result;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                cb = function _cb(errOrData) {
                  var _options, _options2, _options3, _options4, _options5;

                  if (errOrData && (_options = options) !== null && _options !== void 0 && _options.isNode || errOrData && errOrData instanceof Error && (_options2 = options) !== null && _options2 !== void 0 && _options2.rejectErrors) return rej(errOrData);

                  for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    params[_key2 - 1] = arguments[_key2];
                  }

                  if ((_options3 = options) !== null && _options3 !== void 0 && _options3.isNode) return res((_options4 = options) !== null && _options4 !== void 0 && _options4.isMulti ? params : params[0]);
                  res((_options5 = options) !== null && _options5 !== void 0 && _options5.isMulti ? [errOrData].concat(params) : errOrData);
                };

                args.push(cb);
                _context.next = 4;
                return fn.call.apply(fn, [this].concat(args));

              case 4:
                result = _context.sent;
                return _context.abrupt("return", res(result));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function promiseWrapper(_x, _x2) {
        return _promiseWrapper.apply(this, arguments);
      }

      return promiseWrapper;
    }());
  };
}
/**
 * Applies ansi styles to a string.
 *
 * @param str the string to be colorized.
 * @param styles the ansi styles to be applied.
 * @returns An ansi styled string.
 */

function colorize(str) {
  if (!supportsColor || !str) return str;

  for (var _len3 = arguments.length, styles = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    styles[_key3 - 1] = arguments[_key3];
  }

  return styles.reduce(function (a, c) {
    if (typeof ansiStyles[c] !== 'undefined') a = ansiStyles[c](a);
    return a;
  }, str);
}
/**
 * Ensures a value is returned, it's default or fallsback to null.
 *
 * @param value the value to inspect as defined.
 * @param def a default value when value is undefined.
 * @returns A defined value or null.
 */

function ensureValue(value) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  if (typeof value !== 'undefined') return value;
  return def;
}
/**
 * Merges two objects ensuring that target is not overwritten with undefined value preserving defaults.
 *
 * @param target the target object.
 * @param source the source object.
 * @returns An object merged ensuring defaults.
 */

function ensureDefaults(target, source) {
  var result = target;

  for (var k in source) {
    if (!source.hasOwnProperty(k)) continue;
    if (typeof source[k] !== 'undefined') result[k] = source[k];
  }

  return result;
}

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var TYPE_MAP = {
  string: toString,
  number: toNumber,
  "boolean": toBoolean
};
var VALIDATE_MAP = {
  string: isString,
  number: isNumber,
  "boolean": isBoolean
};
var inputPlugin = function inputPlugin(options) {
  return function (event, optio) {
    var opts = _objectSpread$3({
      dataType: 'string'
    }, options);

    return {
      transform: function transform(answer) {
        var result = event.isArray ? toArray(answer) : ensureValue(answer);
        if (event.isArray) return result.map(function (v) {
          return TYPE_MAP[opts.dataType](v);
        });
        return TYPE_MAP[opts.dataType](result);
      },
      validate: function validate(answer) {
        if (event.isRequired && isUndefined(answer) || answer === '') return "".concat(event.name, " is required");

        if (event.isArray) {
          if (!isArray(answer)) return "".concat(event.name, " requires array but got ").concat(_typeof(answer));
          var invalid = answer.reduce(function (a, c, i) {
            if (!VALIDATE_MAP[opts.dataType](c)) a.push("".concat(c, "(").concat(i, ")"));
            return a;
          }, []);
          if (invalid.length) return "".concat(event.name, " has invalid values: ").concat(invalid.join(', '));
        } else if (!VALIDATE_MAP[opts.dataType](answer)) {
          return "".concat(event.name, " expects type ").concat(opts.dataType, " but bot ").concat(_typeof(answer));
        }

        return true;
      },
      render: function render(err) {
        var _optio$formatPrompt = optio.formatPrompt(event.describe, event.defaultOption),
            formatted = _optio$formatPrompt.formatted;

        var formattedErr = err ? optio.formatError(err) : '';
        return new Promise(function (res) {
          var result = '';
          optio.input.on('keypress', function inputHandler(data, e) {
            if (e.name === 'backspace') {
              result = result.slice(0, -1);
            } else if (e.name === 'return') {
              optio.input.removeListener('keypress', inputHandler);
              res(result);
            } else {
              result += data;
            }
          });
          if (err) optio.output.write(formattedErr + '\n');
          optio.rl.setPrompt(formatted);
          optio.rl.prompt();
        });
      }
    };
  };
};

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var passwordPlugin = function passwordPlugin(options) {
  return function (event, optio) {
    var opts = _objectSpread$2({
      mask: '*',
      allowedChars: '*',
      minLength: 0
    }, options);

    return {
      transform: function transform(answer) {
        return toString(answer);
      },
      validate: function validate(answer) {
        if (!isString(answer)) return "".concat(event.name, " expected password but got ").concat(_typeof(answer));
        if (isRegExp(opts.allowedChars) && !opts.allowedChars.test(answer)) return "".concat(event.name, " contains invalid characters");
        if (isArray(opts.allowedChars) && !answer.split('').some(function (v) {
          return !opts.allowedChars.includes(v);
        })) // if chars ensure in list.
          return "".concat(event.name, " contains invalid characters");
        return true;
      },
      render: function render(err) {
        var _optio$formatPrompt = optio.formatPrompt(event.describe, event.defaultOption),
            formatted = _optio$formatPrompt.formatted;

        var formattedErr = err ? optio.formatError(err) : '';
        return new Promise(function (res) {
          var result = '';

          function inputHandler(data, e) {
            if (e.name === 'backspace') {
              result = result.slice(0, -1);
            } else if (e.name === 'return') {
              optio.input.removeListener('keypress', inputHandler);
              optio.unmute();
              optio.rl.write('\n'); // ensure new line.

              res(result);
            } else if (e.sequence.length === 1 && !e.ctrl) {
              optio.stdout.write(opts.mask);
              result += data;
            } else {
              optio.input.removeListener('keypress', inputHandler);
            }
          }

          if (err) optio.output.write(formattedErr + '\n');
          optio.input.on('keypress', inputHandler);
          optio.rl.setPrompt(formatted);
          optio.rl.prompt();
          optio.mute();
        });
      }
    };
  };
};

var commandPlugin = function commandPlugin(options) {
  return function (event, optio) {
    return {
      action: function action() {
        throw new Error("Command ".concat(event.name, " "));
      }
    };
  };
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var defaults = {
  when: function when() {
    return true;
  },
  transform: function transform(answer) {
    return answer;
  },
  validate: function validate() {
    return true;
  },
  render: function render() {
    throw new Error("Render NOT implemented.");
  },
  action: function action() {
    throw new Error("Action NOT implemented.");
  }
};
var initPlugin = function initPlugin(fn, optio) {
  return function (event) {
    var transform = event.transform,
        validate = event.validate,
        action = event.action,
        when = event.when;
    var plugin = ensureDefaults(defaults, fn(event, optio));
    var result = ensureDefaults(plugin, {
      transform: transform,
      validate: validate,
      action: action,
      when: when
    });
    result.config = event;
    return _objectSpread$1({}, result);
  };
};

var defaultPlugins = {
  string: inputPlugin({
    dataType: 'string'
  }),
  number: inputPlugin({
    dataType: 'number'
  }),
  "boolean": inputPlugin({
    dataType: 'boolean'
  }),
  password: passwordPlugin({
    mask: '*'
  }),
  command: commandPlugin()
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var DEFAULTS = {
  name: APP_NAME,
  terminal: true,
  input: process.stdin,
  output: process.stdout,
  color: hasColorSupport(),
  confirmExit: true,
  hints: true,
  defaultsColor: 'dim',
  prefixColor: 'green',
  errorColor: 'red',
  timeout: 0,
  plugins: defaultPlugins
};
/**
 * Normalizes options extends with defaults.
 *
 * @param options Optio options to be normalized.
 * @returns Normalized object/map of Optio options.
 */

function normalizeOptions(options) {
  var _options, _options2, _options3;

  var ms = new MuteStream();
  var input = ((_options = options) === null || _options === void 0 ? void 0 : _options.input) || process.stdin;
  var stdout = ((_options2 = options) === null || _options2 === void 0 ? void 0 : _options2.output) || process.stdout;
  ms.pipe(((_options3 = options) === null || _options3 === void 0 ? void 0 : _options3.output) || process.stdout);
  if (!input.isTTY) throw new Error("Optio cannot render prompts in non-TTY environments.");
  input.setRawMode(true);
  options = _objectSpread(_objectSpread({}, DEFAULTS), options);
  options.input = input;
  options.output = ms;
  options.stdout = stdout;
  options.defaultsColor = toArray(options.defaultsColor);
  options.prefixColor = toArray(options.prefixColor);
  options.errorColor = toArray(options.errorColor); // Cast here we'll fix plugins in constructor.

  return options;
}

var Optio = /*#__PURE__*/function () {
  function Optio(events, options) {
    _classCallCheck(this, Optio);

    _defineProperty(this, "events", {});

    _defineProperty(this, "answers", {});

    _defineProperty(this, "muted", false);

    _defineProperty(this, "mutedHistory", false);

    _defineProperty(this, "running", false);

    _defineProperty(this, "isREPL", false);

    options.completer = this.initCompleter(options);
    options.plugins = this.initPlugins(options.plugins);

    var _this$initEvents = this.initEvents(events, options.plugins),
        initEvents = _this$initEvents.events,
        keyMap = _this$initEvents.keyMap,
        indexes = _this$initEvents.indexes;

    this.events = initEvents;
    this.keyMap = keyMap;
    this.indexes = indexes;
    this.options = options;
    this.input = options.input;
    this.stdout = options.stdout;
    this.output = options.output;
    this.rl = readline.createInterface(options);
    this.unsubscribeListeners = this.bindListeners();
    this.initHistory();
    this.rl.resume();
  }
  /**
   * Binds event listeners to process and Readline interface.
   *
   * @returns A method for unsubscribing bound listeners.
   */


  _createClass(Optio, [{
    key: "bindListeners",
    value: function bindListeners() {
      var _this = this;

      process.on('exit', this.kill.bind(this));
      this.rl.on('SIGINT', this.kill.bind(this));
      this.rl.on('line', this.onLine.bind(this));
      return function () {
        process.removeListener('exit', _this.kill.bind(_this));

        _this.rl.removeListener('SIGINT', _this.kill.bind(_this));

        _this.rl.removeListener('line', _this.onLine.bind(_this));
      };
    }
    /**
     * Binds history for REPL.
     */

  }, {
    key: "initHistory",
    value: function initHistory() {
      var _this2 = this;

      var path = getHistoryPath(this.options.name);
      var history = loadHistory(path, this.options.historySize);
      var addHistory = this.rl._addHistory;

      this.rl._addHistory = function () {
        var last = _this2.rl.history[0];
        var line = addHistory.call(_this2.rl);
        if (line.length > 0 && line !== last && !_this2.mutedHistory) appendHistory(path, line);
        return line;
      };

      if (history.length) this.rl.history.push.apply(this.rl.history, history);
    }
    /**
     * Builds string array of command name hints.
     *
     * @returns An array of command names.
     */

  }, {
    key: "loadHints",
    value: function loadHints() {
      var _this3 = this;

      return Object.keys(this.events).reduce(function (a, c) {
        var _event$config;

        var event = _this3.events[c];
        if (!((_event$config = event.config) !== null && _event$config !== void 0 && _event$config.isCommand)) return a;
        return [].concat(_toConsumableArray(a), [c]);
      }, []);
    }
    /**
     * Creates and binds the default completer.
     *
     * @returns A completer function for matching commands.
     */

  }, {
    key: "initCompleter",
    value: function initCompleter(options) {
      // Completer already configured.
      if (!!options.completer) return options.completer; // Get hints.

      var hints = !options.hints ? [] : options.hints === true ? this.loadHints() : options.hints; // Default completer.

      return function (line) {
        var hits = hints.filter(function (v) {
          return v.startsWith(line);
        });
        return [hits.length ? hits : hints, line];
      };
    }
    /**
     * Initializes plugins and returns.
     *
     * @param plugins type plugins to be initialized.
     * @returns A map of initialized plugins.
     */

  }, {
    key: "initPlugins",
    value: function initPlugins(plugins) {
      // Cast as any just initting applying context
      // and defaults. The resulting handler will have
      // the same signature. Clean this up later.
      for (var k in plugins) {
        plugins[k] = initPlugin(plugins[k], this);
      }

      return plugins;
    }
    /**
     * Normalizes the map of events.
     *
     * @param events the map of events.
     * @param plugins initialized plugins for initializing events.
     * @returns The normalized events.
     */

  }, {
    key: "initEvents",
    value: function initEvents(events, plugins) {
      var indexes = [];
      var keyMap = {};
      var _events = {};

      var _loop = function _loop(k) {
        var event = events[k];
        indexes.push(k);
        event.name = k;
        event.alias = toArray(event.alias);
        event.alias.unshift(k);
        event.describe = event.describe || k; // Default to require unless defined or a when event is defined.

        if (isUndefined(event.isRequired) && !event.when) event.isRequired = true; // Iterate alias keys and build reverse keymap
        // for looking up events by alias.

        event.alias.forEach(function (key) {
          if (keyMap[key]) throw new Error("Duplicate Event key ".concat(key, " for ").concat(k, " detected."));
          keyMap[key] = k;
        });
        if (typeof event.action === 'function') event.isCommand = true;
        if (event.action && !event.isCommand) throw new Error("Event ".concat(k, " has \"action\" but is NOT a command."));
        _events[k] = plugins[event.type](event);
      };

      for (var k in events) {
        _loop(k);
      }

      return {
        indexes: indexes,
        keyMap: keyMap,
        events: _events
      };
    }
    /**
     * Readline on line listener, listens for line input.
     *
     * @param line the current line.
     * @returns A promise of void.
     */

  }, {
    key: "onLine",
    value: function () {
      var _onLine = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(line) {
        var args, name, event;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.muted || !this.isREPL)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                line = line.trim();
                args = split(line, {
                  separator: ' ',
                  quotes: ['"', "'"]
                });
                name = args.shift();
                event = this.getEventByName(name); // If no event or not a command type event just prompt.

                if (!(!event || !event.config.isCommand)) {
                  _context.next = 9;
                  break;
                }

                console.log("command not found: ".concat(name));
                return _context.abrupt("return", this.rl.prompt());

              case 9:
                _context.next = 11;
                return this.runCommand(event, args);

              case 11:
                // Reprompt.
                this.rl.prompt();

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onLine(_x) {
        return _onLine.apply(this, arguments);
      }

      return onLine;
    }()
    /**
     * Returns Readline built-in module.
     */

  }, {
    key: "readline",
    get: function get() {
      return readline;
    }
    /**
     * Figure characters for use with prompts.
     */

  }, {
    key: "figures",
    get: function get() {
      return figures;
    }
  }, {
    key: "plugins",
    get: function get() {
      return this.options.plugins;
    }
    /**
     * Creates a new Optio module.
     *
     * @param events the events for the instance.
     * @param options options for the ReadLine interface
     * @returns A new instance of Optio.
     */

  }, {
    key: "createModule",
    value: function createModule(events, options) {
      var optio = new Optio(events, normalizeOptions(_objectSpread(_objectSpread({}, this.options), options)));
      return optio;
    }
    /**
     * Finds an Event by it's key name or an alias.
     *
     * @param name the key used to lookup an event.
     * @returns A found event looked up by its key or alias.
     */

  }, {
    key: "getEventByName",
    value: function getEventByName(name) {
      if (!name) return undefined;
      var eventKey = this.keyMap[name];
      return this.events[eventKey];
    }
  }, {
    key: "getEventIndex",
    value: function getEventIndex(nameOrEvent) {
      var _event$config2;

      var key = typeof nameOrEvent === 'string' ? this.keyMap[nameOrEvent] : nameOrEvent.config.name;
      var event = this.events[key]; // Commands aren't indexed.

      if (!event || (_event$config2 = event.config) !== null && _event$config2 !== void 0 && _event$config2.isCommand) return undefined;
      return this.indexes.indexOf(key);
    }
  }, {
    key: "getNextEvent",
    value: function getNextEvent(nameOrEvent) {
      var _this$active, _this$active$config, _nameOrEvent;

      nameOrEvent = nameOrEvent || ((_this$active = this.active) === null || _this$active === void 0 ? void 0 : (_this$active$config = _this$active.config) === null || _this$active$config === void 0 ? void 0 : _this$active$config.name);
      if (!nameOrEvent) return this.events[this.indexes[0]];
      var key = typeof nameOrEvent === 'string' ? this.keyMap[nameOrEvent] : (_nameOrEvent = nameOrEvent) === null || _nameOrEvent === void 0 ? void 0 : _nameOrEvent.config.name;
      var idx = this.getEventIndex(key);
      if (!~idx) return undefined;
      var nextName = this.indexes[idx + 1];
      return this.events[nextName];
    }
    /**
     * Gets an event offset from the specified or current event.
     *
     * @param current the current/active event to offset from.
     * @param offset the numeric position to offset with.
     */

  }, {
    key: "offsetEvent",
    value: function offsetEvent() {
      var _current$config;

      var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.active;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      // No current event get the first.
      if (typeof current === 'undefined') return this.events[this.indexes[0]];
      var currentIdx = this.indexes.indexOf((_current$config = current.config) === null || _current$config === void 0 ? void 0 : _current$config.name);
      if (!~currentIdx) return undefined;
      var nextIdx = currentIdx + offset;
      if (!this.indexes[nextIdx]) return undefined;
      return this.events[this.indexes[nextIdx]];
    }
    /**
     * Moves the cursor to a specific set of coordinates.
     *
     * @param x the x coordinate to set cursor to.
     * @param y the y coordinate to set cursor to.
     * @param cb an optional callback on completion.
     * @returns A bool indicating if successful.
     */

  }, {
    key: "cursorTo",
    value: function cursorTo(x, y, cb) {
      return readline.cursorTo(this.stdout, x, y, cb);
    }
    /**
     * Moves the cursor relative to the current position.
     *
     * @param dx the x coordinate.
     * @param dy the y coordinate.
     * @param cb optional callback on done.
     * @returns A bool indicating if successful.
     */

  }, {
    key: "cursorMove",
    value: function cursorMove(dx, dy, cb) {
      return readline.moveCursor(this.stdout, dx, dy, cb);
    }
    /**
     * Clears the screen down from the current position.
     *
     * @returns A bool indicating if the clear screen down was successful.
     */

  }, {
    key: "clearDown",
    value: function clearDown() {
      return readline.clearScreenDown(this.stdout);
    }
    /**
     * Clears the line by direction.
     *
     * @param direction the direction to clear before, all, after.
     * @param onClear an optional callback on cleared.
     * @returns A bool indicating if the line was cleared.
     */

  }, {
    key: "clearLine",
    value: function clearLine() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var onClear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      return readline.clearLine(this.stdout, direction, function () {
        return onClear;
      });
    }
    /**
     * Mutes the output stream.
     *
     * @returns The Optio context.
     */

  }, {
    key: "mute",
    value: function mute() {
      this.output.mute();
      this.muted = true;
      return this;
    }
    /**
     * Unmutes the output stream.
     *
     * @returns The Optio context.
     */

  }, {
    key: "unmute",
    value: function unmute() {
      this.output.unmute();
      this.muted = false;
      return this;
    }
    /**
     * Mutes the output stream.
     *
     * @returns The Optio context.
     */

  }, {
    key: "muteHistory",
    value: function muteHistory() {
      this.mutedHistory = true;
      return this;
    }
    /**
     * Unmutes the output stream.
     *
     * @returns The Optio context.
     */

  }, {
    key: "unmuteHistory",
    value: function unmuteHistory() {
      this.mutedHistory = false;
      return this;
    }
    /**
     * Enables REPL mode.
     *
     * @returns The current instance.
     */

  }, {
    key: "repl",
    value: function repl() {
      this.isREPL = true;
      return this;
    }
    /**
     * Disable REPL mode restoring to Query mode.
     *
     * @returns The current instance.
     */

  }, {
    key: "unrepl",
    value: function unrepl() {
      this.isREPL = false;
      return this;
    }
    /**
     * Formats a prompt to be displayed.
     *
     * @param message the prompt message to be displayed.
     * @param defaults any defaults that should be shown.
     * @param prefix any prefix indicating type that should be shown.
     * @returns Object containing formatted prompt params and args.
     */

  }, {
    key: "formatPrompt",
    value: function formatPrompt(message, defaults) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '?';
      message = message || '';
      var color = this.options.color;
      var formatted = message; // A template when prompt has been answered.

      var answered = message;

      if (prefix) {
        color ? formatted = colorize.apply(void 0, [prefix].concat(_toConsumableArray(this.options.prefixColor))) + ' ' + formatted : formatted = prefix + ' ' + formatted;
        answered = formatted;
      }

      if (defaults) color ? formatted = formatted + ' ' + colorize.apply(void 0, [defaults + ''].concat(_toConsumableArray(this.options.defaultsColor))) : formatted = formatted + ' ' + defaults;
      formatted = formatted + ' ';
      return {
        prefix: prefix,
        message: message,
        defaults: defaults,
        formatted: formatted,
        answered: answered
      };
    }
    /**
     * Formats an error message for display.
     *
     * @param err the error message to be displayed.
     * @param prefix the optional prefix typically a pointer.
     * @returns A styled error message.
     */

  }, {
    key: "formatError",
    value: function formatError(err) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : figures.pointer;
      if (prefix) err = prefix + ' ' + err;
      return colorize.apply(void 0, [err].concat(_toConsumableArray(this.options.errorColor)));
    }
    /**
     * Writes an answer to the output stream after rendered and validated.
     *
     * @param message the message to be written.
     * @param answer the answer that was given.
     */

  }, {
    key: "writeAnswered",
    value: function writeAnswered(message, answer) {
      this.clearLine(0);
      this.output.write(message + ' ' + answer + '\n');
    }
    /**
     * Parse an event.action response.
     *
     * @param response the Action result response.
     * @returns The next event and argumnts if any.
     */

  }, {
    key: "parseAction",
    value: function parseAction(response) {
      var result = {
        next: undefined,
        args: []
      };
      if (!response) return result;

      if (typeof response === 'string' || Array.isArray(response)) {
        var nextName = typeof response === 'string' ? response : response[0];
        var nextEvent = this.getEventByName(nextName);
        var nextArgs = Array.isArray(response) ? response.slice(1) : [];
        result.next = nextEvent;
        result.args = nextArgs;
      }

      return result;
    }
    /**
     * Promisifies readline's built-in "question" prompt.
     *
     * @param question the question to be prompted.
     * @returns A promise resolving the provided answer.
     */

  }, {
    key: "runQuestion",
    value: function runQuestion(question) {
      var _this4 = this;

      return new Promise(function (res) {
        _this4.rl.question(question, function (answer) {
          res(answer);
        });
      });
    }
    /**
     * Runs a command
     *
     * @param event the command event to run.
     * @param params arguments to be passed to the command.
     * @returns An action result for next command or undefined.
     */

  }, {
    key: "runCommand",
    value: function () {
      var _runCommand = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(event) {
        var params,
            response,
            _this$parseAction,
            next,
            args,
            _args2 = arguments;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : [];

                if (event) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 3:
                // Ensure flat args array.
                params = params.flat(Infinity);
                _context2.next = 6;
                return promisify(event.action)(params, this);

              case 6:
                response = _context2.sent;
                _this$parseAction = this.parseAction(response), next = _this$parseAction.next, args = _this$parseAction.args;
                return _context2.abrupt("return", this.runCommand(next, args));

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function runCommand(_x2) {
        return _runCommand.apply(this, arguments);
      }

      return runCommand;
    }()
    /**
     * Runs a prompt renders, validates and displays.
     *
     * @param event the event to be run
     * @param err error that should be passed when reprompting.
     * @returns A promise containing the next event if any.
     */

  }, {
    key: "runPrompt",
    value: function () {
      var _runPrompt = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(event, err) {
        var shouldDisplay, result, transformed, isValid, _err;

        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (event) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", this.stop());

              case 2:
                this.active = event; // Check if should display.

                _context3.next = 5;
                return promisify(event.when)(this.answers);

              case 5:
                shouldDisplay = _context3.sent;

                if (shouldDisplay) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", this.runPrompt(this.getNextEvent(event)));

              case 8:
                _context3.next = 10;
                return promisify(event.render)(err);

              case 10:
                result = _context3.sent;
                _context3.next = 13;
                return promisify(event.transform)(result);

              case 13:
                transformed = _context3.sent;
                _context3.next = 16;
                return promisify(event.validate)(transformed);

              case 16:
                isValid = _context3.sent;

                if (!(isValid === false || typeof isValid === 'string')) {
                  _context3.next = 20;
                  break;
                }

                _err = isString(isValid) ? isValid : "Event ".concat(event.config.name, " is invalid.");
                return _context3.abrupt("return", this.runPrompt(event, _err));

              case 20:
                // Everything is successful update answers with the transformed result.
                this.answers[event.config.name] = transformed; // Get the next event and prompt!
                // if no event stop will be called.

                return _context3.abrupt("return", this.runPrompt(this.getNextEvent(event)));

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function runPrompt(_x3, _x4) {
        return _runPrompt.apply(this, arguments);
      }

      return runPrompt;
    }()
  }, {
    key: "start",
    value: function start(promptOrPreserveOrHandler, preserveCursor) {
      var handler;

      if (typeof promptOrPreserveOrHandler === 'boolean') {
        preserveCursor = promptOrPreserveOrHandler;
        promptOrPreserveOrHandler = undefined;
      } else if (typeof promptOrPreserveOrHandler === 'function') {
        preserveCursor = undefined;
        handler = promptOrPreserveOrHandler;
        promptOrPreserveOrHandler = undefined;
      } else if (typeof promptOrPreserveOrHandler === 'undefined') {
        handler = function handler() {}; // just so we know its prompt mode.

      }

      if (handler) {
        this.onDone = handler;
        return this.runPrompt(this.getNextEvent());
      }

      var currentPrompt = this.rl.getPrompt();
      var prompt = typeof promptOrPreserveOrHandler === 'string' ? promptOrPreserveOrHandler : this.options.prompt;
      prompt = prompt || currentPrompt;
      if (prompt === '> ') prompt = APP_NAME + '> ';
      this.repl();
      this.rl.setPrompt(prompt);
      this.rl.prompt(preserveCursor);
    }
    /**
     * Stops the application and returns the results.
     *
     * @returns The current prompt answers.
     */

  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
      this.active = undefined;
      this.unsubscribeListeners();
      this.output.end();
      this.rl.pause();
      this.rl.close();
      if (this.onDone) this.onDone(this.answers);
      return Promise.resolve(this.answers);
    }
  }, {
    key: "flush",
    value: function flush() {
      var _this5 = this;

      return new Promise(function (res) {
        _this5.clearLine(1, function () {
          return res(null);
        });
      });
    }
    /**
     * Confirms with the user if should exit or not.
     *
     * @returns A promise indicating whether to exit or not.
     */

  }, {
    key: "confirmExit",
    value: function () {
      var _confirmExit = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        var isMuted, prompt, answer;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.muteHistory(); // no need to store this result.

                isMuted = this.muted;
                this.unmute();
                prompt = this.formatPrompt("Are you sure you want to exit?", 'y/N');
                _context4.next = 6;
                return this.runQuestion(prompt.formatted);

              case 6:
                answer = _context4.sent;
                this.unmuteHistory();

                if (!answer.toLowerCase().startsWith('y')) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return", true);

              case 10:
                if (isMuted) // reset mute back to previous state.
                  this.mute();
                return _context4.abrupt("return", false);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function confirmExit() {
        return _confirmExit.apply(this, arguments);
      }

      return confirmExit;
    }()
    /**
     * Handler to kill event listeners such as "exit" or "SIGINT".
     *
     * @param shouldPrompt bool indicating if should prompt before exiting.
     */

  }, {
    key: "kill",
    value: function () {
      var _kill = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        var shouldPrompt,
            shouldExit,
            _args5 = arguments;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                shouldPrompt = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : this.options.confirmExit;

                if (!shouldPrompt) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 4;
                return this.confirmExit();

              case 4:
                shouldExit = _context5.sent;

                if (shouldExit) {
                  _context5.next = 8;
                  break;
                }

                this.rl.prompt();
                return _context5.abrupt("return");

              case 8:
                this.rl.pause();
                this.rl.close();
                process.kill(process.pid, 'SIGINT');
                console.log('');

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function kill() {
        return _kill.apply(this, arguments);
      }

      return kill;
    }()
  }]);

  return Optio;
}();
function createOptio(events, options) {
  var normalizedOptions = normalizeOptions(options);
  var normalizedEvents = events; // Allows for setting value of config as simple

  for (var k in normalizedEvents) {
    if (typeof normalizedEvents[k] === 'string') {
      var val = normalizedEvents[k];
      normalizedEvents[k] = {
        type: val
      };
    }
  }

  return new Optio(normalizedEvents, normalizedOptions);
}
var optioApi = {
  defaultCommands: defaultCommands,
  defaultPlugins: defaultPlugins,
  create: createOptio
};

//   'What is your name:': 'string',
//   'What is your age:': {
//     type: 'number',
//     isArray: true,
//     when: (answers) => {
//       return answers['What is your name:'] !== 'bob';
//     }
//   }
// });

var optio = optioApi.create({
  'Please enter your username:': 'string',
  'Please enter your password:': 'password'
});
optio.start(function (answers) {
  console.log(answers);
});
