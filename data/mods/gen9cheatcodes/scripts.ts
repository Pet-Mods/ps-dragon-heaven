export const CheatCodes = Dex.formats.get('gen9natdexch34tc0d3z');

export interface CodeDetails {
	id: ID,
	name: string,
	desc: string,
	type: 'set' | 'team',
	behavior?: 'pokemon' | 'ability' | 'move' | 'unique',
	effectDetails?: string,
	banlist?: string[],
}
export const CodeInfo: { [code: string]: CodeDetails } = require('./codes-info.json');

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
	'fam': 'parentalbond',
	'gold': 'goodasgold',
	'lets': 'levitate',
	'monk': 'gorillatactics',
}
const BONUS_TYPE_CODES: { [c: string]: string } = {
	// set
	'fish': 'Water',
	'paid': 'Steel',
	// team
	'espeon': 'Psychic',
	'spooky': 'Ghost',
};

function codesOfType(type: 'set' | 'team'): string[] {
	if (!(type === 'set' || type === 'team')) throw new Error(`invalid type ${type} passed to codesOfType`);
	return Object.keys(CodeInfo).filter(id => CodeInfo[id].type === type);
}

/** Rebuild a Pokemon's types from codes that modify them. */
function recalculateTypes(p: Pokemon, s: string | undefined, t: string | undefined) {
	p.m.moddedTypes = p.species.types || [];

	if (s && s === 'star') {
		const sType = p.baseTypes[1];
		if (sType === 'Fairy' || !sType) {
			p.m.moddedTypes = ['Fairy'];
		} else {
			p.m.moddedTypes = ['Fairy', sType];
		}
	};
	if (p.m.codeGenerated && t && t === 'bugsy') p.m.moddedTypes = ['Bug', 'Fighting'];

	if (s && BONUS_TYPE_CODES[s]) p.m.moddedTypes = [...p.m.moddedTypes, BONUS_TYPE_CODES[s]];
	if (t && BONUS_TYPE_CODES[t]) p.m.moddedTypes = [...p.m.moddedTypes, BONUS_TYPE_CODES[t]];

	return p.m.moddedTypes as string[];
}

/** Prevents duplicated moves/abilities/species based on codes and brought team, and enforces code banlist. */
export function validateCodes(team: PokemonSet[], dex: ModdedDex): string[] {
	const problems: string[] = [];

	const maybeTeamCode = team.map(set => dex.toID(set.species).charAt(0)).join('');
	const teamCode = codesOfType('team').includes(maybeTeamCode) ? CodeInfo[maybeTeamCode] : null;
	const givenSpecies = teamCode ? dex.species.get(BONUS_POKEMON_CODES[teamCode.id]?.species || '') : null;
	const otherMoveEffect: { [k: string]: string[] } = {
		'victor': ['vcreate'],
		'wizard': ['magiccoat', 'magicpowder', 'magicroom'],
	};

	for (const set of team) {
		const name = set.name || set.species;
		const maybeSetCode = set.moves.map(m => dex.toID(m).charAt(0)).join('');
		const setCode = codesOfType('set').includes(maybeSetCode) ? CodeInfo[maybeSetCode] : null;

		// Pokemon granted by team code
		const species = dex.species.get(set.species);
		if (teamCode && givenSpecies?.exists && species.id === givenSpecies.id) {
			problems.push(`${name} is of species ${givenSpecies.name}, which is granted by the team code ${teamCode.name}.`);
		}

		// Effects that don't use the normal method to activate
		if (teamCode) {
			const offending = set.moves.find(m => (otherMoveEffect[teamCode.id] || []).includes(dex.toID(m)));
			if (offending) {
				problems.push(`${name} has ${dex.moves.get(offending).name}, which is granted by the team code ${teamCode.name}.`);
			}
		}
		if (setCode) {
			const banned = setCode.banlist?.includes(Dex.species.get(Dex.species.get(set.species).baseSpecies).id);
			if (banned) {
				problems.push(`${name} is banned from using ${setCode.name}.` +
					`(If this code was unintentional, rearrange your moves, which will remove the code.)`);
			}
		}

		// Moves and abilities granted by team or set code
		for (const [type, code] of [['team', teamCode], ['set', setCode]] as const) {
			if (!code) continue;

			const move = dex.moves.get(BONUS_MOVE_CODES[code.id] || '');
			if (move.exists && set.moves.some(m => dex.toID(m) === move.id)) {
				problems.push(`${name} has ${move.name}, which is granted by the ${type} code ${code.name}.`);
			}

			const ability = dex.abilities.get(BONUS_ABILITY_CODES[code.id] || '');
			if (ability.exists && dex.toID(set.ability) === ability.id) {
				problems.push(`${name} has ${ability.name}, which is granted by the ${type} code ${code.name}.`);
			}
		}
	}

	return problems;
}

