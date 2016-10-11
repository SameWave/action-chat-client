import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';

const {
  Controller,
  inject: {
    service
  },
  $,
  run,
  A,
  Object
} = Ember;

export default Controller.extend(SwipableListMixin, {
  session: service(),

  sortFinishText: null,
  goals: A([
    Object.create({
      id: '1',
      title: 'FLUMBO',
      date: 'Sun Oct 28 1990 21:51:54 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '2',
      title: 'PANZENT',
      date: 'Thu Dec 20 1973 09:10:57 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '3',
      title: 'VOIPA',
      date: 'Sat Dec 23 2006 02:28:43 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '4',
      title: 'SPACEWAX',
      date: 'Tue Jun 26 1979 21:21:31 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '5',
      title: 'PERMADYNE',
      date: 'Wed Oct 13 2004 11:29:51 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '6',
      title: 'ZYTRAC',
      date: 'Thu Aug 26 1976 02:50:50 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '7',
      title: 'CHORIZON',
      date: 'Mon Oct 13 2008 14:38:09 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '8',
      title: 'RODEOMAD',
      date: 'Fri May 18 2012 01:06:03 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '9',
      title: 'QUADEEBO',
      date: 'Sat Jul 09 1977 17:49:39 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '10',
      title: 'BEDLAM',
      date: 'Sun Jan 10 1982 02:42:46 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '11',
      title: 'BEDLAM X',
      date: 'Sun Jan 10 1982 02:42:46 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '12',
      title: 'BEDLAM XX',
      date: 'Sun Jan 10 1982 02:42:46 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '13',
      title: 'BEDLAM XXX',
      date: 'Sun Jan 10 1982 02:42:46 GMT+0000 (UTC)'
    }),
    Object.create({
      id: '14',
      title: 'BEDLAM XXXX',
      date: 'Sun Jan 10 1982 02:42:46 GMT+0000 (UTC)'
    })
  ]),

  dragulaConfig: {
    options: {
      copy: false,
      revertOnSpill: true,
      removeOnSpill: false,
      moves(el, source, handle, sibling) {
        // this._super(...arguments);
        return true;
      },
      invalid(el, handle) {
        // TODO: improve this as it is very brittle
        if (handle.parentElement.parentElement.dataset.drag === 'handle' || handle.dataset.drag === 'handle' || handle.parentElement.dataset.drag === 'handle') {
          return false;
        } else {
          return true;
        }
      }
    },
    enabledEvents: []
  },

  timer: null,

  actions: {

    goToStreamEditScoreboard() {
      console.log('Goto stream edit scoreboard');
    },

    deleteGoal(goal) {
      console.log('goal.destroyRecord()');
    }
  }
});