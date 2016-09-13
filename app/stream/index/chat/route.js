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

    let stream = this.modelFor('stream.index');

    controller.setProperties({
      stream: stream,
      comments: model
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