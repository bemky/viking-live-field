# Viking/LiveField

**Docs:** https://bemky.github.io/viking-live-field/

### Installation
    npm install viking-live-field

```javascript
new LiveField({
    target: model,
    attribute: 'name'
})
````

### Dependencies
    viking
    uniform
    dolla

### Options
Attribute | Type | Notes
--------- | ---- | -----
`target` |`Viking.Model / Viking.Collection` |
`attribute` |`string` |
`render` |`(value, target) => html` |Render value for display
`type` |`string` |text, date, duration, select, multi_select
`save` |`boolean` |to use .set(attrs) or .save(attrs). Defaults to typeof target.id !== undefined
`container` |`string/Element` |Passed to Uniform.Popover. Determines where Popover is appended. Useful when overflow and positioning issues.
`inputs` |`[]` | target => Element |array of objects or a function that returns elements to append. See Multiple Inputs below
`labels` |`{}` |Set language used in rendering form
`labels.title` |`target => text` |HTML for top of popover
`labels.unset` |`string` | HTML used for rendering when value is undefined
`labels.record` |`string / record => text` |HTML for labe of each record when split by record. See Collections
`labels.split` |`string / record => text` |Text for "Split by ____". See Collections

### Development
Docs built using Middleman, asset pipeline by Condenser

    bundle
    bundle exec middleman server