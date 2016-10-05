import Ember from 'ember';
import MediaBlockComponent from '../component';

export default MediaBlockComponent.extend({
  classNames: ['c-media-block--goal'],

  actions: {
    deleteGoal() {
      if (this.get('onDeleteGoal')) {
        this.get('onDeleteGoal')(this);
      }
    }
  }
});