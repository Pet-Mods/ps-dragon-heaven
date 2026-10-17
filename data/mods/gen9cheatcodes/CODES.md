# HOW CODES WORK (and adding new ones)

List of codes is `const TEAM_CODES` or `const SET_CODES` in `scripts.ts`. You MUST update it to add new codes.
When the battle starts, each team and team's pokemon are assigned their code, if possible. Each code must have a corresponding condition in `conditions.ts`.

In conditions, when making the condition, make sure it calls onStart as such (additional code here can be used):
```ts
onStart() {
	announceCode(this, 'your condition ID here');
},
```
This will ensure the condition is printed to the battle.

When your (set) code activates, ensure you use this before returning:
```ts
activateCode(this, 'your condition ID here', source.side.name);
```
If you have a shortDesc, it will prefer it to the desc.

A team and set code are stored in each Pokemon as `pokemon.m.teamCode` and `pokemon.m.setCode`. Do not ever change them.
