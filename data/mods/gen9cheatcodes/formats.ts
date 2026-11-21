import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen 9 NatDex] Ch34t C0d3z",
		desc: `The first letter of each Pokemon on your team, and each of their moves, form Codes that give your Pokemon and Team special effects.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3789229/">Smogon Thread</a>`,
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1x1Nz2d2M9EwlcvDzFvzSOKVo_mKHxP8p35a_h7zr-Os/">Codes Sheet</a>`,
			`&bullet; <a href="https://docs.google.com/spreadsheets/d/1x1Nz2d2M9EwlcvDzFvzSOKVo_mKHxP8p35a_h7zr-Os/edit?gid=1258363109#gid=1258363109">Sample Sets</a>`,
		],
		mod: 'gen9cheatcodes',
		debug: true,
		ruleset: ['Standard NatDex', 'Terastal Clause', 'CCV'],
		banlist: [
			'ND Uber', 'ND AG', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Assist', 'Baton Pass', 'Last Respects', 'Shed Tail'
		],
		onSwitchIn(pokemon) {
			const code = pokemon.m.codes;
			const CodeInfo: { [code: string]: import('./scripts').CodeDetails } = require('./codes-info.json');

			if (code['team'] && !pokemon.volatiles[code['team']]) pokemon.addVolatile(code['team']);

			if (code['set'] && !pokemon.volatiles[code['set']]) {
				const c = CodeInfo[code['set']];
				if (!c) {
					this.add(`raw|<div class="broadcast-red"><b>${pokemon.baseSpecies.name}'s code "${code['set']}" has malformed data. Discarding.</b></div>`);
					delete code['set'];
				};
				if (c.banlist?.includes(pokemon.baseSpecies.id)) {
					this.debug(`Code ${code['set']} failed to activate: ${pokemon.baseSpecies.name} is banned from using it`);
					this.add(`raw|<div class="broadcast-red"><b>${pokemon.baseSpecies.name} is banned from using ${code['set']}.</b></div>`);
				} else {
					pokemon.addVolatile(code['set']);
					this.add('-ability', pokemon, `code: ${c.name}`);
					this.hint(`${c.name}: ${c.desc}`);
				}
			}

			if (code.effectCodes) {
				for (const effect of code.effectCodes) {
					if (pokemon.hasAbility(effect)) continue;
					pokemon.addVolatile(effect);
				}
			}

			if (pokemon.m.moddedTypes) {
				this.add('-start', pokemon, 'typechange', pokemon.getTypes(true, true).join('/'),
					'[silent]', '[from] format: Cheat Codes');
			}
		},
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
			const code = pokemon.m.codes;
			if (code['team']) pokemon.removeVolatile(code['team']);
			if (code['set']) pokemon.removeVolatile(code['set']);
		},
		onFaint(pokemon) {
			for (const innates of Object.keys(pokemon.volatiles).filter(i => i.startsWith('ability:'))) {
				const innateEffect = this.dex.conditions.get(innates) as Effect;
				this.singleEvent('End', innateEffect, null, pokemon);
			}
		},
	},
];
