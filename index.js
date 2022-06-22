//! FUNCTIONS FOR TEST
const sumAll = (...additives) => additives.reduce((sum, add) => sum += add, 0)
let sum5 = (a, b, c, d, e) => a + b + c + d + e


// test
const sumAllCurried = curryUniversalFull(sumAll, 5)
const sum5Curried = curryUniversalFull(sum5, 5)
console.log(sum5Curried(1)(2)(3)(4) )
console.log(sumAllCurried(1)(8)() )
console.log(sumAllCurried(1)(9).result )
console.log(Number(sumAllCurried(1)(10) ) ) // Declare result type
console.log(String(sumAllCurried(1)(10) ) ) // Declare result type



// ============================

// _Universal curry (both for finite and infinite params amount functions)
function curryUniversalArgs(fn, ...argsArray) {
  return function subCurry(...args) {
    argsArray = argsArray.concat(args)

    let shouldInvoke = fn.length ? fn.length <= argsArray.length : !args.length 
    if (!shouldInvoke) return subCurry

    return fn.apply(this, argsArray)
  }
}

function curryUniversalClosure(fn, ...args) {
  let argsArray = args ? args : []
  
  return function subCurry(...args) {
    argsArray = argsArray.concat(args)

    let shouldInvoke = fn.length ? fn.length <= argsArray.length : !args.length 
    if (!shouldInvoke) return subCurry

    let res = fn.apply(this, argsArray)
    argsArray.length = 0
    return res
  }
}

// _Universal different launches
function curryUniversalFull(fn, ...argsArray) {
  argsArray = argsArray ? argsArray : []
  
  function subCurry(...args) {
    argsArray = argsArray.concat(args)

    // (1) fn()
    let shouldInvoke = fn.length ? fn.length <= argsArray.length : !args.length 
    if (!shouldInvoke) return subCurry

    let res = fn.apply(this, argsArray)
    argsArray.length = 0
    return res
  }
  // (2)
  subCurry[Symbol.toPrimitive] = () => {
    const result = fn.apply(this, argsArray)
    argsArray.length = 0
    return result
  }
  // (3) 
  Object.defineProperty(subCurry, 'result', {
    get: function () {
      const result = fn.apply(this, argsArray)
      argsArray.length = 0
      return result
    }
  })

  return subCurry
}






// _Arrow curry
const partialArrow = (fn, ...args) => (...args2) => fn(...args.concat(args2))

const curryBindArrow = fn => (...args2) => (fn.length > args2.length) ? 
  curryBindArrow(fn.bind(this, ...args2) ) : fn(...args2)

const curryArrowArgs = (fn, ...args) => (...args2) => (fn.length <= args.concat(args2).length) ? 
  fn.apply(this, args.concat(args2) ) 
  : curryArrowArgs(fn, ...args.concat(args2) )



// _Bind curry
function curryBind(fn) {
  return function subCurry(...args) {
    if (fn.length > args.length) return curryBind(fn.bind(this, ...args) )
    return fn(...args)
  }
}

// _Closure curry
function currySimple(fn) {
  let argsArr = []
  return function subCurry(...args) {
    argsArr = argsArr.concat(args)
    if (fn.length > argsArr.length) return subCurry 
    return fn.apply(this, argsArr)
  }
}


// _ArgsClosure  curry
function currySimple(fn, ...argsArr) {
  return function subCurry(...args) {
    argsArr = argsArr.concat(args)
    if (fn.length > argsArr.length) return subCurry 
    return fn.apply(this, argsArr)
  }
}
function curryDif(fn, ...args) {
  return function curried(...args2) {
    if (fn.length <= args2.length ) return fn.apply(this, args.concat(args2))
    return curryDif(curried, ...args.concat(args2) )
  }
}

function partial(fn, ...args) {
  return function (...args2) {
    fn.apply(this, ...args.concat(args2))
  }
}


// _Pipe
const pipe = (...fns) => x =>  fns.reduce((res, fn) => res = fn(res), x)

// _Composition
const compose = (args, ...fns) => fns.reduce((res, fn) => res = fn(res), args)

// _Seq
function seq(...fns) {
  return function subseq(arg) {    
    if (typeof arg === 'number') return compose(arg, ...fns.reverse() )

    fns.push(arg)
    return subseq
  }
}
const seqArrow = (...fns) => subseq = (arg) => (typeof arg === 'number') ? 
  compose(arg, ...fns.reverse() )
  : (fns.push(arg), subseq)


let y = seq(x => x + 1)
   (x => x * 2)
   (x => x / 3)
   (x => x - 4)(7)

// console.log(y) // result: 3

