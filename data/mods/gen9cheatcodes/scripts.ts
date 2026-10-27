export const CheatCodes = Dex.formats.get('gen9natdexch34tc0d3z');

export const TEAM_CODES = [
	'aaaaaa', 'ablaze', 'apples', 'aurora',
	'bees', 'block', 'bootie', 'bounty', 'bugsy',
	'coffee', 'crash',
	'drake',
	'enby', 'espeon', 'exequy',
	'fluffy', 'four',
	'gitgud', /* 'gofish', */
	// H
	/* 'i', */ 'iron',
	// J
	// K
	// L
	// M
	'neuter', 'noclip',
	// O
	'pride',
	'quetta',
	// R
	'spikes', 'shower', 'spooky', 'survey',
	// T
	// U
	// V
	// W
	// X
	// Y
	// Z
]
export const SET_CODES = [
	'alt',
	'burn',
	'card', 'chip',
	'debt',
	'eggs',
	'fast', 'fest', 'fish',
	'gene', 'go', 'gold',
	'heal',
	// I
	// J
	// K
	'lazy', 'lets', 'life', 'luck',
	'mega', 'moms', 'monk',
	'nuke',
	'okay',
	'paid', 'pika',
	// Q
	'rise',
	'stab', 'star',
	'tune',
	// U
	// V
	'warp', 'waxy', 'wind', 'what',
	'x',
	// Y
	// Z
]

const BONUS_POKEMON_CODES: { [k: string]: PokemonSet } = {
	'apples': {
		name: "Appletunfans Child",
		species: 'Appletun',
		item: 'Leftovers',
		ability: 'Parental Bond',
		moves: [
			'Apple Acid',
			'Dragon Pulse',
			'Leech Seed',
			'Recover',
		],
		nature: 'Bold',
		gender: 'M',
		evs: { hp: 248, atk: 0, def: 252, spa: 0, spd: 8, spe: 0 },
		ivs: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 },
		level: 100,
	},
	'bugsy': {
		name: "Bugsy's Ledian",
		species: "Ledian",
		item: 'Life Orb',
		ability: 'Iron Fist',
		moves: [
			'U-turn',
			'Drain Punch',
			'Ice Punch',
			'Thunder Punch',
		],
		nature: 'Jolly',
		gender: 'M',
		evs: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		level: 100,
	},
	'pride': {
		name: "Pyroar-Midga",
		species: "Pyroar-Mega",
		item: 'Charcoal',
		ability: 'Fire Mane',
		moves: [
			'Fire Lash',
			'Fire Blast',
			'Hyper Voice',
			'Work Up',
		],
		nature: 'Naive',
		gender: 'N',
		evs: { hp: 0, atk: 128, def: 0, spa: 128, spd: 0, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		level: 100,
	},
}
const BONUS_MOVE_CODES: { [k: string]: string } = {
	'eggs': 'softboiled',
	'fest': 'celebrate',
	'paid': 'makeitrain',
	'pika': 'volttackle',
}
const BONUS_ABILITY_CODES: { [k: string]: string } = {
	// team
	'espeon': 'synchronize',
	'exequy': 'supremeoverlord',
	'fluffy': 'fluffy',
	'neuter': 'neutralizinggas',
	// set
	'debt': 'neutralizinggas',
	'gene': 'goodasgold',
	'lets': 'levitate',
	'moms': 'parentalbond',
	'monk': 'gorillatactics',
}

