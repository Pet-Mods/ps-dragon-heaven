import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen 9 NatDex] Ch34t C0d3z",
		desc: `cheating in a kids game`,
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
				// copy of announceCode so it doesn't have to run in onStart every time
				const c = this.dex.conditions.get(code.setCode);
				this.add('-ability', pokemon, `code: ${c.name}`);
				this.hint(`${c.name}: ${c.desc}`);
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
		},
		onFaint(pokemon) {
			for (const innates of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innates) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
	},
];
