import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen 9 NatDex] Ch34t C0d3z",
		desc: `The first letter of each Pokemon on your team, and each of their moves, form Codes that give your Pokemon and Team special effects.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3789229/">Smogon Thread</a>`,
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1x1Nz2d2M9EwlcvDzFvzSOKVo_mKHxP8p35a_h7zr-Os/">Codes Sheet</a>`,
		],
		mod: 'gen9cheatcodes',
		debug: true,
		ruleset: ['Standard NatDex', 'Terastal Clause'],
		banlist: [
			'ND Uber', 'ND AG', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Assist', 'Baton Pass', 'Last Respects', 'Shed Tail'
		],
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
			
			for (const effect of code.effects) { 
				pokemon.addVolatile(effect);
			}
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
