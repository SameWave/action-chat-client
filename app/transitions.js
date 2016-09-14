export default function() {
  this.transition(
    this.fromRoute('stream.index.chat'),
    this.toRoute('stream.index.scoreboard'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}