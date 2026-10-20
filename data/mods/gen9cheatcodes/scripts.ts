export const TEAM_CODES = [
	// A
	// B
	// C
	// D
	// E
	'four',
	// G
	// H
	// I
	// J
	// K
	// L
	// M
	// N
	// O
	// P
	// Q
	// R
	'spooky',
	// T
	// U
	// V
	// W
	// X
	// Y
	// Z
];
export const SET_CODES = [
	'alt',
	'burn',
	'chip',
	'debt',
	// E
	'fast', 'fest', 'fish',
	'go',
	// H
	// I
	// J
	// K
	// L
	'monk',
	// N
	// O
	'paid', 'pika',
	// Q
	// R
	'stab',
	// T
	// U
	// V
	// W
	// X
	// Y
	// Z
];
const BONUS_POKEMON_CODES: { [k: string]: PokemonSet } = {
	'apples': {
		name: "Appletunfan's Child",
		species: 'Appletun',
		item: '',
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
};
const BONUS_MOVE_CODES: { [k: string]: string } = {
	'eggs': 'softboiled',
	'fest': 'celebrate',
	'paid': 'makeitrain',
	'pika': 'volttackle',
};
const BONUS_ABILITY_CODES: { [k: string]: string } = {
	'debt': 'neutralizinggas',
	'monk': 'gorillatactics',
};

/** battle, code name */
export function announceCode(b: Battle, n: string, p: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.add('-ability', p, `code: ${c.name}`);
	b.hint(`${c.name}: ${c.desc}`);
}

/** battle, code name, player name, pokemon name (for set codes) */
export function activateCode(b: Battle, n: string, p: string, s?: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.debug(`${p}'s ${s ? `${s.name}'s set` : `team`} code activated: ${c.name}: ${c.shortDesc || c.desc}`);
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

		/** 
		 * CHEAT CODES
		 * 
		 * Each code is lowercase alphabetical and set to
		 * either setCode or teamCode in each Pokemon's
		 * .m properties. Some codes trigger on battle
		 * start, and take place immediately after preparing
		 * each side's codes.
		 */

		// Gather and activate codes
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
			};
		};

		// Run script-reliant codes. Alphabetized.

		// Team codes (read from slot 0)

		for (const side of this.sides) {
			const teamCode = side.pokemon[0].m.teamCode;

			// Codes that give you an extra Pokemon
			if (BONUS_POKEMON_CODES[teamCode]) {
				side.addPokemon(BONUS_POKEMON_CODES[teamCode]);
			}
			if (teamCode === 'four') {
				if (side.foe.pokemon.length > 4) side.pokemon.splice(4, side.pokemon.length - 4);
			}
		}

		// Set codes

		// Codes that give you an extra Ability or move
		for (const pokemon of this.getAllPokemon()) {
			pokemon.m.innates = [];
			if (BONUS_MOVE_CODES[pokemon.m.setCode]) {
				const move = this.dex.moves.get(BONUS_MOVE_CODES[pokemon.m.setCode]);
				pokemon.moveSlots[4] = pokemon.baseMoveSlots[4] = {
					id: move.id,
					move: move.name,
					pp: move.pp,
					maxpp: move.pp * 8 / 5,
					disabled: false,
					used: false,
				};
			};
			if (BONUS_ABILITY_CODES[pokemon.m.setCode]) {
				pokemon.m.innates.push(BONUS_ABILITY_CODES[pokemon.m.setCode]);
			};
		}

		// Wrap up and begin battle
		this.runPickTeam();
		this.queue.addChoice({ choice: 'start' });
		this.midTurn = true;
		if (!this.requestState) this.turnLoop();
	},
};
