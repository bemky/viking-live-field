let originalVikingViewConstructor = Viking.View.prototype.constructor;
let originalVikingMethods = {
  constructor: Viking.View.prototype.constructor,
  remove: Viking.View.prototype.remove,
  listenTo: Viking.View.prototype.listenTo
}
Viking.View = Viking.View.extend({
  constructor(options) {
    this.removeCallbacks = [];
    if (this.permit) _.extend(this, _.pick(options, this.permit));
    if (this.require) {
      if(Object.keys(_.pick(options, this.require)).length != this.require.length){
        throw `View is missing required options: ${_.without(this.require, Object.keys(options)).join(", ")}`;
      }
      _.extend(this, _.pick(options, this.require));
    }
    if (this.options && !this.cancelDefaultOptions) {
      const deep_extend = function (original_obj, extending_obj) {
        let obj = {}
        Object.keys(original_obj).forEach(key => {
          if(![original_obj[key], extending_obj[key]].map(o => {
            return[_.isObject(o), !_.isFunction(o), !_.isArray(o)]
          }).flat().includes(false)){
            obj[key] = deep_extend(original_obj[key], extending_obj[key])
          } else {
            obj[key] = extending_obj[key] || original_obj[key]
          }
        })
        return obj
      }
      this.options = deep_extend(this.options, options)
    }
    originalVikingMethods.constructor.apply(this, arguments);
  },
  
  remove () {
    this.removeCallbacks.forEach(x => x());
    return originalVikingMethods.remove.apply(this, arguments)
  },
  
  listenTo (obj, name, callback) {
    if(obj instanceof Element || obj instanceof Document || obj instanceof Window) {
      callback = callback.bind(this)
      obj.addEventListener(name, callback);
      this.removeCallbacks.push(() => {
        obj.removeEventListener(name, callback);
      })
      return
    }
    return originalVikingMethods.listenTo.apply(this, arguments)
  },

  removeSubViews: function () {
    while (this.subViews.length > 0) {
      this.subViews.pop().remove();
    }
  },
});