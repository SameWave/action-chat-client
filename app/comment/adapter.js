import ApplicationAdapter from 'action-chat-client/application/adapter';

export default ApplicationAdapter.extend({
  generateIdForRecord() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0;
      let v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
});