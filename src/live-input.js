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

export default class LiveInput {
  
  constructor (options) {
    const option_keys = [
      'save',
      'type',
      'model',
      'attribute',
      'load',
      'dump'
    ]
    option_keys.forEach(key => {
      if(options[key]){
        this[key] = options[key]
      }
    })
    this.type = this.type || 'text';
    
    if (['select', 'textarea', 'button'].includes(this.type)) {
      this.el = document.createElement(this.type)
    } else {
      this.el = document.createElement('input')
      this.el.setAttribute('type', this.type)
    }
    
    const value = options.value || this.dump(this.model.get(this.attribute), this.model) || ''
    this.el.value = value;
    
    // Set distinct id for targeting with <label>
    window.idCounter || (window.idCounter = 0)
    this.el.setAttribute('id', `live-input-${window.idCounter++}`)
    
    // Render Options for Select Input
    if(this.type == 'select' && options.options) {
      options.options.forEach(option => {
        if(option instanceof Element) {
          return this.el.append(option)
        }
        const html_option = document.createElement('option');
        
        if(Array.isArray(option)){
          html_option.setAttribute('value', option[0])
          html_option.innerHTML = option[1]
          html_option.selected = option[2] === undefined ? option[0] == value : option[2]
        } else {
          html_option.setAttribute('value', option)
          html_option.innerHTML = option
          html_option.selected = option == value
        }
        
        this.el.append(html_option)
      })
    }
    
    // Assign all attributes passed to element
    // TODO whitelist attributes with common list of html attributes
    Object.keys(options).forEach(key => {
      if(key == "options") return; // options used for select already used
      if(key == "value") return; // already dealt with
      if(option_keys.includes(key) && this.type != 'button' && key != 'type') return;
      if(!LiveInput.booleanAttributes.includes(key) || options[key] === true) {
        this.el.setAttribute(key, options[key]);
      }
    });
    
    // Setup Listeners
    if(this.type == "button"){
      this.el.addEventListener('click', this.input_change.bind(this));
    } else {
      this.el.addEventListener('change', this.input_change.bind(this));
    }
    
    if(this.model.on){
      this.model.on('change:' + this.attribute, this.model_change.bind(this));
      this.model.on('invalid', this.invalid.bind(this))
    }
    
    // TODO handle errors
  }
  
  remove () {
    if(this.model.off){
      this.model.off('change:' + this.attribute, this.model_change.bind(this));
      this.model.off('invalid', this.invalid)
    }
    this.el.removeEventListener('click', this.input_change.bind(this));
    this.el.removeEventListener('change', this.input_change.bind(this));
    if(this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
    delete this.el;
  }

  input_change(e) {
    const value = this.load(e.target.value, this.model)
    this.model.set(this.attribute, value)
  }
  
  model_change(e) {
    const value = this.dump(this.model.get(this.attribute), this.model)
    if(['checkbox', 'radio', 'button'].includes(this.type)){
      const attribute = this.type == "button" ? 'selected' : 'checked'
      if((Array.isArray(value) && value.includes(this.el.value)) || value == this.el.value) {
        this.el.setAttribute(attribute, true)
      } else {
        this.el.removeAttribute(attribute)
      }
    } else {
      this.el.value = value;
    }
    
    if(this.error_container){
      this.error_container.insertAdjacentElement('beforebegin', this.el);
      this.error_container.parentNode.removeChild(this.error_container)
      delete this.error_container
    }
  }
  
  load(v, model) {
    return v
  }
  
  dump(v, model) {
    if(v && this.type == "date"){
      return v.toISODateString()
    }
    return v
  }
  
  invalid(model, errors, xhr) {
    if(Object.keys(errors).includes(this.attribute)){
      this.error_container = document.createElement('span')
      this.error_container.innerHTML = LiveInput.alert_icon
      const icon = this.error_container.querySelector('svg')
      icon.style.fill = '#ff585d'
      icon.style.position = 'absolute'
      icon.style.width = "16px"
      icon.style.right = "3px"
      icon.style.top = "3px"

      this.error_container.style.position = 'relative'
      this.error_container.style.display = 'inline-block';
      this.error_container.style.boxShadow = "inset 0 0 0 1px #ff585d";
      this.el.insertAdjacentElement('afterend', this.error_container);
      this.error_container.append(this.el);
    }
  }
  
  static booleanAttributes = ['disabled', 'readonly', 'multiple', 'checked',
  'autobuffer', 'autoplay', 'controls', 'loop', 'selected', 'hidden',
  'scoped', 'async', 'defer', 'reversed', 'ismap', 'seemless', 'muted',
  'required', 'autofocus', 'novalidate', 'formnovalidate', 'open',
  'pubdate', 'itemscope']
  
  static alert_icon = `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  	 viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
  <g>
  	<path d="M3.5,22c-0.5,0-1-0.1-1.5-0.4c-1.4-0.8-1.9-2.7-1.1-4.1L9.4,3.3c0,0,0,0,0,0c0.2-0.4,0.6-0.8,1-1c0.7-0.4,1.5-0.5,2.3-0.3
  		c0.8,0.2,1.4,0.7,1.9,1.4L23,17.5c0.3,0.5,0.4,1,0.4,1.5c0,0.8-0.3,1.6-0.9,2.1C22,21.7,21.3,22,20.5,22H3.5z M11.1,4.4L2.7,18.5
  		c-0.3,0.5-0.1,1.1,0.4,1.4C3.2,20,3.4,20,3.5,20h16.9c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7c0-0.2,0-0.3-0.1-0.5L12.9,4.4
  		C12.6,3.9,12,3.8,11.5,4C11.3,4.1,11.2,4.2,11.1,4.4z"/>
  </g>
  <g>
  	<path d="M12,14c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v4C13,13.6,12.6,14,12,14z"/>
  </g>
  <g>
  	<path d="M12,18c-0.3,0-0.5-0.1-0.7-0.3C11.1,17.5,11,17.3,11,17c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0
  		c0.1,0.1,0.2,0.2,0.2,0.3c0,0.1,0.1,0.2,0.1,0.4s0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C12.5,17.9,12.3,18,12,18z"/>
  </g>
  </svg>
  `
};