import Ember from 'ember';

export default Ember.Component.extend({

  elementId: 'content',
  classNames: 'infinity-content',
  classNameBindings: ['isLoadingMore']

  // didUpdate() {
  //   console.log('didUpdate!!');
  //   console.log(this.get('sortedComments.length'));
  // },

  // didRender() {
  //   this._super(...arguments);
  //   console.log('didRender!!');
  //   console.log(this.get('sortedComments.length'));
  // }

});