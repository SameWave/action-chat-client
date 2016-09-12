export default function() {
  this.transition(
    this.fromRoute('stream.chat'),
    this.toRoute('stream.scoreboard'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}