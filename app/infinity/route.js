import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Route.extend(InfinityRoute, {

  // perPageParam: "page[size]", // instead of "per_page"
  // pageParam: "page[number]", // instead of "page"
  totalPagesParam: "meta.total", // instead of "meta.total_pages"

  model() {
    return this.infinityModel("comment", {
      perPage: 10,
      startingPage: 1
    });
  },

  _loadNextPage() {
    this.set('_loadingMore', true);
    if (this.get('controller')) {
      this.get('controller').set('isLoadingMore', true);
    }

    return this._requestNextPage()
      .then((newObjects) => {
        this._nextPageLoaded(newObjects);

        return newObjects;
      })
      .finally(() => {
        this.set('_loadingMore', false);
        if (this.get('controller')) {
          this.get('controller').set('isLoadingMore', false);
        }
      });
  },

  _doUpdate(newObjects) {
    let infinityModel = this._infinityModel();
    console.log('_doUpdate >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    this.set('controller.isReady', false);

    return infinityModel.pushObjects(newObjects.get('content'));
  },

  infinityModelUpdated() {
    if (!this.get('scrollable')) {
      return;
    }

    this.resetScrollTop();
  },

  setScrollTop(top) {
    console.log(top);
    this.get('scrollable').scrollTop(top);
  },

  resetScrollTop() {

    this.get('scrollable').css({
      'overflow-y': 'hidden'
    });

    let scrollable = this.get('scrollable');

    let heightDiff = scrollable[0].scrollHeight - this.get('previousHeight');
    let newScrollTop = scrollable.scrollTop() + heightDiff;

    Ember.run.next(this, () => {

      console.log('resetScrollTop');

      Ember.run.next(this, this.setScrollTop, newScrollTop);

      this.set('previousHeight', scrollable[0].scrollHeight);

      this.get('scrollable').css({
        'overflow-y': 'scroll'
      });
      this.enableTrigger();
    });
  },

  enableTrigger() {
    Ember.run.later(this, () => {
      this.set('controller.isReady', true);
    }, 1000);
  },

  actions: {
    didTransition() {
      Ember.run.next(this, () => {
        this.set('scrollable', $("#content"));
        this.set('previousHeight', 0);
        this.resetScrollTop();
      });
    }
  }
});