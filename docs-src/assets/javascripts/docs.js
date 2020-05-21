import LiveField from 'viking-live-field';

hljs.initHighlightingOnLoad();

const Account = Viking.Model.extend('account', {
  inheritanceAttribute: false
})
const AccountCollection = Viking.Collection.extend({
  model: Account
})

const record1 = new Account({
  name: 'Ben Ehmke',
  nickname: 'bemky',
  rate: '25',
  currency: 'USD',
  type: 'programmer'
})
const record2 = new Account({
  name: 'Jerry',
  rate: '25',
  currency: 'USD',
  type: 'programmer'
})
const record3 = new Account({
  name: 'Mike',
  rate: '25',
  currency: 'USD',
  type: 'programmer'
})
const collection = new AccountCollection([record1, record2, record3])



document.getElementById('basic').prepend((new LiveField({
  target: record1,
  attribute: 'name'
})).render().el)

document.getElementById('select').prepend((new LiveField({
  target: record1,
  attribute: 'status',
  type: 'select',
  options: ['a', 'b', 'c']
})).render().el)

document.getElementById('rendering').prepend((new LiveField({
  target: record1,
  attribute: 'nickname',
  render: (v, target) => `${v} / ${v.toUpperCase()}`
})).render().el)

document.getElementById('multiple-inputs').prepend((new LiveField({
  target: record1,
  attribute: 'rate',
  render: (v, target) => `${target.first().get('currency')} ${v}`,
  inputs: [
      {
          type: 'number',
          attribute: 'rate'
      }, {
          type: 'select',
          attribute: 'currency',
          options: ['USD', 'EUR', 'BTC']
      }
  ]
})).render().el)

document.getElementById('js-collections').prepend((new LiveField({
  target: collection,
  attribute: 'type',
  type: 'select',
  options: ['programmer', 'manager', 'principle'],
  render: v => v.titleize(),
  labels: {
    record: record => record.get('name')
  }
})).render().el)