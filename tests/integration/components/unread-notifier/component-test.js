import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('unread-notifier', 'Integration | Component | unread notifier', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{unread-notifier}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#unread-notifier}}
      template block text
    {{/unread-notifier}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
