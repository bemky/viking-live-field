import LiveInput from './live-input';
import {Popover} from 'uniform-ui';
import {createElement} from 'dolla';

const className = `live-field-${Date.now()}`
const LiveField = Viking.View.extend({
  tagName: 'span',
  
  require: [
    'target',
    'attribute'
  ],
  
  permit: [
    'inputs',
    'submit',
    'save'
  ],
  
  events: {
    'mouseover': 'show_indicator',
    'mouseout': 'hide_indicator',
    [`mouseover .${className}-indicator`]: 'show_overlay',
    [`mouseout .${className}-indicator`]: 'hide_overlay',
    [`click .${className}-indicator`]: 'render_popover',
  },
  
  options: {
    type: 'text',
    container: undefined,
    labels: {
      unset: 'Unset',
      split: collection => collection.model.modelName.name,
      record: record => `${record.modelName.name} #${record.id}`,
      title: function(collection) { return this.attribute.titleize() } // use old function to access `this`
    }
  },
  
  initialize (options) {
    this.split = null;
    switch(options.type) {
    case 'select':
      Object.setPrototypeOf(this, LiveSelectField.prototype)
    }
    
    if(options.render) {
      this.format_value = options.render
    }
    if(options.options) {
      this.selectOptions = options.options
    }
    
    this.el.liveField = this
    
    if(this.target instanceof Viking.Model) {
      this.target = new Viking.Collection([this.target], {
        model: this.target.constructor
      })
    }
    
    if(typeof options.save == "undefined") {
      this.save = _.compact(this.target.map('id')).length == this.target.length
    }
    
    let attributes = [this.attribute]
    if(this.inputs && Array.isArray(this.inputs)) {
      this.inputs.forEach(input_options => attributes.push(input_options.attribute))
      const used_attributes = []
      attributes = attributes.filter((v, i, self) => v && self.indexOf(v) === i)
    }
    
    this.listenTo(this.target, attributes.map(x => `change:${x}`).join(" "), this.render_value);
    
    if(!this.constructor.styleNode) {
      this.constructor.styleNode = document.createElement('style')
      this.constructor.styleNode.type = 'text/css';
      document.head.append(this.constructor.styleNode);
      this.constructor.styles.reverse().forEach(rule => {
        this.constructor.styleNode.sheet.insertRule(scrubClass(rule))
      })
    }
  },
  
  remove () {
    this.remove_popover();
    Viking.View.prototype.remove.apply(this, arguments)
  },
  
  render () {
    this.el.setAttribute('class', this.constructor.className)
    this.el.innerHTML = `
      <span class="${scrubClass('live-field-value')}"></span>
      <span class="${scrubClass('live-field-overlay')}"></span>
      <span class="${scrubClass('live-field-indicator')}">
        <span class="js-edit">${this.constructor.icons.pencil}</span>
        <span class="js-alert js-hide">${this.constructor.icons.alert}</span>
      </span>
    `
    this.render_value();
    return this
  },
  
  /*
    Rendering Value
  */
  render_value () {
    let values = this.target.map(this.attribute);
    let html;
    if(_.compact(values).length == 0){
      html = this.render_unset();
    } else if(_.uniq(values.map(x => x ? x.toString() : x)).length == 1) {
      html = this.format_value(values[0], this.target);
    } else if(typeof values[0].valueOf() == "number") {
      html = `${this.format_value(_.min(values), this.target)} - ${this.format_value(_.max(values), this.target)}`;
    } else {
      html = 'Varied'
    }
    this.el.querySelector(scrubClass('.live-field-value')).innerHTML = html
  },
  
  format_value (value, target) {
    return value
  },
  
  render_unset () {
    return `<span style="font-style: italic; opacity: 0.5">${this.options.labels.unset}</span>`
  },
  
  /*
    Popover
  */
  render_popover () {
    if(this.popover) return this.popover.show();
    
    this.popover_container = createElement('div', {
      class: `${scrubClass('live-field-popover')}`,
      children: [
          createElement('div', {class: scrubClass('live-field-popover-pointer')}),
          this.render_form()
      ]
    })
    
    this.popover_container.addEventListener('submit', this.submit.bind(this));
    this.popover_container.addEventListener('keyup', this.check_hotkey.bind(this));
    this.popover_container.addEventListener('keydown', this.check_hotkey.bind(this));
    
    this.popover_container.addEventListener('click', this.toggle_split.bind(this));
    
    this.popover = new Popover({
      anchor: this.el,
      align: 'center bottom',
      content: this.popover_container,
      offset: {top: 15},
      container: this.options.container
    }).render();
    const input = this.popover_container.querySelector("input, textarea, button[selected]")
    if(input) input.focus();
    this.popover.on('hidden', this.close_popover.bind(this))
  },
  
  render_form () {
    const form = createElement('form', {class: scrubClass('live-field-form')})
    
    this.form_target = new this.target.klass(this.target.models.map(x => x.clone()))
    const values = this.form_target.map(this.attribute);
    // Render Split
    if(this.split || (this.split == null && _.uniq(values.map(x => x ? x.toString() : x)).length > 1)) {
      this.split = true;
      this.form_target.each(model => {
        const form_group = createElement('div', {
          class: scrubClass('live-field-form-group'),
          children: [createElement('div', {
            style: 'font-weight: bold',
            children: [this.options.labels.record(model)]
          })]
        })
        const inputs = this.render_inputs(model)
        inputs.forEach(x => form_group.append(x))
        form.append(form_group)
      })
      form.append(createElement('button', {
        type: 'button',
        class: scrubClass('live-field-toggle-button js-combine'),
        children: [`Combine to one Value`]
      }))
      
    // Render Single or Combined
    } else {
      const form_group = createElement('div', {
        class: 'live-field-form-group',
      })
      const inputs = this.render_inputs(this.form_target.first())
      inputs.forEach(x => form_group.append(x))
      form.append(form_group)
      if(this.form_target.length > 1) {
        form.append(createElement('button', {
          type: 'button',
          class: scrubClass('live-field-toggle-button js-split'),
          children: [`Split by ${_.isFunction(this.options.labels.split) ? this.options.labels.split(this.form_target) : this.options.labels.split}`]
        }))
      }
    }
    
    this.form_target.on('change', function (model) {
      let disable = true
      this.form_target.each(model => {
        if(Object.keys(model.unsaved_attributes).length > 0){
          disable = false
        }
      })
      form.querySelector('.js-submit').disabled = disable
    }.bind(this))
    
    form.append(createElement('button', {
      type: 'submit',
      disabled: true,
      class: 'uniformButton -green -block margin-top-half js-submit',
      children: ['Save']
    }))
    return form;
  },
  
  render_inputs (model) {
    const inputs = []
    if(typeof this.inputs == "function"){
      inputs.push(this.inputs.bind(this)(model));
    } else {
      this.inputs = this.inputs || [{
        type: this.options.type,
        attribute: this.attribute
      }]
      
      this.inputs.forEach((input_opts, index) => {
        // Clone for manipulation
        let input_options = Object.assign({}, input_opts)
        
        let label_text = input_options.label || input_options.attribute.titleize()
        if(index == 0){
          label_text = input_options.label || (typeof this.options.labels.title == "string" ? this.options.labels.title : this.options.labels.title.bind(this)(this.target))
        }
        
        const label = createElement('label', {
          children: [label_text]
        })
        
        const form_group = createElement('div', {
          class: 'form-group',
          children: [label]
        })
        
        let input_group;
        if(input_options.children) {
          input_group = createElement(input_options.tag || 'div', _.omit(input_options, 'children'))
          form_group.append(input_group)
        }
        
        (input_options.children || [input_options]).forEach(child_options => {
          let child;
          if(child_options.tag && child_options.tag != 'input') {
            child = createElement(child_options.tag, child_options)
          } else {
            child = this.render_input(Object.assign({}, child_options, {
              model: child_options.model || model
            }))
            if(!label.getAttribute('for')) {
              label.setAttribute('for', child.id)
            }
          }
          (input_group || form_group).append(child)
        })
        
        inputs.push(form_group)
      }, this)
    }
    return inputs
  },
  
  render_input(options){
    return this.subView(LiveInput, options).el
  },
  
  close_popover () {
    this.hide_indicator()
    this.hide_overlay()
    // timeout to allow other callbacks on this.form_target to finish
    setTimeout(this.remove_popover.bind(this), 100)
  },
  
  remove_popover () {
    if(!this.popover) return;
    this.subViews.forEach(view => view.remove);
    this.popover.off('hidden', this.popover_hidden)
    this.popover.remove()
    delete this.popover
    
    this.form_target.stopListening()
    delete this.form_target
    
    this.popover_container.removeEventListener('submit', this.submit.bind(this));
    this.popover_container.removeEventListener('keyup', this.check_hotkey.bind(this));
    this.popover_container.removeEventListener('keydown', this.check_hotkey.bind(this));
    this.popover_container.removeEventListener('click', this.toggle_split.bind(this));
    this.popover_container.parentNode.removeChild(this.popover_container)
    delete this.popover_container
  },
  
  submit (e) {
    e.preventDefault()
    
    let needs_saving = false
    this.form_target.each(model => {
      if(Object.keys(model.unsaved_attributes).length > 0){
        needs_saving = true
      }
    })
    if(!needs_saving) {
      return this.close_popover()
    }
    
    const button = this.popover_container.querySelector('.js-submit')
    button.innerHTML = 'Saving...'
    button.disabled = true
    
    let saving_ids = []
    if(!this.split) {
      let attributes = this.form_target.first().unsaved_attributes
      this.form_target.each(model => model.set(attributes))
    }
    this.form_target.each((model, index) => {
      if(this.save) {
        saving_ids.push(model.cid)
        model.save(model.unsaved_attributes, {
          patch: true,
          success: () => {
            saving_ids = _.without(saving_ids, model.cid)
            this.target.get(model.id).set(model.attributes);
            if(saving_ids.length == 0) {
              this.close_popover()
            }
          },
          invalid: () => {
            button.innerHTML = 'Save'
            button.disabled = false
            if(!this.popover){
              this.popover.show();
            }
          }
        })
      } else {
        if(model.id){
          this.target.get(model.id).set(model.unsaved_attributes);
        } else {
          this.target.at(index).set(model.unsaved_attributes)
        }
        
        this.close_popover()
      }
    })
  },
  
  toggle_split(e) {
    if(e.target.classList.contains('js-combine') || e.target.classList.contains('js-split')){
      e.preventDefault()
      this.split = e.target.classList.contains('js-split')
      this.popover_container.removeChild(this.popover_container.querySelector('form'));
      this.popover_container.append(this.render_form())
    }
  },
  
  check_hotkey(e) {
    if(e.key == "Enter" && (e.metaKey || e.shiftKey)){
      this.submit(e)
    }
  },
  
  /*
    Toggle Indicators
  */
  show_indicator () {
    clearTimeout(this.hide_indicator_timeout);
    this.el.querySelector(scrubClass('.live-field-indicator')).style.display = 'block'
  },
  
  hide_indicator () {
    this.hide_indicator_timeout = setTimeout(() => {
      this.el.querySelector(scrubClass('.live-field-indicator')).style.display = 'none'
    }, 300)
  },

  show_overlay () {
    clearTimeout(this.hide_overlay_timeout);
    this.el.querySelector(scrubClass('.live-field-overlay')).style.display = 'block'
    this.el.querySelector(scrubClass('.live-field-indicator')).classList.add('-overlay')
  },
  
  hide_overlay() {
    this.hide_overlay_timeout = setTimeout(() => {
      this.el.querySelector(scrubClass('.live-field-overlay')).style.display = 'none'
      this.el.querySelector(scrubClass('.live-field-indicator')).classList.remove('-overlay')
    }, 300)
  },
}, {
  className: className,
  styleNode: null,
  styles: `
    .live-field{
        position: relative;
        display: inline-block;
    }
    .live-field .live-field-value{
        position: relative;
        z-index: 2;
    }
    .live-field .live-field-indicator{
        cursor: pointer;
        position: absolute;
        padding: 0.25em;
        border-radius: 0 0.25em 0.25em 0;
        top: -0.25em;
        left: 100%;
        line-height: 1;
        z-index: 3;
        display: none;
    }
    .live-field .live-field-indicator.-overlay{
        background: #ffff007d;
    }
    .live-field .live-field-overlay{
        display: block;
        position: absolute;
        top: -5px;
        bottom: -5px;
        left: -5px;
        right: -5px;
        border-radius: 0.25em;
        z-index: 1;
        background: #ffff007d;
        display:none;
    }
    .live-field-form{
      padding: 1em;
    }
    .live-field-form .form-group > label{
      display: block;
      font-weight: bold;
    }
    .live-field-form .form-group {
      margin-bottom: 0.5em
    }
    .live-field-form-group{
      margin-bottom: 0.5em
    }
    .live-field-button{
      display: block;
      outline: none;
      border:none;
      padding: 0.5em;
      white-space: nowrap;
      appearance:none;
      background: none;
      width:100%;
      text-align: left;
      border: 1px solid transparent;
    }
    .live-field-button:hover{
      background: #e3e3e3;
    }
    .live-field-button[selected], .live-field-button[selected]:hover{
      background: rgba(74, 171, 227, 0.3);
      color: #245ec7;
      border-bottom: 1px solid white;
    }
    .live-field-button:focus{
      border: 1px dotted #245ec7;
    }
    .live-field-popover{
      background: white;
      border-radius: 0.25em;
      box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .live-field-popover-pointer{
      position: absolute;
      bottom: 100%;
      left: 50%;
      margin-left: -1em;
      width: 2em;
      height: 2em;
      overflow: hidden;
    }
    .live-field-popover-pointer:after{
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: white;
      transform: rotate(-45deg);
      top: 85%;
      left: 0;
      box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.2);
    }
    .live-field-toggle-button{
      color: #245ec7;
      font-size: 0.8em;
      padding: 0.5em 0;
      outline: none;
      appearance: none;
      border: none;
      background: none;
    }
  `.split('}').map(x => x += "}").slice(0, -1),
  icons: {
    pencil: `
    <svg style="width: 1em; height: 1em;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
    <path d="M30.173 7.542l-0.314 0.314-5.726-5.729 0.313-0.313c0 0 1.371-1.813 3.321-1.813 0.859 0 1.832 0.353 2.849 1.37 3.354 3.354-0.443 6.171-0.443 6.171zM27.979 9.737l-19.499 19.506-8.48 2.757 2.756-8.485v-0.003h0.002l19.496-19.505 0.252 0.253zM2.76 29.239l4.237-1.219-2.894-3.082-1.343 4.301z"></path>
    </svg>
    `,
    alert: `
    <svg style="width: 1em; height: 1em; display:none; fill: red;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24">
    <g><path d="M3.5,22c-0.5,0-1-0.1-1.5-0.4c-1.4-0.8-1.9-2.7-1.1-4.1L9.4,3.3c0,0,0,0,0,0c0.2-0.4,0.6-0.8,1-1c0.7-0.4,1.5-0.5,2.3-0.3
    c0.8,0.2,1.4,0.7,1.9,1.4L23,17.5c0.3,0.5,0.4,1,0.4,1.5c0,0.8-0.3,1.6-0.9,2.1C22,21.7,21.3,22,20.5,22H3.5z M11.1,4.4L2.7,18.5
    c-0.3,0.5-0.1,1.1,0.4,1.4C3.2,20,3.4,20,3.5,20h16.9c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7c0-0.2,0-0.3-0.1-0.5L12.9,4.4
    C12.6,3.9,12,3.8,11.5,4C11.3,4.1,11.2,4.2,11.1,4.4z"/></g>
    <g><path d="M12,14c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v4C13,13.6,12.6,14,12,14z"/></g>
    <g><path d="M12,18c-0.3,0-0.5-0.1-0.7-0.3C11.1,17.5,11,17.3,11,17c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0
    c0.1,0.1,0.2,0.2,0.2,0.3c0,0.1,0.1,0.2,0.1,0.4s0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C12.5,17.9,12.3,18,12,18z"/></g>
    </svg>
    `
  }
})


