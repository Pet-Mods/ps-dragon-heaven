# CHEAT CODES
by iforgetwhyimhere (programmer) and zxgzxg (organizer)

## HOW CODES WORK (and adding new ones)

List of codes is `const TEAM_CODES` or `const SET_CODES` in `scripts.ts`. You MUST update it to add new codes.
Additionally, for codes that add moves, abilities, or pokemon, ensure their code corresponds to their added element in the following constants:
`BONUS_POKEMON_CODES` (team only), `BONUS_MOVE_CODES` (set only), `BONUS_ABILITY_CODES` (both set and team).
When the battle starts, each team and team's pokemon are assigned their code, if possible. Each code must have a corresponding condition in `conditions.ts`.

When your set activates, ensure you call the `activateCode` function before returning:
```ts
activateCode(this, pokemon.m.setCode, [source or target].side.name, [source or target]);
```
If you have a shortDesc, it will prefer it to the desc when printing.

When activating a team code's effect, do not add a fourth argument.

A team and set code are stored in each Pokemon as `pokemon.m.teamCode` and `pokemon.m.setCode`. Do not ever change them.

Useful debugging codes when in-battle:
`>>> Object.keys(p1.active[0].volatiles)` <- Check if codes are active
`>>> p1.active[0].m.<property>` <- Read a pokemon's .m property
.m properties: `innates` (extra abilities), `setCode` and `teamCode` (codes), `codeGenerated` (species from a code)
