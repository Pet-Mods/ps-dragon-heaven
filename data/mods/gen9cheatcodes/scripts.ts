export const CheatCodes = Dex.formats.get('gen9natdexch34tc0d3z');

export const TEAM_CODES = [
	'aaaaaa', 'ablaze', 'apples', 'aurora',
	'bees', 'block', 'bootie', 'bounty', 'bugsy',
	'coffee', 'crash',
	'drake',
	'enby', 'espeon', 'exequy',
	'fluffy', 'four',
	'gitgud',
	// H
	'iron',
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
	'tear', 'tracks',
	// U
	'victor',
	'wizard',
	// X
	// Y
	'zekrom', 'zigzag',
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
	'trap', 'tune',
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

/** Prevents duplicated moves/abilities/species based on codes and brought team. */
export function validateCodes(team: PokemonSet[], dex: ModdedDex): string[] {
	const problems: string[] = [];

	const teamCode = team.map(set => (set.name || set.species).charAt(0).toLowerCase()).join();
	const activeTeamCode = TEAM_CODES.includes(teamCode) ? teamCode : null;
	const givenSpecies = activeTeamCode && BONUS_POKEMON_CODES[activeTeamCode]?.species;
	const otherMoveEffect: { [k: string]: string[] } = {
		'victor': ['vcreate'],
		'wizard': ['magiccoat', 'magicpowder', 'magicroom'],
	};

	for (const set of team) {
		const name = set.name || set.species;
		const setCode = set.moves.map(m => dex.toID(m).charAt(0)).join();
		const activeSetCode = SET_CODES.includes(setCode) ? setCode : null;

		// Pokemon granted by team code
		if (givenSpecies && dex.species.get(set.species).id === dex.species.get(givenSpecies).id) {
			problems.push(`${name} is ${dex.species.get(givenSpecies).name}, which is granted by the team code ${activeTeamCode!.toUpperCase()}.`);
		}

		// Moves via set code and abilities via set or team code
		for (const [type, code] of [['team', activeTeamCode], ['set', activeSetCode]] as const) {
			if (!code) continue;

			const move = dex.moves.get(BONUS_MOVE_CODES[code]);
			if (move && set.moves.some(m => dex.toID(m) === move.id)) {
				problems.push(`${name} has ${move.name}, which is granted by the ${type} code ${code.toUpperCase()}.`);
			}
			// Effects that give moves, but not in the prebuilt way
			const offendingMove = set.moves.some(m => otherMoveEffect[teamCode].includes(dex.toID(m)));
			if (offendingMove) {
				problems.push(`${name} has ${offendingMove}, which is granted by the team code ${teamCode}.`);
			}

			const ability = dex.abilities.get(BONUS_ABILITY_CODES[code]);
			if (ability && toID(set.ability) === ability.id) {
				problems.push(`${name} has ${ability.name}, which is granted by the ${type} code ${code.toUpperCase()}.`);
			}
		}
	}

	return problems;
}

/** Debugging function: A cheat code has activated. */
export function activateCode(b: Battle, n: string, p: string, s?: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.debug(`${p}'s ${s ? `${s.name}'s set` : `team`} code activated: ${c.name}: ${c.shortDesc || c.desc}`);
}

/** Disable a set or team code */
export function disableCode(b: Battle, t: 'set' | 'team', s?: Side, p?: Pokemon) {
	switch (t) {
		case 'team':
			if (!s) throw new Error(`'team' disableCode passed no Side`);
			b.debug(`${s.name}'s team code '${s.pokemon[0].m.teamCode.toUpperCase()}' cleared.`);
			for (const p of s.pokemon) {
				delete p.m.teamCode;
			};
			break;
		case 'set':
			if (!p) throw new Error(`'set' disableCode passed no Pokemon`);
			b.debug(`${p.name}'s set code '${p.m.setCode.toUpperCase()}' cleared.`);
			delete p.m.setCode;
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

				// prepare innates and effects as string[] so we can .push()
				pokemon.m.innates = [];
				pokemon.m.effects = [];
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
				case 'noclip':
					for (const p of side.pokemon) {
						p.m.effects.push('noclip');
					}
					break;
				case 'survey':
					for (const p of side.pokemon) {
						p.m.effects.push('survey');
					}
					disableCode(this, 'team', side.foe);
					break;
				case 'tracks':
					for (const p of side.pokemon) {
						p.m.effects.push('tracks');
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

				case 'gofish':
					const pairs = Object.values(
						side.pokemon.flatMap(pokemon => pokemon.baseSpecies.types)
							.reduce((counts, type) => {
								counts[type] = (counts[type] || 0) + 1;
								return counts;
							}, {} as {[type: string]: number})
						).reduce((sum, count) => sum + Math.floor(count / 2), 0);
					for (const pokemon of side.pokemon) {
						pokemon.m.gofishBoost = pairs;
					}
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

				case 'quetta': {
					const boosted = new WeakSet<Species>();
					const boost = (species: Species): Species => {
						const clone = this.dex.deepClone(species);
						for (const stat of ['atk', 'def', 'spa', 'spd', 'spe'] as const) clone.baseStats[stat] += 20;
						boosted.add(clone);
						return clone;
					};
				
					for (const pokemon of side.pokemon) {
						pokemon.set.item = '';
						pokemon.canMegaEvo = false;

						const base = this.dex.species.get(pokemon.baseSpecies.baseSpecies);
						const eligible = new Set<string>([pokemon.baseSpecies.name]);
						for (const forme of base.otherFormes || []) {
							if (this.dex.species.get(forme).battleOnly) eligible.add(forme);
						}

						const originalSetSpecies = pokemon.setSpecies.bind(pokemon);
						pokemon.setSpecies = (rawSpecies, ...rest) => originalSetSpecies(
							eligible.has(rawSpecies.name) && !boosted.has(rawSpecies) ? boost(rawSpecies) : rawSpecies,
							...rest
						);

						pokemon.setSpecies(pokemon.baseSpecies);
					}
					break;
				}

				case 'wizard':
					const moves = ['magiccoat', 'magicpowder', 'magicroom'];
					for (const pokemon of side.pokemon) {
						for (const move of moves.map(m => this.dex.moves.get(m))) {
							pokemon.moveSlots[pokemon.moveSlots.length] =
							pokemon.baseMoveSlots[pokemon.baseMoveSlots.length] = {
								id: move.id,
								move: move.name,
								pp: this.calculatePP(move),
								maxpp: this.calculatePP(move),
								disabled: false,
								used: false,
							};
						};
					};
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
				pokemon.moveSlots[pokemon.moveSlots.length] =
				pokemon.baseMoveSlots[pokemon.baseMoveSlots.length] = {
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
