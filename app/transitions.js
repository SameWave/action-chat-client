export default function() {
  this.transition(
    this.fromRoute('streams'),
    this.toRoute('stream.index.loading'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}