const { take, tap, switchMap } = require("rxjs/operators");
const { email, password } = require("./auth");

const noop = () => {};

async function linkDroneWithMind(
  mind,
  { onLift = noop, onDrop = noop } = {}
) {
  await mind.login({ email, password });

  const lift$ = mind.kinesis("lift").pipe(
    take(1),
    tap((kinesis) => {
      console.log("lift", kinesis.confidence);
      onLift();
    })
  );

  const drop$ = mind.kinesis("drop").pipe(
    take(1),
    tap((kinesis) => {
      console.log("drop", kinesis.confidence);
      onDrop();
    })
  );

  lift$.pipe(switchMap(() => drop$)).subscribe();
}

module.exports = {
  linkDroneWithMind
};