/** Debugging function: A cheat code has activated. */
export function activateCode(b: Battle, n: string, p: string, s?: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.debug(`${p}'s ${s ? `${s.name}'s set` : `team`} code activated: ${c.name}: ${c.shortDesc || c.desc}`);
}

/** Disable a set or team code */
export function disableCode(b: Battle, t: 'side' | 'team', s?: Side, p?: Pokemon) {
	switch (t) {
		case 'team':
			if (!s) throw new Error(`'team' disableCode passed no Side`);
			for (const p of s.pokemon) {
				delete p.m.teamCode;
			};
			b.debug(`${s.name}'s team code ${s.pokemon[0].m.teamCode.toUpperCase()} cleared.`);
			break;
		case 'side':
			if (!p) throw new Error(`'set' disableCode passed no Pokemon`);
			delete p.m.sideCode;
			b.debug(`${p.name}'s set code ${p.m.setCode.toUpperCase()} cleared.`);
			break;
		default:
			throw new Error(`Invalid code type passed to disableCode: ${t}`);
	}
}

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	pokemon: {
		ignoringAbility() {
			if (this.battle.gen >= 5 && !this.isActive) return true;

			// Certain Abilities won't activate while Transformed, even if they ordinarily couldn't be suppressed (e.g. Disguise)
			if (this.getAbility().flags['notransform'] && this.transformed) return true;
			if (this.getAbility().flags['cantsuppress']) return false;
			if (this.volatiles['gastroacid']) return true;

			// Check if any active pokemon have the ability Neutralizing Gas
			if (this.hasItem('Ability Shield') || this.m.innates?.includes('neutralizinggas') ||
				this.ability === ('neutralizinggas' as ID)) return false;
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if ((pokemon.m.innates?.includes('neutralizinggas') || pokemon.ability === ('neutralizinggas' as ID)) &&
					!pokemon.volatiles['gastroacid'] && !pokemon.transformed &&
					!pokemon.abilityState.ending && !this.volatiles['commanding']) {
					return true;
				}
			}

			return false;
		},
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
			ability = this.battle.toID(ability);
			return this.ability === ability || !!this.volatiles['ability:' + ability];
		},
	},
	field: {
		suppressingWeather() {
			for (const pokemon of this.battle.getAllActive()) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					(pokemon.getAbility().suppressWeather ||
						pokemon.m.innates?.some((k: string) => this.battle.dex.abilities.get(k).suppressWeather))) {
					return true;
				}
			}
			return false;
		},
	},

	start() {
		// Deserialized games should use restart()
		if (this.deserialized) return;
		// need all players to start
		if (!this.sides.every(side => !!side)) throw new Error(`Missing sides: ${this.sides}`);

		if (this.started) throw new Error(`Battle already started`);

		const format = this.format;
		this.started = true;
		if (this.gameType === 'multi') {
			this.sides[1].foe = this.sides[2]!;
			this.sides[0].foe = this.sides[3]!;
			this.sides[2]!.foe = this.sides[1];
			this.sides[3]!.foe = this.sides[0];
			this.sides[1].allySide = this.sides[3]!;
			this.sides[0].allySide = this.sides[2]!;
			this.sides[2]!.allySide = this.sides[0];
			this.sides[3]!.allySide = this.sides[1];
			// sync side conditions
			this.sides[2]!.sideConditions = this.sides[0].sideConditions;
			this.sides[3]!.sideConditions = this.sides[1].sideConditions;
		} else {
			this.sides[1].foe = this.sides[0];
			this.sides[0].foe = this.sides[1];
			if (this.sides.length > 2) { // ffa
				this.sides[2]!.foe = this.sides[3]!;
				this.sides[3]!.foe = this.sides[2]!;
			}
		}

		this.add('gen', this.gen);

		this.add('tier', format.name);
		if (this.rated) {
			if (this.rated === 'Rated battle') this.rated = true;
			this.add('rated', typeof this.rated === 'string' ? this.rated : '');
		}

		format.onBegin?.call(this);
		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			subFormat.onBegin?.call(this);
		}

		if (this.sides.some(side => !side.pokemon[0])) {
			throw new Error('Battle not started: A player has an empty team.');
		}

		if (this.debugMode) {
			this.checkEVBalance();
		}

		if (format.customRules) {
			const plural = format.customRules.length === 1 ? '' : 's';
			const open = format.customRules.length <= 5 ? ' open' : '';
			this.add(`raw|<div class="infobox"><details class="readmore"${open}><summary><strong>${format.customRules.length} custom rule${plural}:</strong></summary> ${format.customRules.join(', ')}</details></div>`);
		}

		// #region CHEAT CODES
		/* 
		 * Each code is lowercase alphabetical and set to either setCode or teamCode in each Pokemon's .m
		 * properties. Some codes trigger on battle start, and take place immediately after preparing each side's codes.
		 */

		// Prepare codes
		for (const side of this.sides) {
			const maybeCode = side.pokemon.map(p => p.name.charAt(0).toLowerCase()).join('');
			const code = TEAM_CODES.includes(maybeCode) ? maybeCode : null;
			if (code) {
				for (const pokemon of side.pokemon) {
					pokemon.m.teamCode = code;
				};
				this.add(`raw|<div class="broadcast-blue"><b>${side.name}'s team code: ${code.toUpperCase()}</b></div>`);
				this.hint(`${code.toUpperCase()}: ${this.dex.conditions.get(code).desc}`);
			} else {
				this.add(`raw|<div class="broadcast-red"><b>${side.name} has no team code.</b></div>`);
			};
			this.debug(`TEAM code for ${side.name}: '${maybeCode.toUpperCase()}' (${code ? '' : 'in'}valid)`);

			for (const pokemon of side.pokemon) {
				const maybeCode = pokemon.moveSlots.map(m => m.id.charAt(0)).join('');
				const code = SET_CODES.includes(maybeCode) ? maybeCode : null;
				if (code) pokemon.m.setCode = code;
				this.debug(`SET code for ${side.name}'s ${pokemon.name}: '${maybeCode.toUpperCase()}' (${code ? '' : 'in'}valid)`);

				// prepare innates as string[] so we can .push()
				pokemon.m.innates = [];
			};
		};

		// Team codes (read from slot 0)
		for (const side of this.sides) {
			const teamCode = side.pokemon[0].m.teamCode;
			const foeTeamCode = side.foe.pokemon[0].m.teamCode;

			// FOUR must run on opponent's code, so it escapes the switch
			switch (foeTeamCode) {
				case 'four':
					if (side.pokemon.length > 4) side.pokemon.splice(4, side.pokemon.length - 4);
					break;
				case 'survey':
					for (const p of side.pokemon) {
						// this is in onSwitchIn in the format data
						p.m.surveyed = true;
					}
					for (const p of side.foe.pokemon) {
						delete p.m.teamCode;
					}
					break;
			}

			// Codes that give you an extra Pokemon
			if (BONUS_POKEMON_CODES[teamCode]) {
				const codePkmn = side.addPokemon(BONUS_POKEMON_CODES[teamCode]);
				if (codePkmn) {
					codePkmn.m.codeGenerated = true;
					codePkmn.m.teamCode = teamCode;
					// ensure it gets surveyed as well
					if (side.pokemon[0].m.surveyed) codePkmn.m.surveyed = true;
				};
			}

			switch (teamCode) {

				case 'bugsy':
					const ledian = side.pokemon.find(p => p.m.codeGenerated);
					const [atkMon, defMon, spaMon, spdMon, hpSpeMon] = side.pokemon;
					if (!ledian || !atkMon || !defMon || !spaMon || !spdMon || !hpSpeMon) {
						// well shit
						throw new Error(`BUGSY code team generation failed`);
					};

					const stats = {
						atk: atkMon.baseStoredStats.atk,
						def: defMon.baseStoredStats.def,
						spa: spaMon.baseStoredStats.spa,
						spd: spdMon.baseStoredStats.spd,
						spe: hpSpeMon.baseStoredStats.spe,
					};
				
					let stat: StatIDExceptHP;
					for (stat in stats) {
						ledian.baseStoredStats[stat] = stats[stat];
						ledian.storedStats[stat] = stats[stat];
						if (ledian.modifiedStats) ledian.modifiedStats[stat] = stats[stat];
					}
					ledian.speed = ledian.storedStats.spe;
				
					// split hp since its qUIrkY
					ledian.baseMaxhp = hpSpeMon.baseMaxhp;
					ledian.maxhp = hpSpeMon.baseMaxhp;
					ledian.hp = ledian.maxhp;

					ledian.baseTypes = ['Bug', 'Fighting'];
					ledian.types = ['Bug', 'Fighting'];

					this.debug(ledian.side.name + ledian.name + `'s stats: ` +
						[ledian.hp, stats.atk, stats.def, stats.spa, stats.spd, stats.spe].join(', '));

					break;

				case 'pride':
					const pyroar = side.pokemon.find(p => p.m.codeGenerated);
					if (!pyroar) throw new Error(`PRIDE code team generation failed:`);
					const M = [];
					const F = [];
					for (const p of side.pokemon) {
						if (p.gender === 'M') M.push(p);
						if (p.gender === 'F') F.push(p);
					}
					const majority = M.length > F.length ? M : M.length < F.length ? F : null;
					if (!majority) return;
					for (const p of majority) {
						p.m.prideBoost = 1.1 + 0.1 * majority.length;
					}
					pyroar.m.prideBoost = 1.1 + 0.1 * majority.length;
					break;

				case 'shower':
					side.pokemon[5].m.innates.push('drizzle');
					break;

				case 'quetta':
					for (const pokemon of side.pokemon) {
						pokemon.clearItem();
					
						// Clone so the shared Species object isn't mutated
						const newSpecies = this.dex.deepClone(pokemon.species);
						let stat: StatIDExceptHP;
						// @ts-expect-error
						for (stat in newSpecies.baseStats) {
							// @ts-expect-error
							if (stat === 'hp') continue;
							newSpecies.baseStats[stat] += 20;
						}

						const stats = this.spreadModify(newSpecies.baseStats, pokemon.set);
						for (stat in pokemon.storedStats) {
							pokemon.storedStats[stat] = stats[stat];
							pokemon.baseStoredStats[stat] = stats[stat];
						}
						pokemon.species = newSpecies;
					}
					break;
				};

			// Codes that apply a bonus Ability to the entire team
			if (BONUS_ABILITY_CODES[teamCode]) {
				for (const pokemon of side.pokemon) {
					pokemon.m.innates.push(BONUS_ABILITY_CODES[teamCode]);
				};
			}
		}

		// Set codes

		// Codes that give you an extra Ability or move

		// Some codes have extra effects, so they can't
		// be cleared here.
		for (const pokemon of this.getAllPokemon()) {
			const setCode = pokemon.m.setCode;
			if (BONUS_MOVE_CODES[setCode]) {
				const move = this.dex.moves.get(BONUS_MOVE_CODES[setCode]);
				pokemon.moveSlots[pokemon.moveSlots.length] = pokemon.baseMoveSlots[pokemon.baseMoveSlots.length] = {
					id: move.id,
					move: move.name,
					pp: this.calculatePP(move),
					maxpp: this.calculatePP(move),
					disabled: false,
					used: false,
				};
			};
			if (BONUS_ABILITY_CODES[setCode]) {
				pokemon.m.innates.push(BONUS_ABILITY_CODES[setCode]);
			};
		}

		// #endregion

		// Wrap up and begin battle
		this.runPickTeam();
		this.queue.addChoice({ choice: 'start' });
		this.midTurn = true;
		if (!this.requestState) this.turnLoop();
	},
};
