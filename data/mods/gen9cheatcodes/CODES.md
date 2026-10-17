# HOW CODES WORK (and adding new ones)

List of codes is `const TEAM_CODES` or `const SET_CODES` in `scripts.ts`. You MUST update it to add new codes.
When the battle starts, each team and team's pokemon are assigned their code, if possible. Each code must have a corresponding condition in `conditions.ts`.

In conditions, when making the condition, if it is a set, make sure it calls onStart as such (additional code here can be used):
```ts
onStart(pokemon) {
	announceCode(this, pokemon.m.setCode, pokemon);
},
```
This will ensure the condition is printed to the battle.

When it activates, ensure you use this before returning:
```ts
activateCode(this, pokemon.m.setCode, [source or target].side.name, [source or target]);
```
If you have a shortDesc, it will prefer it to the desc.

When activating a team code's effect, do not add a fourth argument.

A team and set code are stored in each Pokemon as `pokemon.m.teamCode` and `pokemon.m.setCode`. Do not ever change them.

Never call `announceCode` on a team's code.