const LiveSelectField = LiveField.extend({
  
  render_inputs (target) {
    let input;
    let options = this.selectOptions.map(option => {
      let value, label, selected;
      if(Array.isArray(option)){
        [value, label, selected] = option
        if(typeof selected == 'undefined') selected = target.get(this.attribute) == value
      } else {
        [value, label, selected] = [option, option.titleize(), target.get(this.attribute) == option]
      }
      return [value, label, selected]
    })
    
    if(this.split) {
      input = this.subView(LiveInput, {
        attribute: this.attribute,
        model: target,
        type: 'select',
        name: this.attribute,
        options: options
      }).el
      input = [input]
    } else {
      input = []
      options.forEach(option => {
        let [value, label, selected] = option;
        let button = this.subView(LiveInput, {
          attribute: this.attribute,
          model: target,
          type: 'button',
          class: scrubClass('live-field-button'),
          name: this.attribute,
          selected,
          value
        }).el
        button.innerHTML = label
        input.push(button)
      })
    }
    return input
  },
  
  check_hotkey(e) {
    if(e.type == "keyup" && e.key == "Enter" && (e.metaKey || e.shiftKey)){
      this.submit(e)
    }
    if(e.type == "keydown" && (e.key == "ArrowUp" || e.key == "ArrowDown")) {
      const direction = e.key == "ArrowUp" ? 'previousElementSibling' : 'nextElementSibling'
      const next = this.popover_container.querySelector('button:focus')[direction]
      if(next){
        next.focus()
        e.preventDefault();
      }
    }
  }
})

function scrubClass(string){
  return string.replace(/\live-field/g, LiveField.className);
}

export default LiveField