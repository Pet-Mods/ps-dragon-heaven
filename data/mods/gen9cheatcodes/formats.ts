import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen 9 NatDex] Ch34t C0d3z",
		desc: `The first letter of each Pokemon on your team, and each of their moves, form Codes that give your Pokemon and Team special effects.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3789229/">Smogon Thread</a>`,
		],
		mod: 'gen9cheatcodes',
		debug: true,
		ruleset: ['Obtainable', 'NatDex Mod', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod', 'Terastal Clause', 'Overflow Stat Mod', 'Team Preview'],
		onSwitchIn(pokemon) {
			const code = pokemon.m;
			// DO NOT EVER SET THESE TO INVALID CONDITIONS
			if (code.teamCode && !pokemon.volatiles[code.teamCode]) pokemon.addVolatile(code.teamCode);
			if (code.setCode && !pokemon.volatiles[code.setCode]) {
				pokemon.addVolatile(code.setCode);
				
				const c = this.dex.conditions.get(code.setCode);
				this.add('-ability', pokemon, `code: ${c.name}`);
				this.hint(`${c.name}: ${c.desc}`);
			};
			// effect of team code SURVEY
			if (code.surveyed) {
				const name = pokemon.species.name;
				const item = pokemon.set.item ? this.dex.items.get(pokemon.set.item).name : `No Item ${code.teamCode === 'quetta' ? '(Removed by QUETTA)' : ''}`;
				const moves = pokemon.set.moves
					.map(m => `- ${this.dex.moves.get(m).name}`)
					.join('<br />');

				this.add('html',`<details><summary>Set for ${name}:</summary>Item: ${item}<br />Moves:<br />${moves}</details>`);
			};
		},
		// pokebilities adjacent bs, for codes that add abilities
		onBeforeSwitchIn(pokemon) {
			if (pokemon.m.innates) {
				for (const innates of pokemon.m.innates) {
					if (pokemon.hasAbility(innates)) continue;
					const effect = 'ability:' + this.toID(innates);
					pokemon.volatiles[effect] = this.initEffectState({ id: effect, target: pokemon });
				}
			}
		},
		onSwitchOut(pokemon) {
			for (const innates of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				pokemon.removeVolatile(innates);
			}
			const c = pokemon.m;
			if (c.teamCode) pokemon.removeVolatile(c.teamCode);
			if (c.setCode) pokemon.removeVolatile(c.setCode);
		},
		onFaint(pokemon) {
			for (const innates of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innates) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
	},
];
