/* global $ */
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auto-resize-textarea', 'Integration | Component | auto resize textarea', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('text', '');

  this.render(hbs `{{auto-resize-textarea value=text}}`);

  let textArea = $('.c-auto-resize-textarea');
  let dummyText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui veritatis commodi eaque nisi fugit, eius recusandae quidem deserunt ipsum rem quas a molestiae vitae tenetur debitis laboriosam aliquam velit. At corporis harum accusamus cupiditate, dolorem sequi eum! Accusantium ex et quaerat nostrum ipsa quo iusto doloribus qui sapiente ratione, nulla pariatur ad. Voluptas fugiat, officiis explicabo est optio quam temporibus excepturi recusandae quia fugit minus quis cumque illum perspiciatis magnam, aliquid delectus nostrum neque mollitia modi voluptatem, numquam esse. Facilis similique eum assumenda omnis sunt impedit deleniti nam vel animi optio nisi earum quisquam, id, minus nesciunt, molestiae. Obcaecati vel corporis recusandae magni pariatur repellat excepturi officiis, praesentium, illum iusto quod perspiciatis dolorem similique impedit reprehenderit, incidunt dolorum velit aspernatur unde nostrum. Porro nemo quod eligendi accusamus animi perspiciatis. Nulla esse quaerat recusandae debitis aut, at corrupti nam pariatur vel animi voluptatem, nihil quae, accusamus illo saepe quibusdam? Placeat deleniti quibusdam non fugiat fuga voluptates quam vero est possimus quo nisi facere culpa et animi, nemo commodi atque sed aperiam minima debitis fugit incidunt! Aspernatur ipsam veniam tempore temporibus quis mollitia optio perspiciatis soluta perferendis veritatis, beatae odio nam ipsum porro labore ducimus deleniti, accusantium repellendus totam. Sint, praesentium, expedita?';

  textArea.css({
    'width': 100
  });

  assert.equal(textArea.val().trim(), '');

  this.set('text', dummyText);

  assert.equal(textArea.val().trim(), dummyText);
});