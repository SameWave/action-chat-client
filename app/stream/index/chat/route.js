import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  model(params) {
    let stream = this.modelFor('stream.index');

    return this.store.query('comment', {
      page: {
        number: params.page,
        size: params.size
      },
      stream_id: stream.get('id'),
    });
  },

  setupController(controller, model) {
    if (controller.get('isLoadingEarlier')) {
      controller.send('doneLoadingEarlier');
    }

    controller.setProperties({
      comments: model,
      stream: this.modelFor('stream.index')
    });
  },

  queryParams: {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    }
  }
});