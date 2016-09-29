import Ember from 'ember';

const {
  Controller,
  inject: {
    service
  }
} = Ember;

export default Controller.extend({
  session: service(),

  sortFinishText: null,
  goals: Ember.A([
    {
      id: '1',
      title: 'FLUMBO',
      date: 'Sun Oct 28 1990 21:51:54 GMT+0000 (UTC)'
    },
    {
      id: '2',
      title: 'PANZENT',
      date: 'Thu Dec 20 1973 09:10:57 GMT+0000 (UTC)'
    },
    {
      id: '3',
      title: 'VOIPA',
      date: 'Sat Dec 23 2006 02:28:43 GMT+0000 (UTC)'
    },
    {
      id: '4',
      title: 'SPACEWAX',
      date: 'Tue Jun 26 1979 21:21:31 GMT+0000 (UTC)'
    },
    {
      id: '5',
      title: 'PERMADYNE',
      date: 'Wed Oct 13 2004 11:29:51 GMT+0000 (UTC)'
    },
    {
      id: '6',
      title: 'ZYTRAC',
      date: 'Thu Aug 26 1976 02:50:50 GMT+0000 (UTC)'
    },
    {
      id: '7',
      title: 'CHORIZON',
      date: 'Mon Oct 13 2008 14:38:09 GMT+0000 (UTC)'
    },
    {
      id: '8',
      title: 'RODEOMAD',
      date: 'Fri May 18 2012 01:06:03 GMT+0000 (UTC)'
    },
    {
      id: '9',
      title: 'QUADEEBO',
      date: 'Sat Jul 09 1977 17:49:39 GMT+0000 (UTC)'
    },
    {
      id: '10',
      title: 'BEDLAM',
      date: 'Sun Jan 10 1982 02:42:46 GMT+0000 (UTC)'
    }
  ]),

  dragulaconfig: {
    options: {
      copy: false,
      revertOnSpill: false,
      removeOnSpill: false

        // Other options from the dragula source page.
    },
    enabledEvents: ['drag', 'drop']
  },

  actions: {
    dragStart(o) {
      console.log(`Drag start: ${o}`);
    },

    sortEndAction(e) {
      console.log('sortEndAction', this.get('goals'));
    },

    setStatus(post, ops) {
      console.log(`post: ${post}
        ops: ${ops}`);
    }
  }
});