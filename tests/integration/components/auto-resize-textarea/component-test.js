import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auto-resize-textarea', 'Integration | Component | auto resize textarea', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{auto-resize-textarea}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#auto-resize-textarea}}
      template block text
    {{/auto-resize-textarea}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