/** Debugging function: A cheat code has activated. */
export function activateCode(b: Battle, n: string, p: string, s?: Pokemon | null, m?: string) {
	const c = CodeInfo[n];
	b.debug(`${p}'s ${s ? `${s.name}'s set` : `team`} code ${c.name} activated${m ? ` (${m})` : ''}`);
}

/** Disable a set or team code */
export function disableCode(b: Battle, t: 'set' | 'team', s?: Side | null, p?: Pokemon) {
	switch (t) {
		case 'team':
			if (!s) throw new Error(`'team' disableCode passed no Side`);
			b.debug(`${s.name}'s team code '${s.pokemon[0].m.teamCode}' cleared.`);
			for (const p of s.pokemon) {
				delete p.m.teamCode;
			};
			break;
		case 'set':
			if (!p) throw new Error(`'set' disableCode passed no Pokemon`);
			b.debug(`${p.name}'s set code '${p.m.setCode}' cleared.`);
			delete p.m.setCode;
			break;
		default:
			throw new Error(`Invalid code type passed to disableCode: ${t}`);
	}
}

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	actions: {
		canTerastallize() {
			return null;
		}
	},
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
		clearVolatile(includeSwitchFlags = true) {
			this.boosts = {
				atk: 0,
				def: 0,
				spa: 0,
				spd: 0,
				spe: 0,
				accuracy: 0,
				evasion: 0,
			};

			this.moveSlots = this.baseMoveSlots.slice();

			this.transformed = false;
			this.ability = this.baseAbility;
			this.hpType = this.baseHpType;
			this.hpPower = this.baseHpPower;
			if (this.canTerastallize === false) this.canTerastallize = this.teraType;
			for (const i in this.volatiles) {
				if (this.volatiles[i].linkedStatus) {
					this.removeLinkedVolatiles(this.volatiles[i].linkedStatus, this.volatiles[i].linkedPokemon);
				}
			}
			if (this.species.name === 'Eternatus-Eternamax' && this.volatiles['dynamax']) {
				this.volatiles = { dynamax: this.volatiles['dynamax'] };
			} else {
				this.volatiles = {};
			}
			if (includeSwitchFlags) {
				this.switchFlag = false;
				this.forceSwitchFlag = false;
			}

			this.lastMove = null;
			if (this.battle.gen === 2) this.lastMoveEncore = null;
			this.lastMoveUsed = null;
			this.moveThisTurn = '';
			this.moveLastTurnResult = undefined;
			this.moveThisTurnResult = undefined;

			this.lastDamage = 0;
			this.attackedBy = [];
			this.hurtThisTurn = null;
			this.newlySwitched = true;
			this.beingCalledBack = false;

			this.volatileStaleness = undefined;

			delete this.abilityState.started;
			delete this.itemState.started;

			this.setSpecies(this.baseSpecies);

			// the modded part: respect edited baseTypes from codes
			if (this.m.moddedTypes) this.types = this.m.moddedTypes;
		},
		formeChange(
				this: Pokemon, speciesId: string | Species, source: Effect | null = this.battle.effect,
				isPermanent?: boolean, abilitySlot = '0', message?: string
			) {
				const rawSpecies = this.battle.dex.species.get(speciesId);
		
				const species = this.setSpecies(rawSpecies, source);
				if (!species) return false;
		
				if (this.battle.gen <= 2) return true;
		
				// The species the opponent sees
				const apparentSpecies =
					this.illusion ? this.illusion.species.name : species.baseSpecies;
				if (isPermanent) {
					this.baseSpecies = rawSpecies;
					this.details = this.getUpdatedDetails();
					let details = (this.illusion || this).details;
					if (this.terastallized) details += `, tera:${this.terastallized}`;
					this.battle.add('detailschange', this, details);
					this.updateMaxHp();
					if (!source) {
						// Tera forme
						// Ogerpon/Terapagos text goes here
						this.formeRegression = true;
					} else if (source.effectType === 'Item') {
						this.canTerastallize = null; // National Dex behavior
						if (source.zMove) {
							this.battle.add('-burst', this, apparentSpecies, species.requiredItem);
							this.moveThisTurnResult = true; // Ultra Burst counts as an action for Truant
						} else if (source.isPrimalOrb) {
							if (this.illusion) {
								this.ability = '';
								this.battle.add('-primal', this.illusion, species.requiredItem);
							} else {
								this.battle.add('-primal', this, species.requiredItem);
							}
						} else {
							this.battle.add('-mega', this, apparentSpecies, species.requiredItem);
							this.moveThisTurnResult = true; // Mega Evolution counts as an action for Truant
						}
						this.formeRegression = true;
					} else if (source.effectType === 'Status') {
						// Shaymin-Sky -> Shaymin
						this.battle.add('-formechange', this, species.name, message);
					}
				} else {
					if (source?.effectType === 'Ability') {
						this.battle.add('-formechange', this, species.name, message, `[from] ability: ${source.name}`);
					} else {
						this.battle.add('-formechange', this, this.illusion ? this.illusion.species.name : species.name, message);
					}
				}
				if (isPermanent && (!source || !['disguise', 'iceface'].includes(source.id))) {
					if (this.illusion && source) {
						// Tera forme by Ogerpon or Terapagos breaks the Illusion
						this.ability = ''; // Don't allow Illusion to wear off
					}
					const ability = species.abilities[abilitySlot] || species.abilities['0'];
					// Ogerpon's forme change doesn't override permanent abilities
					if (source || !this.getAbility().flags['cantsuppress']) this.setAbility(ability, null, null, true);
					// However, its ability does reset upon switching out
					this.baseAbility = this.battle.toID(ability);
				}
				if (this.terastallized) {
					this.knownType = true;
					this.apparentType = this.terastallized;
				}
				if (this.m.moddedTypes) {
					this.m.moddedTypes = recalculateTypes(this, this.m.setCode, this.m.teamCode);
					this.types = this.m.moddedTypes;
				}
				return true;
			}
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
			const maybeCode = side.pokemon.map(p => p.species.name.charAt(0).toLowerCase()).join('');
			const code = codesOfType('team').includes(maybeCode) ? CodeInfo[maybeCode] : null;
			if (code) {
				for (const pokemon of side.pokemon) {
					pokemon.m.teamCode = code.id;
				};
				this.add(`raw|<div class="broadcast-blue"><b>${side.name}'s team code: ${code.name}</b></div>`);
				this.hint(`${code.name}: ${code.desc}`);
			} else {
				this.add(`raw|<div class="broadcast-red"><b>${side.name} has no team code.</b></div>`);
			};
			this.debug(`TEAM code for ${side.name}: '${maybeCode}' (${code ? '' : 'in'}valid)`);

			for (const pokemon of side.pokemon) {
				const maybeCode = pokemon.moveSlots.map(m => m.id.charAt(0)).join('');
				const code = codesOfType('set').includes(maybeCode) ? CodeInfo[maybeCode] : null;
				if (code) pokemon.m.setCode = code.id;
				this.debug(`SET code for ${side.name}'s ${pokemon.name}: '${maybeCode}' (${code ? '' : 'in'}valid)`);

				// prepare innates and effectCodes as string[] so we can .push()
				pokemon.m.innates = [];
				pokemon.m.effectCodes = [];
			};
		};

		// Team codes (read from slot 0)
		for (const side of this.sides) {
			const teamCode = side.pokemon[0].m.teamCode;
			const foeTeamCode = side.foe.pokemon[0].m.teamCode;

			switch (foeTeamCode) {
				case 'four':
					const trim = side.pokemon.splice(4, side.pokemon.length - 4);
					// BUGSY breaks without reassigning
					if (teamCode.id === 'bugsy') side.pokemon[0].m.bugsyStat = trim[0];
					break;
				case 'noclip':
				case 'tracks':
					for (const p of side.pokemon) {
						p.m.effectCodes.push(foeTeamCode);
					}
					break;
				case 'sleuth':
					let buf = `<div class="infobox"><details><summary>${side.name}'s team info:</summary>`;
					for (const p of side.pokemon) {
						p.m.effectCodes.push(foeTeamCode);
						const name = p.species.name;
						const item = 
							p.m.teamCode === 'quetta' ?
							`None ${p.set.item ? `(was ${this.dex.items.get(p.set.item).name})` : ''}` :
							p.set.item ? this.dex.items.get(p.set.item).name : `No Item`;
						const moves = p.set.moves
							.map(m => `- ${this.dex.moves.get(m).name}`)
							.join('<br />');
					
						buf += `<details style="margin-left: 1em"><summary>${name}:</summary>`;
						buf += `Item: ${item}<br />Moves:<br />${moves}`;
						buf += `</details>`;
					}
					buf += `</details></div>`;
					this.add(`html`, buf);
					break;
				case 'survey':
					for (const p of side.pokemon) {
						p.m.effectCodes.push(foeTeamCode);
					};
					disableCode(this, 'team', side.foe);
					break;
			}
			
			// Codes that give you an extra Pokemon
			if (BONUS_POKEMON_CODES[teamCode]) {
				const codePkmn = side.addPokemon(BONUS_POKEMON_CODES[teamCode]);
				if (codePkmn) {
					codePkmn.m.codeGenerated = true;
					codePkmn.m.teamCode = teamCode;
					codePkmn.m.innates = [];
					codePkmn.m.effectCodes = [];
				};
			}

			switch (teamCode) {

				case 'bugsy':
					const ledian = side.pokemon.find(p => p.m.codeGenerated);
					let [atkMon, defMon, spaMon, spdMon, hpSpeMon] = side.pokemon;
					// If FOUR trims side.pokemon[5], we still need to pull the dormant stats
					if (side.pokemon[0].m.bugsyStat) hpSpeMon = side.pokemon[0].m.bugsyStat;
					if (!ledian || !atkMon || !defMon || !spaMon || !spdMon || !hpSpeMon) {
						// well shit
						throw new Error(`BUGSY code team generation failed: One or more Pokemon are missing.`);
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

					this.debug(`${ledian.side.name}'s ${ledian.name}'s stats: ` +
						[ledian.hp, stats.atk, stats.def, stats.spa, stats.spd, stats.spe].join(', '));

					// clear unneeded storage
					for (const p of side.pokemon) delete p.m.bugsyStat;

					break;

				case 'gofish':
					const pairs = Object.values(
						side.pokemon.flatMap(pokemon => pokemon.baseSpecies.types)
							.reduce((counts, type) => {
								counts[type] = (counts[type] || 0) + 1;
								return counts;
							}, {} as {[type: string]: number})
						).reduce((sum, count) => sum + Math.floor(count / 2), 0);
					const Gboost = 1 + (0.05 * pairs);
					this.debug(`${side.name}'s GOFISH boost: ${Gboost}`)
					for (const pokemon of side.pokemon) {
						pokemon.m.gofishBoost = Gboost;
					}
					break;

				case 'pride':
					const pyroar = side.pokemon.find(p => p.m.codeGenerated);
					if (!pyroar) throw new Error(`PRIDE code team generation failed: No Pyroar was found.`);
					const M = [];
					const F = [];
					for (const p of side.pokemon) {
						if (p.gender === 'M') M.push(p);
						if (p.gender === 'F') F.push(p);
					}
					const majority =
						M.length > F.length ? M :
						M.length < F.length ? F :
						null;
					if (majority) {
						const Pboost = 1.1 + 0.1 * majority.length;
						for (const p of majority) {
							p.m.prideBoost = Pboost;
						}
						pyroar.m.prideBoost = Pboost;
						this.debug(`${side.name}'s PRIDE boost: ${Pboost}`);
					} else {
						this.debug(`No boost was given to ${side.name}'s PRIDE due to a gender equal.`)
					}
					break;

				case 'shower':
					side.pokemon[side.pokemon.length - 1].m.innates.push('drizzle');
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
						pokemon.item = '';
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
			pokemon.types = recalculateTypes(pokemon, setCode, pokemon.m.teamCode);
		}

		// #endregion

		// Wrap up and begin battle
		this.runPickTeam();
		this.queue.addChoice({ choice: 'start' });
		this.midTurn = true;
		if (!this.requestState) this.turnLoop();
	},
};
