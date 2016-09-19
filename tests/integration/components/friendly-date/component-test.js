import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

moduleForComponent('friendly-date', 'Integration | Component | friendly date', {
  integration: true
});

test('it renders', function(assert) {
  this.set('testDate', moment('2016-11-19 08:30'));
  this.render(hbs`{{friendly-date date=testDate isLocal=true}}`);

  assert.equal(this.$().text().trim(), '08:30');
});
