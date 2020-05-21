(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var path = {};

	var aFunction = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof NativeConstructor) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return NativeConstructor.apply(this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

	  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

	    // bind timers to global for call from export context
	    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
	    // wrap global constructors for prevent changs in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && typeof sourceProperty == 'function') resultProperty = functionBindContext(Function.call, sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    target[key] = resultProperty;

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!has(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
	      // export real prototype methods
	      if (options.real && targetPrototype && !targetPrototype[key]) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.4',
	  mode:  'pure' ,
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var aFunction$1 = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var entryVirtual = function (CONSTRUCTOR) {
	  return path[CONSTRUCTOR + 'Prototype'];
	};

	var concat = entryVirtual('Array').concat;

	var ArrayPrototype = Array.prototype;

	var concat_1 = function (it) {
	  var own = it.concat;
	  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.concat) ? concat : own;
	};

	var concat$1 = concat_1;

	var concat$2 = concat$1;

	// `Array.isArray` method
	// https://tc39.github.io/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var isArray$1 = path.Array.isArray;

	var isArray$2 = isArray$1;

	var isArray$3 = isArray$2;

	function _arrayWithHoles(arr) {
	  if (isArray$3(arr)) return arr;
	}

	var iterators = {};

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	var defineProperty = objectDefineProperty.f;





	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
	  if (it) {
	    var target = STATIC ? it : it.prototype;
	    if (!has(target, TO_STRING_TAG$2)) {
	      defineProperty(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
	    }
	    if (SET_METHOD && !toStringTagSupport) {
	      createNonEnumerableProperty(target, 'toString', objectToString);
	    }
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
	  iterators[TO_STRING_TAG] = returnThis;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var redefine = function (target, key, value, options) {
	  if (options && options.enumerable) target[key] = value;
	  else createNonEnumerableProperty(target, key, value);
	};

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$1 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
	      iterators[TO_STRING_TAG] = returnThis$1;
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if (( FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG$3) {
	    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
	  }
	  iterators[COLLECTION_NAME] = iterators.Array;
	}

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$1(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$1(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var ITERATOR$2 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$2]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	var getIterator = function (it) {
	  var iteratorMethod = getIteratorMethod(it);
	  if (typeof iteratorMethod != 'function') {
	    throw TypeError(String(it) + ' is not iterable');
	  } return anObject(iteratorMethod.call(it));
	};

	var getIterator_1 = getIterator;

	var getIterator$1 = getIterator_1;

	var ITERATOR$3 = wellKnownSymbol('iterator');

	var isIterable = function (it) {
	  var O = Object(it);
	  return O[ITERATOR$3] !== undefined
	    || '@@iterator' in O
	    // eslint-disable-next-line no-prototype-builtins
	    || iterators.hasOwnProperty(classof(O));
	};

	var isIterable_1 = isIterable;

	var isIterable$1 = isIterable_1;

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$4 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$4
	};

	var f$5 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$5
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty$1 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$2 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$2(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$2(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$2(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$2(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$2(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$2(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$2(6)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState$2 = internalState.set;
	var getInternalState$2 = internalState.getterFor(SYMBOL);
	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
	    nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState$2(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState$2(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$2(this).description;
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol('asyncIterator');

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol('hasInstance');

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol('isConcatSpreadable');

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	// `Symbol.match` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.match
	defineWellKnownSymbol('match');

	// `Symbol.matchAll` well-known symbol
	defineWellKnownSymbol('matchAll');

	// `Symbol.replace` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.replace
	defineWellKnownSymbol('replace');

	// `Symbol.search` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.search
	defineWellKnownSymbol('search');

	// `Symbol.species` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.species
	defineWellKnownSymbol('species');

	// `Symbol.split` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.split
	defineWellKnownSymbol('split');

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol('toPrimitive');

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol('toStringTag');

	// `Symbol.unscopables` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	// Math[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
	setToStringTag(Math, 'Math', true);

	// JSON[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
	setToStringTag(global_1.JSON, 'JSON', true);

	var symbol = path.Symbol;

	// `Symbol.asyncDispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	defineWellKnownSymbol('asyncDispose');

	// `Symbol.dispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	defineWellKnownSymbol('dispose');

	// `Symbol.observable` well-known symbol
	// https://github.com/tc39/proposal-observable
	defineWellKnownSymbol('observable');

	// `Symbol.patternMatch` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('patternMatch');

	// TODO: remove from `core-js@4`


	defineWellKnownSymbol('replaceAll');

	// TODO: Remove from `core-js@4`


	var symbol$1 = symbol;

	var symbol$2 = symbol$1;

	function _iterableToArrayLimit(arr, i) {
	  if (typeof symbol$2 === "undefined" || !isIterable$1(Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = getIterator$1(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var ITERATOR$4 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$4] === it);
	};

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$5] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$5] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var from_1 = path.Array.from;

	var from_1$1 = from_1;

	var from_1$2 = from_1$1;

	var defineProperty$2 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$2(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var slice = entryVirtual('Array').slice;

	var ArrayPrototype$2 = Array.prototype;

	var slice_1 = function (it) {
	  var own = it.slice;
	  return it === ArrayPrototype$2 || (it instanceof Array && own === ArrayPrototype$2.slice) ? slice : own;
	};

	var slice$1 = slice_1;

	var slice$2 = slice$1;

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  var _context;

	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);

	  var n = slice$2(_context = Object.prototype.toString.call(o)).call(_context, 8, -1);

	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return from_1$2(n);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	var slice$3 = slice_1;

	var slice$4 = slice$3;

	var slice$5 = [].slice;
	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

	var wrap$1 = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice$5.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap$1(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap$1(global_1.setInterval)
	});

	var setTimeout = path.setTimeout;

	var setTimeout$1 = setTimeout;

	var nativeAssign = Object.assign;
	var defineProperty$3 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$3({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$3(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var assign = path.Object.assign;

	var assign$1 = assign;

	var assign$2 = assign$1;

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var keys$1 = path.Object.keys;

	var keys$2 = keys$1;

	var keys$3 = keys$2;

	var slice$6 = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction(this);
	  var partArgs = slice$6.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice$6.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	// `Function.prototype.bind` method
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true }, {
	  bind: functionBind
	});

	var bind = entryVirtual('Function').bind;

	var FunctionPrototype = Function.prototype;

	var bind_1 = function (it) {
	  var own = it.bind;
	  return it === FunctionPrototype || (it instanceof Function && own === FunctionPrototype.bind) ? bind : own;
	};

	var bind$1 = bind_1;

	var bind$2 = bind$1;

	var nativeReverse = [].reverse;
	var test$1 = [1, 2];

	// `Array.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794
	_export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign
	    if (isArray(this)) this.length = this.length;
	    return nativeReverse.call(this);
	  }
	});

	var reverse = entryVirtual('Array').reverse;

	var ArrayPrototype$3 = Array.prototype;

	var reverse_1 = function (it) {
	  var own = it.reverse;
	  return it === ArrayPrototype$3 || (it instanceof Array && own === ArrayPrototype$3.reverse) ? reverse : own;
	};

	var reverse$1 = reverse_1;

	var reverse$2 = reverse$1;

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH$1 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var indexOf$1 = entryVirtual('Array').indexOf;

	var ArrayPrototype$4 = Array.prototype;

	var indexOf_1 = function (it) {
	  var own = it.indexOf;
	  return it === ArrayPrototype$4 || (it instanceof Array && own === ArrayPrototype$4.indexOf) ? indexOf$1 : own;
	};

	var indexOf$2 = indexOf_1;

	var indexOf$3 = indexOf$2;

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var filter = entryVirtual('Array').filter;

	var ArrayPrototype$5 = Array.prototype;

	var filter_1 = function (it) {
	  var own = it.filter;
	  return it === ArrayPrototype$5 || (it instanceof Array && own === ArrayPrototype$5.filter) ? filter : own;
	};

	var filter$1 = filter_1;

	var filter$2 = filter$1;

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD$1 || !USES_TO_LENGTH$3) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var forEach = entryVirtual('Array').forEach;

	var forEach$1 = forEach;

	var ArrayPrototype$6 = Array.prototype;

	var DOMIterables = {
	  DOMTokenList: true,
	  NodeList: true
	};

	var forEach_1 = function (it) {
	  var own = it.forEach;
	  return it === ArrayPrototype$6 || (it instanceof Array && own === ArrayPrototype$6.forEach)
	    // eslint-disable-next-line no-prototype-builtins
	    || DOMIterables.hasOwnProperty(classof(it)) ? forEach$1 : own;
	};

	var forEach$2 = forEach_1;

	var isArray$4 = isArray$1;

	var isArray$5 = isArray$4;

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var map = entryVirtual('Array').map;

	var ArrayPrototype$7 = Array.prototype;

	var map_1 = function (it) {
	  var own = it.map;
	  return it === ArrayPrototype$7 || (it instanceof Array && own === ArrayPrototype$7.map) ? map : own;
	};

	var map$1 = map_1;

	var map$2 = map$1;

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	_export({ target: 'Object', stat: true }, {
	  setPrototypeOf: objectSetPrototypeOf
	});

	var setPrototypeOf = path.Object.setPrototypeOf;

	var setPrototypeOf$1 = setPrototypeOf;

	var setPrototypeOf$2 = setPrototypeOf$1;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
	  defineProperty: objectDefineProperty.f
	});

	var defineProperty_1 = createCommonjsModule(function (module) {
	var Object = path.Object;

	var defineProperty = module.exports = function defineProperty(it, key, desc) {
	  return Object.defineProperty(it, key, desc);
	};

	if (Object.defineProperty.sham) defineProperty.sham = true;
	});

	var defineProperty$4 = defineProperty_1;

	var defineProperty$5 = defineProperty$4;

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    defineProperty$5(obj, key, {
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

	// `Date.now` method
	// https://tc39.github.io/ecma262/#sec-date.now
	_export({ target: 'Date', stat: true }, {
	  now: function now() {
	    return new Date().getTime();
	  }
	});

	var now = path.Date.now;

	var now$1 = now;

	var now$2 = now$1;

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$5 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var includes = entryVirtual('Array').includes;

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var includes$1 = entryVirtual('String').includes;

	var ArrayPrototype$8 = Array.prototype;
	var StringPrototype = String.prototype;

	var includes$2 = function (it) {
	  var own = it.includes;
	  if (it === ArrayPrototype$8 || (it instanceof Array && own === ArrayPrototype$8.includes)) return includes;
	  if (typeof it === 'string' || it === StringPrototype || (it instanceof String && own === StringPrototype.includes)) {
	    return includes$1;
	  } return own;
	};

	var includes$3 = includes$2;

	var includes$4 = includes$3;

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

	    defineProperty$5(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	/*
	      Live Input

	      * no dependencies

	      after initialiation, append .el
	      ex. document.body.append(new LiveField({
	        type: 'number',
	        model: model,
	        attribute: 'ship_count'
	      }).el)
	  
	  
	      Required
	      ---
	      model: Object           any model that takes get/set. Meant for Viking.Model, and initiates save
	      attribute: ''           attribute to use for get/set

	      Options
	      ---
	      type: 'text'           accepts all html input types + select and textarea
	      load: ƒ(value, model)   method to coerce value from input to model
	      dump: ƒ(value, model)   method to coerce value from model to input
	      [any html attribute]   ex. step: '10' for type="number"
	*/
	var LiveInput = /*#__PURE__*/function () {
	  function LiveInput(options) {
	    var _this = this,
	        _context,
	        _context3;

	    _classCallCheck(this, LiveInput);

	    var option_keys = ['save', 'type', 'model', 'attribute', 'load', 'dump'];

	    forEach$2(option_keys).call(option_keys, function (key) {
	      if (options[key]) {
	        _this[key] = options[key];
	      }
	    });

	    this.type = this.type || 'text';

	    if (includes$4(_context = ['select', 'textarea', 'button']).call(_context, this.type)) {
	      this.el = document.createElement(this.type);
	    } else {
	      this.el = document.createElement('input');
	      this.el.setAttribute('type', this.type);
	    }

	    var value = options.value || this.dump(this.model.get(this.attribute), this.model) || '';
	    this.el.value = value; // Set distinct id for targeting with <label>

	    window.idCounter || (window.idCounter = 0);
	    this.el.setAttribute('id', "live-input-".concat(window.idCounter++)); // Render Options for Select Input

	    if (this.type == 'select' && options.options) {
	      var _context2;

	      forEach$2(_context2 = options.options).call(_context2, function (option) {
	        if (option instanceof Element) {
	          return _this.el.append(option);
	        }

	        var html_option = document.createElement('option');

	        if (isArray$5(option)) {
	          html_option.setAttribute('value', option[0]);
	          html_option.innerHTML = option[1];
	          html_option.selected = option[2] === undefined ? option[0] == value : option[2];
	        } else {
	          html_option.setAttribute('value', option);
	          html_option.innerHTML = option;
	          html_option.selected = option == value;
	        }

	        _this.el.append(html_option);
	      });
	    } // Assign all attributes passed to element
	    // TODO whitelist attributes with common list of html attributes


	    forEach$2(_context3 = keys$3(options)).call(_context3, function (key) {
	      var _context4;

	      if (key == "options") return; // options used for select already used

	      if (key == "value") return; // already dealt with

	      if (includes$4(option_keys).call(option_keys, key) && _this.type != 'button' && key != 'type') return;

	      if (!includes$4(_context4 = LiveInput.booleanAttributes).call(_context4, key) || options[key] === true) {
	        _this.el.setAttribute(key, options[key]);
	      }
	    }); // Setup Listeners


	    if (this.type == "button") {
	      var _context5;

	      this.el.addEventListener('click', bind$2(_context5 = this.input_change).call(_context5, this));
	    } else {
	      var _context6;

	      this.el.addEventListener('change', bind$2(_context6 = this.input_change).call(_context6, this));
	    }

	    if (this.model.on) {
	      var _context7, _context8;

	      this.model.on('change:' + this.attribute, bind$2(_context7 = this.model_change).call(_context7, this));
	      this.model.on('invalid', bind$2(_context8 = this.invalid).call(_context8, this));
	    } // TODO handle errors

	  }

	  _createClass(LiveInput, [{
	    key: "remove",
	    value: function remove() {
	      var _context10, _context11;

	      if (this.model.off) {
	        var _context9;

	        this.model.off('change:' + this.attribute, bind$2(_context9 = this.model_change).call(_context9, this));
	        this.model.off('invalid', this.invalid);
	      }

	      this.el.removeEventListener('click', bind$2(_context10 = this.input_change).call(_context10, this));
	      this.el.removeEventListener('change', bind$2(_context11 = this.input_change).call(_context11, this));
	      if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
	      delete this.el;
	    }
	  }, {
	    key: "input_change",
	    value: function input_change(e) {
	      var value = this.load(e.target.value, this.model);
	      this.model.set(this.attribute, value);
	    }
	  }, {
	    key: "model_change",
	    value: function model_change(e) {
	      var _context12;

	      var value = this.dump(this.model.get(this.attribute), this.model);

	      if (includes$4(_context12 = ['checkbox', 'radio', 'button']).call(_context12, this.type)) {
	        var attribute = this.type == "button" ? 'selected' : 'checked';

	        if (isArray$5(value) && includes$4(value).call(value, this.el.value) || value == this.el.value) {
	          this.el.setAttribute(attribute, true);
	        } else {
	          this.el.removeAttribute(attribute);
	        }
	      } else {
	        this.el.value = value;
	      }

	      if (this.error_container) {
	        this.error_container.insertAdjacentElement('beforebegin', this.el);
	        this.error_container.parentNode.removeChild(this.error_container);
	        delete this.error_container;
	      }
	    }
	  }, {
	    key: "load",
	    value: function load(v, model) {
	      return v;
	    }
	  }, {
	    key: "dump",
	    value: function dump(v, model) {
	      if (v && this.type == "date") {
	        return v.toISODateString();
	      }

	      return v;
	    }
	  }, {
	    key: "invalid",
	    value: function invalid(model, errors, xhr) {
	      var _context13;

	      if (includes$4(_context13 = keys$3(errors)).call(_context13, this.attribute)) {
	        this.error_container = document.createElement('span');
	        this.error_container.innerHTML = LiveInput.alert_icon;
	        var icon = this.error_container.querySelector('svg');
	        icon.style.fill = '#ff585d';
	        icon.style.position = 'absolute';
	        icon.style.width = "16px";
	        icon.style.right = "3px";
	        icon.style.top = "3px";
	        this.error_container.style.position = 'relative';
	        this.error_container.style.display = 'inline-block';
	        this.error_container.style.boxShadow = "inset 0 0 0 1px #ff585d";
	        this.el.insertAdjacentElement('afterend', this.error_container);
	        this.error_container.append(this.el);
	      }
	    }
	  }]);

	  return LiveInput;
	}();

	_defineProperty(LiveInput, "booleanAttributes", ['disabled', 'readonly', 'multiple', 'checked', 'autobuffer', 'autoplay', 'controls', 'loop', 'selected', 'hidden', 'scoped', 'async', 'defer', 'reversed', 'ismap', 'seemless', 'muted', 'required', 'autofocus', 'novalidate', 'formnovalidate', 'open', 'pubdate', 'itemscope']);

	_defineProperty(LiveInput, "alert_icon", "\n  <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n  \t viewBox=\"0 0 24 24\" style=\"enable-background:new 0 0 24 24;\" xml:space=\"preserve\">\n  <g>\n  \t<path d=\"M3.5,22c-0.5,0-1-0.1-1.5-0.4c-1.4-0.8-1.9-2.7-1.1-4.1L9.4,3.3c0,0,0,0,0,0c0.2-0.4,0.6-0.8,1-1c0.7-0.4,1.5-0.5,2.3-0.3\n  \t\tc0.8,0.2,1.4,0.7,1.9,1.4L23,17.5c0.3,0.5,0.4,1,0.4,1.5c0,0.8-0.3,1.6-0.9,2.1C22,21.7,21.3,22,20.5,22H3.5z M11.1,4.4L2.7,18.5\n  \t\tc-0.3,0.5-0.1,1.1,0.4,1.4C3.2,20,3.4,20,3.5,20h16.9c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7c0-0.2,0-0.3-0.1-0.5L12.9,4.4\n  \t\tC12.6,3.9,12,3.8,11.5,4C11.3,4.1,11.2,4.2,11.1,4.4z\"/>\n  </g>\n  <g>\n  \t<path d=\"M12,14c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v4C13,13.6,12.6,14,12,14z\"/>\n  </g>\n  <g>\n  \t<path d=\"M12,18c-0.3,0-0.5-0.1-0.7-0.3C11.1,17.5,11,17.3,11,17c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0\n  \t\tc0.1,0.1,0.2,0.2,0.2,0.3c0,0.1,0.1,0.2,0.1,0.4s0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C12.5,17.9,12.3,18,12,18z\"/>\n  </g>\n  </svg>\n  ");

	function hasClass (el, className) {
	    var test;
	    if(el.classList)
	        test = el.classList.contains(className);
	    else 
	        test = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	    return test
	}

	function addClass(el, className) {
	    if (el.classList){
	        each(className.split(" "), function(className){
	            el.classList.add(className);
	        });
	    } else 
	        el.className += ' ' + className;
	}

	function removeClass(el, className) {
	    var removeClassFunction = function (el) {
	        if (el.classList)
	            className.split(" ").forEach((x) => el.classList.remove(x));
	        else
	          el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	    };
	    if (NodeList.prototype.isPrototypeOf(el))
	        each(el, removeClassFunction);
	    else
	        removeClassFunction(el);
	}

	function each (elements, method){
	    for(var i=0; i < elements.length; i++){
	        method(elements[i], i);
	    }
	}

	function closest(el, selector) {
	    if(el.closest) return el.closest(selector);
	    while (el) {
	        if (Element.prototype.matches ? el.matches(selector) : el.msMatchesSelector(selector)) {
	            return el;
	        }
	        el = el.parentElement;
	    }
	}

	function offset(el){
	    var rect = el.getBoundingClientRect();
	    return { 
	      top: rect.top + window.scrollY,
	      left: rect.left + window.scrollX
	    }
	}

	function outerHeight(el){
	    var height = el.offsetHeight;
	    var style = getComputedStyle(el);

	    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
	    return height;
	}

	function outerWidth(el){
	    var width = el.offsetWidth;
	    var style = getComputedStyle(el);

	    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	    return width;
	}

	function uniqueId(prefix){
	    window.idCounter || (window.idCounter = 0);
	    var id = ++window.idCounter + '';
	    return prefix ? prefix + id : id;
	}

	class Component {
	    constructor(options){
	        options = options || {};
	        this.eventListens = new Array();
	        this.eventListeners = new Array();
	        this.el = options.el || document.createElement('div');
	        this.cid = uniqueId('c');
	    
	        this.on = function (type, handler) {
	            this.eventListeners.push({
	                type: type,
	                handler: handler
	            });
	        };
	        
	        this.off = function (type, handler) {
	            if(!this.eventListeners) return;
	            this.eventListeners = this.eventListeners.filter(function(listener){
	                return !(listener.type == type && listener.handler)
	            });
	        }.bind(this);
	    
	        this.trigger = function (event_key) {
	            if(!this.eventListeners) return;
	            this.eventListeners.forEach(function(listener){
	                if(listener.type == "*" || listener.type == "all" || event_key == listener.type){
	                    listener.handler(event_key, this);
	                }
	            });
	        };
	        
	        this.initialize(options);
	    }
	    
	    pick (object, keys) {
	        var newObject = {};
	        keys.forEach(function(key){
	            if(object[key] !== undefined) newObject[key] = object[key];
	        });
	        
	        return newObject;
	    }
	    
	    /*
	        listenTo(el, 'click', '.inner_class', f(), this)
	        listenTo(el, 'click', f(), this)
	    */
	    listenTo(node, event, scope, callback, context){
	        // scope is optional param
	        if(typeof scope != "string") {
	            context = callback;
	            callback = scope;
	            scope = false;
	        }
	        context || (context = this);
	        var listen = [
	            node,
	            event,
	            function(e){
	                if(scope && !hasClass(e.target, scope.replace('.', ''))) return;
	                return callback.bind(context)(...arguments);
	            }.bind(context)
	        ];
	        this.eventListens.push(listen);
	        node.addEventListener(event, listen[2]);
	    }
	    
	    listenToOnce(node, event, callback, context){
	        context || (context = this);
	        var onceCallback = function(e){
	            node.removeEventListener(event, onceCallback);
	            return callback.apply(context, arguments);
	        };
	        var listen = [
	            node,
	            event,
	            onceCallback
	        ];
	        this.eventListens.push(listen);
	        node.addEventListener(event, onceCallback);
	    }
	    
	    remove () {
	        this.trigger('removed');
	        
	        if(this.eventListens) this.eventListens.forEach(function(listen){
	            listen[0].removeEventListener(listen[1], listen[2]);
	        });
	        delete this.eventListens;
	        delete this.eventListeners;
	        if(this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
	        delete this.el;
	    }
	    
	    initialize(){}
	}

	/*
	    Requirements
	    ---
	    content:        html|node
	    anchor:         node
	    
	    Options
	    ---
	    align:          [left|right|center|#px] [top|center|bottom|#px] | default: 'center bottom'
	    zIndex:         # | default: unset
	    offset:         {left: 0, top: 0}
	*/
	class Popover extends Component {
	    initialize (options) {
	        this.showing = false;
	        options = options || {};
	        this.options = {
	            zIndex: 3,
	            container: document.body,
	            align: 'center bottom',
	            anchor: document.body,
	            content: 'needs content',
	            offset: {left: 0, top: 0}
	        };
	        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
	        
	        this.listenTo(document, 'click', this.checkFocus);
	        this.listenTo(document, 'focusin', this.checkFocus);
	        this.listenTo(document, 'keyup', this.checkEscape);
	        this.listenTo(window, 'resize', () => {
	          this.resize.bind(this)();
	        });
	        
	        if(typeof this.options.container == "string"){
	          this.options.container = closest(this.options.anchor, this.options.container);
	          this.options.container = this.options.container || document.body;
	        }
	    }
	    
	    render () {
	        this.showing = true;
	        this.el.style.position = 'absolute';
	        this.el.style.zIndex = this.options.zIndex;
	        
	        if(this.options.content instanceof Node)
	            this.el.appendChild(this.options.content);
	        else
	            this.el.innerHTML = this.options.content;
	        
	        this.options.container.appendChild(this.el);
	        this.resize();
	        this.trigger('shown');
	        
	        return this;
	    }
	    
	    resize () {
	        this.setPosition();
	        const bounds = this.el.getBoundingClientRect();
	        const body_bounds = document.body.getBoundingClientRect();
	        const window_bounds = {
	          top: 0,
	          bottom: window.innerHeight,
	          left: 0,
	          right: window.innerWidth
	        };
	        if (bounds.bottom > Math.max(body_bounds.bottom, window_bounds.bottom)) {
	          var [leftAlign, topAlign] = this.options.align.split(" ");
	          this.setPosition(`${leftAlign} top`);
	        }
	        if (bounds.top < body_bounds.top) {
	            const difference = body_bounds.top - bounds.top;
	            if(this.el.style.top != null) this.el.style.top = parseInt(this.el.style.top) + difference + "px";
	            if(this.el.style.bottom != null) this.el.style.bottom = parseInt(this.el.style.bottom) - difference + "px";
	        }
	        if (bounds.left < body_bounds.left) {
	            const difference = body_bounds.left - bounds.left;
	            if(this.el.style.left != null) this.el.style.left = parseInt(this.el.style.left) + difference + "px";
	            if(this.el.style.right != null) this.el.style.right = parseInt(this.el.style.right) - difference + "px";
	        }
	        if (bounds.right > body_bounds.right) {
	            const difference = body_bounds.right - bounds.right;
	            if(this.el.style.left != null) this.el.style.left = parseInt(this.el.style.left) + difference + "px";
	            if(this.el.style.right != null) this.el.style.right = parseInt(this.el.style.right) - difference + "px";
	        }
	    }
	    
	    setPosition(align){
	        align = align || this.options.align;
	        var [leftAlign, topAlign] = align.split(" ");
	        leftAlign = leftAlign || "bottom";
	        
	        var offset$1 = offset(this.options.anchor);
	        var container = this.options.container;
	        if(getComputedStyle(container)['position'] == "static") container = container.offsetParent;
	        if(!container) container = document.body;

	        var containerOffset = offset(container);
	        offset$1 = {
	            top: offset$1.top - containerOffset.top,
	            left: offset$1.left - containerOffset.left
	        };
	        
	        var position = {};
	        if(leftAlign == 'left'){
	            position.right = outerWidth(container) - offset$1.left;
	        } else if(leftAlign == 'center'){
	            position.left = offset$1.left + outerWidth(this.options.anchor) / 2 - outerWidth(this.el) / 2;
	        } else if (leftAlign == 'right'){
	            position.left = offset$1.left + outerWidth(this.options.anchor);
	        } else if (leftAlign.includes("px")){
	            position.left = offset$1.left + parseInt(leftAlign);
	        }
	        
	        if(topAlign == 'top'){
	            let height = outerHeight(container);
	            if(container == document.body && getComputedStyle(container)['position'] == "static"){
	              height = window.innerHeight;
	            } else if (container == document.body) {
	              height = Math.max(height, document.body.clientHeight);
	            }
	            position.bottom = height - offset$1.top;
	        } else if(topAlign == 'center'){
	            position.top = offset$1.top + outerHeight(this.options.anchor) / 2;
	            position.transform = "translateY(-50%)";
	        } else if (topAlign == 'bottom'){
	            position.top = offset$1.top + outerHeight(this.options.anchor);
	        } else if (topAlign.includes("px")){
	            position.top = offset$1.top + parseInt(topAlign);
	        }
	        
	        if(this.options.offset.left) position.left += parseInt(this.options.offset.left);
	        if(this.options.offset.left) position.right -= parseInt(this.options.offset.left);
	        if(this.options.offset.top) position.top += parseInt(this.options.offset.top);
	        if(this.options.offset.top) position.bottom -= parseInt(this.options.offset.top);
	        
	        this.el.style.left = null;
	        this.el.style.right = null;
	        this.el.style.top = null;
	        this.el.style.bottom = null;
	        this.el.style.transform = null;
	        removeClass(this.el, 'popover-left popover-right popover-center popover-top popover-bottom');
	        addClass(this.el, 'popover-' + topAlign);
	        addClass(this.el, 'popover-' + leftAlign);
	        Object.keys(position).forEach(function(key){
	            this.el.style[key] = position[key] + (key != "transform" ? "px" : "");
	        }, this);
	    }
	    
	    checkFocus (e) {
	        if (e.defaultPrevented)             return;
	        if (!this.showing)                return;
	        if (e.target === this.el)           return;
	        if (e.target == this.options.anchor)        return;
	        if (this.el.contains(e.target))     return;
	        if (this.options.anchor.contains(e.target)) return;
	        this.hide();
	    }
	    
	    checkEscape (e) {
	        if(e.which != 27) return;
	        this.hide();
	    }
	    
	    isHidden() {
	        return !this.showing;
	    }
	    
	    hide (options) {
	        options = options || {};
	        if(!this.showing) return;
	        this.el.style.display = 'none';
	        this.showing = false;
	        if(options.silent !== true) {
	          this.trigger('hidden');
	        }
	    }
	    
	    show () {
	        if(this.showing) return;
	        this.el.style.display = 'block';
	        this.showing = true;
	        this.trigger('shown');
	    }
	    
	    toggle(flag) {
	        flag = flag || this.showing;
	        if(flag) this.hide(); else this.show();
	    }
	}

	let check$1 = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 32 32">
<path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>
</svg>
`.trim();

	let arrow_down = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 20 20">
<path d="M13.418 7.601c0.271-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-3.907 3.83c-0.271 0.268-0.709 0.268-0.979 0l-3.908-3.83c-0.27-0.268-0.27-0.701 0-0.969s0.708-0.268 0.979 0l3.418 3.14 3.418-3.14z"></path>
</svg>
`.trim();

	const BOOLEAN_ATTRIBUTES = ['disabled', 'readonly', 'multiple', 'checked',
	  'autobuffer', 'autoplay', 'controls', 'loop', 'selected', 'hidden',
	  'scoped', 'async', 'defer', 'reversed', 'ismap', 'seemless', 'muted',
	  'required', 'autofocus', 'novalidate', 'formnovalidate', 'open',
	  'pubdate', 'itemscope'
	];

	function createElement(tagName, options) {
	  const el = document.createElement(tagName);
	  
	  Object.keys(options).forEach(key => {
	    const value = options[key];
	    
	    if(BOOLEAN_ATTRIBUTES.includes(key)){
	      if(value !== false) {
	        return el[key] = true;
	      }
	    }
	    
	    switch(key){
	    case 'value':
	      return el.value = value
	    case 'data':
	      if(typeof value == 'object') {
	        return Object.keys(value).forEach(key => {
	          el.dataset[key] = JSON.stringify(value[key]);
	        })
	      }
	      break;
	    case 'style':
	      if(typeof value == 'object') {
	        return Object.keys(value).forEach(key => {
	          el.style[key] = value[key];
	        })
	      }
	      break;
	    case 'children':
	      value.forEach(child => {
	        if(child instanceof Element || typeof child == "string") {
	          el.append(child);
	        } else {
	          el.append(createElement(child));
	        }
	      });
	      return
	    }
	    
	    el.setAttribute(key, value);
	  });
	  return el
	}

	var _events, _context30, _context31;
	var className = "live-field-".concat(now$2());
	var LiveField = Viking.View.extend({
	  tagName: 'span',
	  require: ['target', 'attribute'],
	  permit: ['inputs', 'submit', 'save'],
	  events: (_events = {
	    'mouseover': 'show_indicator',
	    'mouseout': 'hide_indicator'
	  }, _defineProperty(_events, "mouseover .".concat(className, "-indicator"), 'show_overlay'), _defineProperty(_events, "mouseout .".concat(className, "-indicator"), 'hide_overlay'), _defineProperty(_events, "click .".concat(className, "-indicator"), 'render_popover'), _events),
	  options: {
	    type: 'text',
	    container: undefined,
	    labels: {
	      unset: 'Unset',
	      split: function split(collection) {
	        return collection.model.modelName.name;
	      },
	      record: function record(_record) {
	        var _context;

	        return concat$2(_context = "".concat(_record.modelName.name, " #")).call(_context, _record.id);
	      },
	      title: function title(collection) {
	        return this.attribute.titleize();
	      } // use old function to access `this`

	    }
	  },
	  initialize: function initialize(options) {
	    var _this = this;

	    this.split = null;

	    switch (options.type) {
	      case 'select':
	        setPrototypeOf$2(this, LiveSelectField.prototype);

	    }

	    if (options.render) {
	      this.format_value = options.render;
	    }

	    if (options.options) {
	      this.selectOptions = options.options;
	    }

	    this.el.liveField = this;

	    if (this.target instanceof Viking.Model) {
	      this.target = new Viking.Collection([this.target], {
	        model: this.target.constructor
	      });
	    }

	    if (typeof options.save == "undefined") {
	      var _context2;

	      this.save = _.compact(map$2(_context2 = this.target).call(_context2, 'id')).length == this.target.length;
	    }

	    var attributes = [this.attribute];

	    if (this.inputs && isArray$5(this.inputs)) {
	      var _context3;

	      forEach$2(_context3 = this.inputs).call(_context3, function (input_options) {
	        return attributes.push(input_options.attribute);
	      });
	      attributes = filter$2(attributes).call(attributes, function (v, i, self) {
	        return v && indexOf$3(self).call(self, v) === i;
	      });
	    }

	    this.listenTo(this.target, map$2(attributes).call(attributes, function (x) {
	      return "change:".concat(x);
	    }).join(" "), this.render_value);

	    if (!this.constructor.styleNode) {
	      var _context4, _context5;

	      this.constructor.styleNode = document.createElement('style');
	      this.constructor.styleNode.type = 'text/css';
	      document.head.append(this.constructor.styleNode);

	      forEach$2(_context4 = reverse$2(_context5 = this.constructor.styles).call(_context5)).call(_context4, function (rule) {
	        _this.constructor.styleNode.sheet.insertRule(scrubClass(rule));
	      });
	    }
	  },
	  remove: function remove() {
	    this.remove_popover();
	    Viking.View.prototype.remove.apply(this, arguments);
	  },
	  render: function render() {
	    var _context6, _context7, _context8, _context9;

	    this.el.setAttribute('class', this.constructor.className);
	    this.el.innerHTML = concat$2(_context6 = concat$2(_context7 = concat$2(_context8 = concat$2(_context9 = "\n      <span class=\"".concat(scrubClass('live-field-value'), "\"></span>\n      <span class=\"")).call(_context9, scrubClass('live-field-overlay'), "\"></span>\n      <span class=\"")).call(_context8, scrubClass('live-field-indicator'), "\">\n        <span class=\"js-edit\">")).call(_context7, this.constructor.icons.pencil, "</span>\n        <span class=\"js-alert js-hide\">")).call(_context6, this.constructor.icons.alert, "</span>\n      </span>\n    ");
	    this.render_value();
	    return this;
	  },

	  /*
	    Rendering Value
	  */
	  render_value: function render_value() {
	    var _context10;

	    var values = map$2(_context10 = this.target).call(_context10, this.attribute);

	    var html;

	    if (_.compact(values).length == 0) {
	      html = this.render_unset();
	    } else if (_.uniq(map$2(values).call(values, function (x) {
	      return x ? x.toString() : x;
	    })).length == 1) {
	      html = this.format_value(values[0], this.target);
	    } else if (typeof values[0].valueOf() == "number") {
	      var _context11;

	      html = concat$2(_context11 = "".concat(this.format_value(_.min(values), this.target), " - ")).call(_context11, this.format_value(_.max(values), this.target));
	    } else {
	      html = 'Varied';
	    }

	    this.el.querySelector(scrubClass('.live-field-value')).innerHTML = html;
	  },
	  format_value: function format_value(value, target) {
	    return value;
	  },
	  render_unset: function render_unset() {
	    return "<span style=\"font-style: italic; opacity: 0.5\">".concat(this.options.labels.unset, "</span>");
	  },

	  /*
	    Popover
	  */
	  render_popover: function render_popover() {
	    var _context12, _context13, _context14, _context15, _context16;

	    if (this.popover) return this.popover.show();
	    this.popover_container = createElement('div', {
	      class: "".concat(scrubClass('live-field-popover')),
	      children: [createElement('div', {
	        class: scrubClass('live-field-popover-pointer')
	      }), this.render_form()]
	    });
	    this.popover_container.addEventListener('submit', bind$2(_context12 = this.submit).call(_context12, this));
	    this.popover_container.addEventListener('keyup', bind$2(_context13 = this.check_hotkey).call(_context13, this));
	    this.popover_container.addEventListener('keydown', bind$2(_context14 = this.check_hotkey).call(_context14, this));
	    this.popover_container.addEventListener('click', bind$2(_context15 = this.toggle_split).call(_context15, this));
	    this.popover = new Popover({
	      anchor: this.el,
	      align: 'center bottom',
	      content: this.popover_container,
	      offset: {
	        top: 15
	      },
	      container: this.options.container
	    }).render();
	    var input = this.popover_container.querySelector("input, textarea, button[selected]");
	    if (input) input.focus();
	    this.popover.on('hidden', bind$2(_context16 = this.close_popover).call(_context16, this));
	  },
	  render_form: function render_form() {
	    var _context17,
	        _context18,
	        _this2 = this,
	        _context19;

	    var form = createElement('form', {
	      class: scrubClass('live-field-form')
	    });
	    this.form_target = new this.target.klass(map$2(_context17 = this.target.models).call(_context17, function (x) {
	      return x.clone();
	    }));

	    var values = map$2(_context18 = this.form_target).call(_context18, this.attribute); // Render Split


	    if (this.split || this.split == null && _.uniq(map$2(values).call(values, function (x) {
	      return x ? x.toString() : x;
	    })).length > 1) {
	      this.split = true;
	      this.form_target.each(function (model) {
	        var form_group = createElement('div', {
	          class: scrubClass('live-field-form-group'),
	          children: [createElement('div', {
	            style: 'font-weight: bold',
	            children: [_this2.options.labels.record(model)]
	          })]
	        });

	        var inputs = _this2.render_inputs(model);

	        forEach$2(inputs).call(inputs, function (x) {
	          return form_group.append(x);
	        });

	        form.append(form_group);
	      });
	      form.append(createElement('button', {
	        type: 'button',
	        class: scrubClass('live-field-toggle-button js-combine'),
	        children: ["Combine to one Value"]
	      })); // Render Single or Combined
	    } else {
	      var form_group = createElement('div', {
	        class: 'live-field-form-group'
	      });
	      var inputs = this.render_inputs(this.form_target.first());

	      forEach$2(inputs).call(inputs, function (x) {
	        return form_group.append(x);
	      });

	      form.append(form_group);

	      if (this.form_target.length > 1) {
	        form.append(createElement('button', {
	          type: 'button',
	          class: scrubClass('live-field-toggle-button js-split'),
	          children: ["Split by ".concat(_.isFunction(this.options.labels.split) ? this.options.labels.split(this.form_target) : this.options.labels.split)]
	        }));
	      }
	    }

	    this.form_target.on('change', bind$2(_context19 = function _context19(model) {
	      var disable = true;
	      this.form_target.each(function (model) {
	        if (keys$3(model.unsaved_attributes).length > 0) {
	          disable = false;
	        }
	      });
	      form.querySelector('.js-submit').disabled = disable;
	    }).call(_context19, this));
	    form.append(createElement('button', {
	      type: 'submit',
	      disabled: true,
	      class: 'uniformButton -green -block margin-top-half js-submit',
	      children: ['Save']
	    }));
	    return form;
	  },
	  render_inputs: function render_inputs(model) {
	    var _this3 = this;

	    var inputs = [];

	    if (typeof this.inputs == "function") {
	      var _context20;

	      inputs.push(bind$2(_context20 = this.inputs).call(_context20, this)(model));
	    } else {
	      var _context21;

	      this.inputs = this.inputs || [{
	        type: this.options.type,
	        attribute: this.attribute
	      }];

	      forEach$2(_context21 = this.inputs).call(_context21, function (input_opts, index) {
	        var _context23;

	        // Clone for manipulation
	        var input_options = assign$2({}, input_opts);

	        var label_text = input_options.label || input_options.attribute.titleize();

	        if (index == 0) {
	          var _context22;

	          label_text = input_options.label || (typeof _this3.options.labels.title == "string" ? _this3.options.labels.title : bind$2(_context22 = _this3.options.labels.title).call(_context22, _this3)(_this3.target));
	        }

	        var label = createElement('label', {
	          children: [label_text]
	        });
	        var form_group = createElement('div', {
	          class: 'form-group',
	          children: [label]
	        });
	        var input_group;

	        if (input_options.children) {
	          input_group = createElement(input_options.tag || 'div', _.omit(input_options, 'children'));
	          form_group.append(input_group);
	        }

	        forEach$2(_context23 = input_options.children || [input_options]).call(_context23, function (child_options) {
	          var child;

	          if (child_options.tag && child_options.tag != 'input') {
	            child = createElement(child_options.tag, child_options);
	          } else {
	            child = _this3.render_input(assign$2({}, child_options, {
	              model: child_options.model || model
	            }));

	            if (!label.getAttribute('for')) {
	              label.setAttribute('for', child.id);
	            }
	          }

	          (input_group || form_group).append(child);
	        });

	        inputs.push(form_group);
	      }, this);
	    }

	    return inputs;
	  },
	  render_input: function render_input(options) {
	    return this.subView(LiveInput, options).el;
	  },
	  close_popover: function close_popover() {
	    var _context24;

	    this.hide_indicator();
	    this.hide_overlay(); // timeout to allow other callbacks on this.form_target to finish

	    setTimeout$1(bind$2(_context24 = this.remove_popover).call(_context24, this), 100);
	  },
	  remove_popover: function remove_popover() {
	    var _context25, _context26, _context27, _context28, _context29;

	    if (!this.popover) return;

	    forEach$2(_context25 = this.subViews).call(_context25, function (view) {
	      return view.remove;
	    });

	    this.popover.off('hidden', this.popover_hidden);
	    this.popover.remove();
	    delete this.popover;
	    this.form_target.stopListening();
	    delete this.form_target;
	    this.popover_container.removeEventListener('submit', bind$2(_context26 = this.submit).call(_context26, this));
	    this.popover_container.removeEventListener('keyup', bind$2(_context27 = this.check_hotkey).call(_context27, this));
	    this.popover_container.removeEventListener('keydown', bind$2(_context28 = this.check_hotkey).call(_context28, this));
	    this.popover_container.removeEventListener('click', bind$2(_context29 = this.toggle_split).call(_context29, this));
	    this.popover_container.parentNode.removeChild(this.popover_container);
	    delete this.popover_container;
	  },
	  submit: function submit(e) {
	    var _this4 = this;

	    e.preventDefault();
	    var needs_saving = false;
	    this.form_target.each(function (model) {
	      if (keys$3(model.unsaved_attributes).length > 0) {
	        needs_saving = true;
	      }
	    });

	    if (!needs_saving) {
	      return this.close_popover();
	    }

	    var button = this.popover_container.querySelector('.js-submit');
	    button.innerHTML = 'Saving...';
	    button.disabled = true;
	    var saving_ids = [];

	    if (!this.split) {
	      var attributes = this.form_target.first().unsaved_attributes;
	      this.form_target.each(function (model) {
	        return model.set(attributes);
	      });
	    }

	    this.form_target.each(function (model, index) {
	      if (_this4.save) {
	        saving_ids.push(model.cid);
	        model.save(model.unsaved_attributes, {
	          patch: true,
	          success: function success() {
	            saving_ids = _.without(saving_ids, model.cid);

	            _this4.target.get(model.id).set(model.attributes);

	            if (saving_ids.length == 0) {
	              _this4.close_popover();
	            }
	          },
	          invalid: function invalid() {
	            button.innerHTML = 'Save';
	            button.disabled = false;

	            if (!_this4.popover) {
	              _this4.popover.show();
	            }
	          }
	        });
	      } else {
	        if (model.id) {
	          _this4.target.get(model.id).set(model.unsaved_attributes);
	        } else {
	          _this4.target.at(index).set(model.unsaved_attributes);
	        }

	        _this4.close_popover();
	      }
	    });
	  },
	  toggle_split: function toggle_split(e) {
	    if (e.target.classList.contains('js-combine') || e.target.classList.contains('js-split')) {
	      e.preventDefault();
	      this.split = e.target.classList.contains('js-split');
	      this.popover_container.removeChild(this.popover_container.querySelector('form'));
	      this.popover_container.append(this.render_form());
	    }
	  },
	  check_hotkey: function check_hotkey(e) {
	    if (e.key == "Enter" && (e.metaKey || e.shiftKey)) {
	      this.submit(e);
	    }
	  },

	  /*
	    Toggle Indicators
	  */
	  show_indicator: function show_indicator() {
	    clearTimeout(this.hide_indicator_timeout);
	    this.el.querySelector(scrubClass('.live-field-indicator')).style.display = 'block';
	  },
	  hide_indicator: function hide_indicator() {
	    var _this5 = this;

	    this.hide_indicator_timeout = setTimeout$1(function () {
	      _this5.el.querySelector(scrubClass('.live-field-indicator')).style.display = 'none';
	    }, 300);
	  },
	  show_overlay: function show_overlay() {
	    clearTimeout(this.hide_overlay_timeout);
	    this.el.querySelector(scrubClass('.live-field-overlay')).style.display = 'block';
	    this.el.querySelector(scrubClass('.live-field-indicator')).classList.add('-overlay');
	  },
	  hide_overlay: function hide_overlay() {
	    var _this6 = this;

	    this.hide_overlay_timeout = setTimeout$1(function () {
	      _this6.el.querySelector(scrubClass('.live-field-overlay')).style.display = 'none';

	      _this6.el.querySelector(scrubClass('.live-field-indicator')).classList.remove('-overlay');
	    }, 300);
	  }
	}, {
	  className: className,
	  styleNode: null,
	  styles: slice$4(_context30 = map$2(_context31 = "\n    .live-field{\n        position: relative;\n        display: inline-block;\n    }\n    .live-field .live-field-value{\n        position: relative;\n        z-index: 2;\n    }\n    .live-field .live-field-indicator{\n        cursor: pointer;\n        position: absolute;\n        padding: 0.25em;\n        border-radius: 0 0.25em 0.25em 0;\n        top: -0.25em;\n        left: 100%;\n        line-height: 1;\n        z-index: 3;\n        display: none;\n    }\n    .live-field .live-field-indicator.-overlay{\n        background: #ffff007d;\n    }\n    .live-field .live-field-overlay{\n        display: block;\n        position: absolute;\n        top: -5px;\n        bottom: -5px;\n        left: -5px;\n        right: -5px;\n        border-radius: 0.25em;\n        z-index: 1;\n        background: #ffff007d;\n        display:none;\n    }\n    .live-field-form{\n      padding: 1em;\n    }\n    .live-field-form .form-group > label{\n      display: block;\n      font-weight: bold;\n    }\n    .live-field-form .form-group {\n      margin-bottom: 0.5em\n    }\n    .live-field-form-group{\n      margin-bottom: 0.5em\n    }\n    .live-field-button{\n      display: block;\n      outline: none;\n      border:none;\n      padding: 0.5em;\n      white-space: nowrap;\n      appearance:none;\n      background: none;\n      width:100%;\n      text-align: left;\n      border: 1px solid transparent;\n    }\n    .live-field-button:hover{\n      background: #e3e3e3;\n    }\n    .live-field-button[selected], .live-field-button[selected]:hover{\n      background: rgba(74, 171, 227, 0.3);\n      color: #245ec7;\n      border-bottom: 1px solid white;\n    }\n    .live-field-button:focus{\n      border: 1px dotted #245ec7;\n    }\n    .live-field-popover{\n      background: white;\n      border-radius: 0.25em;\n      box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.2);\n      overflow: hidden;\n    }\n    .live-field-popover-pointer{\n      position: absolute;\n      bottom: 100%;\n      left: 50%;\n      margin-left: -1em;\n      width: 2em;\n      height: 2em;\n      overflow: hidden;\n    }\n    .live-field-popover-pointer:after{\n      content: \"\";\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      background: white;\n      transform: rotate(-45deg);\n      top: 85%;\n      left: 0;\n      box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.2);\n    }\n    .live-field-toggle-button{\n      color: #245ec7;\n      font-size: 0.8em;\n      padding: 0.5em 0;\n      outline: none;\n      appearance: none;\n      border: none;\n      background: none;\n    }\n  ".split('}')).call(_context31, function (x) {
	    return x += "}";
	  })).call(_context30, 0, -1),
	  icons: {
	    pencil: "\n    <svg style=\"width: 1em; height: 1em;\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 32 32\">\n    <path d=\"M30.173 7.542l-0.314 0.314-5.726-5.729 0.313-0.313c0 0 1.371-1.813 3.321-1.813 0.859 0 1.832 0.353 2.849 1.37 3.354 3.354-0.443 6.171-0.443 6.171zM27.979 9.737l-19.499 19.506-8.48 2.757 2.756-8.485v-0.003h0.002l19.496-19.505 0.252 0.253zM2.76 29.239l4.237-1.219-2.894-3.082-1.343 4.301z\"></path>\n    </svg>\n    ",
	    alert: "\n    <svg style=\"width: 1em; height: 1em; display:none; fill: red;\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 24 24\">\n    <g><path d=\"M3.5,22c-0.5,0-1-0.1-1.5-0.4c-1.4-0.8-1.9-2.7-1.1-4.1L9.4,3.3c0,0,0,0,0,0c0.2-0.4,0.6-0.8,1-1c0.7-0.4,1.5-0.5,2.3-0.3\n    c0.8,0.2,1.4,0.7,1.9,1.4L23,17.5c0.3,0.5,0.4,1,0.4,1.5c0,0.8-0.3,1.6-0.9,2.1C22,21.7,21.3,22,20.5,22H3.5z M11.1,4.4L2.7,18.5\n    c-0.3,0.5-0.1,1.1,0.4,1.4C3.2,20,3.4,20,3.5,20h16.9c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7c0-0.2,0-0.3-0.1-0.5L12.9,4.4\n    C12.6,3.9,12,3.8,11.5,4C11.3,4.1,11.2,4.2,11.1,4.4z\"/></g>\n    <g><path d=\"M12,14c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v4C13,13.6,12.6,14,12,14z\"/></g>\n    <g><path d=\"M12,18c-0.3,0-0.5-0.1-0.7-0.3C11.1,17.5,11,17.3,11,17c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0\n    c0.1,0.1,0.2,0.2,0.2,0.3c0,0.1,0.1,0.2,0.1,0.4s0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C12.5,17.9,12.3,18,12,18z\"/></g>\n    </svg>\n    "
	  }
	});
	var LiveSelectField = LiveField.extend({
	  render_inputs: function render_inputs(target) {
	    var _context32,
	        _this7 = this;

	    var input;

	    var options = map$2(_context32 = this.selectOptions).call(_context32, function (option) {
	      var value, label, selected;

	      if (isArray$5(option)) {
	        var _option = _slicedToArray(option, 3);

	        value = _option[0];
	        label = _option[1];
	        selected = _option[2];
	        if (typeof selected == 'undefined') selected = target.get(_this7.attribute) == value;
	      } else {
	        var _ref = [option, option.titleize(), target.get(_this7.attribute) == option];
	        value = _ref[0];
	        label = _ref[1];
	        selected = _ref[2];
	      }

	      return [value, label, selected];
	    });

	    if (this.split) {
	      input = this.subView(LiveInput, {
	        attribute: this.attribute,
	        model: target,
	        type: 'select',
	        name: this.attribute,
	        options: options
	      }).el;
	      input = [input];
	    } else {
	      input = [];

	      forEach$2(options).call(options, function (option) {
	        var _option2 = _slicedToArray(option, 3),
	            value = _option2[0],
	            label = _option2[1],
	            selected = _option2[2];

	        var button = _this7.subView(LiveInput, {
	          attribute: _this7.attribute,
	          model: target,
	          type: 'button',
	          class: scrubClass('live-field-button'),
	          name: _this7.attribute,
	          selected: selected,
	          value: value
	        }).el;

	        button.innerHTML = label;
	        input.push(button);
	      });
	    }

	    return input;
	  },
	  check_hotkey: function check_hotkey(e) {
	    if (e.type == "keyup" && e.key == "Enter" && (e.metaKey || e.shiftKey)) {
	      this.submit(e);
	    }

	    if (e.type == "keydown" && (e.key == "ArrowUp" || e.key == "ArrowDown")) {
	      var direction = e.key == "ArrowUp" ? 'previousElementSibling' : 'nextElementSibling';
	      var next = this.popover_container.querySelector('button:focus')[direction];

	      if (next) {
	        next.focus();
	        e.preventDefault();
	      }
	    }
	  }
	});

	function scrubClass(string) {
	  return string.replace(/\live-field/g, LiveField.className);
	}

	hljs.initHighlightingOnLoad();
	var Account = Viking.Model.extend('account', {
	  inheritanceAttribute: false
	});
	var AccountCollection = Viking.Collection.extend({
	  model: Account
	});
	var record1 = new Account({
	  name: 'Ben Ehmke',
	  nickname: 'bemky',
	  rate: '25',
	  currency: 'USD',
	  type: 'programmer'
	});
	var record2 = new Account({
	  name: 'Jerry',
	  rate: '25',
	  currency: 'USD',
	  type: 'programmer'
	});
	var record3 = new Account({
	  name: 'Mike',
	  rate: '25',
	  currency: 'USD',
	  type: 'programmer'
	});
	var collection = new AccountCollection([record1, record2, record3]);
	document.getElementById('basic').prepend(new LiveField({
	  target: record1,
	  attribute: 'name'
	}).render().el);
	document.getElementById('select').prepend(new LiveField({
	  target: record1,
	  attribute: 'status',
	  type: 'select',
	  options: ['a', 'b', 'c']
	}).render().el);
	document.getElementById('rendering').prepend(new LiveField({
	  target: record1,
	  attribute: 'nickname',
	  render: function render(v, target) {
	    var _context;

	    return concat$2(_context = "".concat(v, " / ")).call(_context, v.toUpperCase());
	  }
	}).render().el);
	document.getElementById('multiple-inputs').prepend(new LiveField({
	  target: record1,
	  attribute: 'rate',
	  render: function render(v, target) {
	    var _context2;

	    return concat$2(_context2 = "".concat(target.first().get('currency'), " ")).call(_context2, v);
	  },
	  inputs: [{
	    type: 'number',
	    attribute: 'rate'
	  }, {
	    type: 'select',
	    attribute: 'currency',
	    options: ['USD', 'EUR', 'BTC']
	  }]
	}).render().el);
	document.getElementById('js-collections').prepend(new LiveField({
	  target: collection,
	  attribute: 'type',
	  type: 'select',
	  options: ['programmer', 'manager', 'principle'],
	  render: function render(v) {
	    return v.titleize();
	  },
	  labels: {
	    record: function record(_record) {
	      return _record.get('name');
	    }
	  }
	}).render().el);

}());
