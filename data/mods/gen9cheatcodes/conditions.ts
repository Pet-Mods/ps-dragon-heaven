import { activateCode, disableCode, CheatCodes } from "./scripts";
import { Utils } from '../../../lib';

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes. KEEP THIS ALPHABETIZED
	aaaaaa: {
		name: "AAAAAA",
		desc: "Sound moves always result in a critical hit.",
		onModifyMove(move, pokemon, target) {
			activateCode(this, 'aaaaaa', pokemon.side.name);
			if (move.flags['sound']) move.willCrit = true;
		},
	},
	ablaze: {
		name: 'ABLAZE',
		desc: "When any Pokemon on this team is at 33% or less HP, its STAB moves have 1.5x power.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, source, target, move) {
			const boostTypes = source.getTypes();
			if (boostTypes.includes(move.type) && source.hp <= source.maxhp / 3) {
				activateCode(this, 'ablaze', source.side.name);
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, source, target, move) {
			const boostTypes = source.getTypes();
			if (boostTypes.includes(move.type) && source.hp <= source.maxhp / 3) {
				activateCode(this, 'ablaze', source.side.name);
				return this.chainModify(1.5);
			}
		},
	},
	absent: {
		name: "ABSENT",
		desc: "Pokemon on this team cannot have their stats lowered.",
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let activated = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					activated = true;
				}
			}
			if (activated) {
				activateCode(this, 'absent', target.side.name);
				this.add("-fail", target, "unboost", "[from] ability: Clear Body", `[of] ${target}`, '[silent]');
			};
		},
	},
	apples: {
		name: "APPLES",
		desc: "An Appletun is added to the team.",
	},
	aurora: {
		name: "AURORA",
		desc: "Rotates the active weather every turn, Snow -> Rain -> Sun -> Sand.",
		onResidual(target, source, effect) {
			let count;
			if (!count || count > 4) count = 0;
			const weathers: { [k: number]: string } = {
				1: 'snowscape',
				2: 'raindance',
				3: 'sunnyday',
				4: 'sandstorm',
			};
			count++;
			activateCode(this, 'aurora', target.side.name);
			this.field.setWeather(weathers[count], target, CheatCodes);
		},
	},
	bees: {
		name: "BEES",
		desc: "Pokemon use either Attack Order or Heal Order at the end of the turn.",
		onResidual(target, source, effect) {
			const move = this.dex.moves.get(this.sample(['Attack Order', 'Heal Order']));
			activateCode(this, 'bees', source.side.name);
			this.actions.useMove(move, move.id === 'attackorder' ? target.foes()[0] : target);
		},
	},
	block: {
		name: "BLOCK",
		desc: "This team's active Pokemon gains immunity to foe's pivot moves.",
		onFoeTryMove(source, target, move) {
			if (target.isAlly(source) || !move.selfSwitch) return;
			activateCode(this, 'block', target.side.name);
			this.add('cant', target, 'code: BLOCK', move, `[of] ${target}`);
			return false;
		},
	},
	bootie: {
		name: "BOOTIE",
		desc: "All Pokemon on this team are immune to entry hazards.",
		// hardcoded in each hazard
	},
	bounty: {
		name: "BOUNTY",
		desc: "When a Pokemon KOs another Pokemon, its highest stat is raised by 1.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
	},
	bugsy: {
		name: "BUGSY",
		desc: "A Ledian is added to the team. It has the base stats of the other Pokemon in the team",
	},
	coffee: {
		name: "COFFEE",
		desc: "Pokemon on this team skip recharge turns at the cost of 20% of the move's power.",
		onSourceTryAddVolatile(status, target, source, sourceEffect) {
			if (status.id !== 'mustrecharge') return;
			activateCode(this, 'coffee', source.side.name)
			return false;
		},
		onModifyDamage(dmg, source, target, move) {
			if (
				(move.volatileStatus && move.volatileStatus === 'mustrecharge') ||
				(move.self?.volatileStatus && move.self.volatileStatus === 'mustrecharge')
			) {
				return this.chainModify(0.8);
			}
		},
	},
	crash: {
		name: "CRASH",
		desc: "The opponent's first Pokemon also has Slow Start.",
		onStart(pokemon) {
			pokemon.foes()[0].m.innates.push('slowstart');
			// hack to instantly activate
			pokemon.foes()[0].addVolatile('slowstart');
			activateCode(this, 'crash', pokemon.side.name);
			disableCode(this, 'team', pokemon.side);
		},
	},
	drake: {
		name: "DRAKE",
		desc: "This team's Dragon type moves ignore Fairy type immunity.",
		onModifyMove(move, pokemon, target) {
			if (move.type === 'Dragon') move.ignoreImmunity = { 'Fairy': true };
		},
	},
	enby: {
		name: "ENBY",
		desc: "Genderless Pokemon on this team deal 1.5x damage.",
		onModifyDamage(dmg, source, target, move) {
			if (source.gender === 'N') return this.chainModify(1.5);
		},
	},
	espeon: {
		name: "ESPEON",
		desc: "Pokemon on this team gain the Psychic type and Synchronize.",
		onStart(pokemon) {
			if (pokemon.hasType('Psychic')) return;
			pokemon.setType([...pokemon.getTypes(true, true), 'Psychic'], true);
			this.add('-start', pokemon, 'typechange', [...pokemon.getTypes(true, true), 'Psychic'].join('/'), '[silent]', '[from] format: Cheat Codes');
		}
	},
	exequy: {
		name: "EXEQUY",
		desc: "Pokemon on this team gain Supreme Overlord",
	},
	fluffy: {
		name: "FLUFFY",
		desc: "All Pokemon on this team gain Fluffy.",
	},
	four: {
		name: "FOUR",
		desc: "The opponent's team is trimmed to 4 Pokemon. Does not break their code.",
	},
	gitgud: {
		name: "GITGUD",
		desc: "Pokemon on this team heal 1/8th max HP and raise their lowest stat by 1(counting stat changes)if it attacks and KOes another Pokemon.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') return;
			// copy of getBestStat but rotated for worst
			let statName: StatIDExceptHP = 'atk';
			let worstStat = 0;
			const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
			for (const i of stats) {
				if (source.getStat(i, true, true) < worstStat) {
					statName = i;
					worstStat = source.getStat(i, true, true);
				}
			}
			this.boost({ [worstStat]: length }, source);
			this.heal(target.maxhp / 8, target, target, source.m.teamCode);
		},
	},
	gofish: {
		name: "GOFISH",
		desc: "The team gains a boost to all stats equal to 5% * the number of types shared by more than one team member.",
		onModifyAtk(relayVar, source, target, move) {
			if (source.m.gofishBoost) return this.chainModify(source.m.gofishBoost);
		},
		onModifyDef(relayVar, source, target, move) {
			if (source.m.gofishBoost) return this.chainModify(source.m.gofishBoost);
		},
		onModifySpA(relayVar, source, target, move) {
			if (source.m.gofishBoost) return this.chainModify(source.m.gofishBoost);
		},
		onModifySpD(relayVar, source, target, move) {
			if (source.m.gofishBoost) return this.chainModify(source.m.gofishBoost);
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.m.gofishBoost) return this.chainModify(pokemon.m.gofishBoost);
		},
	},
	i: {
		name: "I",
		desc: "This Pokemon creates a substitute when it switches in.",
		onStart(pokemon) {
			pokemon.addVolatile('substitute');
		},
	},
	iron: {
		name: "IRON",
		shortDesc: "Team gains Quark Drive boost. Steels: immune to indirect damage, use Def if higher than Atk",
		desc: "All Pokemon gain a Quark Drive boost that can stack with Quark Drive. Steel types: immune to indirect damage, use Defense when attacking if higher than Attack.",
		onStart(pokemon) {
			this.add('-activate', pokemon, 'code: IRON');
			this.effectState.bestStat = pokemon.getBestStat(false, true);
			this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
			this.debug('code: IRON atk boost');
			return this.chainModify([5325, 4096]);
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
			this.debug('code: IRON def boost');
			return this.chainModify([5325, 4096]);
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
			this.debug('code: IRON spa boost');
			return this.chainModify([5325, 4096]);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
			this.debug('code: IRON spd boost');
			return this.chainModify([5325, 4096]);
		},
		onModifySpe(spe, pokemon) {
			if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
			this.debug('code: IRON spe boost');
			return this.chainModify(1.5);
		},
		onSwitchOut(pokemon) {
			this.add('-end', pokemon, 'IRON');
		},
		onFaint(pokemon) {
			this.add('-end', pokemon, 'IRON');
		},
		onModifyMove(move, pokemon, target) {
			if (!(pokemon.getStat('def', true, true) > pokemon.getStat('atk', true, true)) || !pokemon.hasType('Steel')) return;
			activateCode(this, 'iron', pokemon.side.name)
			move.overrideOffensiveStat = 'def';
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move' && target.hasType('Steel')) {
				activateCode(this, 'iron', target.side.name);
				return false;
			}
		},
	},
	lmfao: {
		name: "LMFAO",
		desc: "All weather- and terrain-setting moves switch the user out on this team.",
		onModifyMove(move, pokemon, target) {
			if (!move.terrain || !move.weather) return;
			activateCode(this, 'lmfao', pokemon.side.name);
			move.selfSwitch = true;
		},
	},
	martyr: {},
	neuter: {
		name: "NEUTER",
		desc: "All Pokemon on this team have Neutralizing Gas.",
	},
	noclip: {
		name: "NOCLIP",
		desc: "Terrains have no effect. All Pokemon gain immunity to hazards, and all moves bypass Substitute and screens.",
		onAnyModifyMove(move) {
			move.infiltrates = true;
		},
		onAnyTerrain(pokemon) {
			return false;
		},
		// hazard immunity effect hardcoded in each hazard
	},
	pride: {
		name: "PRIDE",
		desc: "This team gains a Mega Pyroar. Each Pokemon on this team that is of the majority gender, or is Pyroar, gains a damage bonus equal to 10% times the number of Pokemon of that gender, plus 10%.",
		onModifyDamage(dmg, source, target, move) {
			if (!source.m.prideBoost) return;
			activateCode(this, 'pride', source.side.name);
			return this.chainModify(source.m.prideBoost);
		},
	},
	quetta: {
		name: "QUETTA",
		desc: "All team members lose their held item and gain +20 in all of their base stats, except HP.",
		// implemented in the scripts
	},
	return: {
		name: "RETURN",
		desc: "After three Pokemon on this side faint, the next Pokemon that switches in uses Revival Blessing.",
		onStart(pokemon) {
			if (pokemon.side.pokemonLeft > 3) return;
			activateCode(this, 'return', pokemon.side.name);
			this.actions.useMove('revivalblessing', pokemon);
			disableCode(this, 'team', pokemon.side);
		},
	},
	rubber: {
		name: "RUBBER",
		desc: "This team is immune to Electric-type moves, and gains the Magic Bounce effect on switch-in.",
		onTryHit(target, source, move) {
			if (move.type === 'Electric') return false;
			// TODO: debug for single trigger on switch
			if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
	},
	screen: {
		name: "SCREEN",
		shortDesc: "On switch-in, based on highest stat, summon a screen. (Def: Reflect, SpD: Light Screen, HP: Aurora Veil)",
		desc: "When a team member switches in, if its highest stat is Defense, it will summon Reflect, and Light Screen if SpD is the highest stat. If HP is the highest stat, it will use Aurora Veil. These screens cannot be extended by Light Clay.",
		onSwitchIn(pokemon) {
			let move = null;
			const stat = pokemon.getBestStat();
			if (pokemon.maxhp > pokemon.getStat(stat)) {
				move = 'Aurora Veil';
			} else {
				switch (stat) {
					case "def":
						move = "Reflect";
						break;
					case "spd":
						move = 'Light Screen';
						break;
				}
			}
			if (move) {
				activateCode(this, 'screen', pokemon.side.name);
				this.actions.useMove(move, pokemon, { sourceEffect: CheatCodes });
			};
		},
	},
	shower: {
		name: "SHOWER",
		desc: "The last Pokemon on this team has Drizzle on top of its regular Ability.",
	},
	sleuth: {},
	spikes: {
		name: "SPIKES",
		desc: "The opposing team starts with 1 layer of Spikes.",
		onStart(pokemon) {
			activateCode(this, 'spikes', pokemon.side.name);
			pokemon.side.foe.addSideCondition('spikes', pokemon, CheatCodes);
			disableCode(this, 'team', pokemon.side);
		}
	},
	spooky: {
		name: "SPOOKY",
		shortDesc: "Ghost and Dark moves: 0.75x power, 0.5x if Ghost type",
		desc: "All Pokemon take 0.75x damage from Dark and Ghost type moves. Ghost types take halved damage from these types.",
		onSourceModifyDamage(relayVar, source, target, move) {
			if (move.type === 'Dark' || move.type === 'Ghost') {
				activateCode(this, 'spooky', target.side.name);
				return this.chainModify(target.hasType('Ghost') ? 0.5 : 0.75);
			}
		},
	},
	survey: {
		name: "SURVEY",
		desc: "The opponent's Item and Moves are revealed on switch-in.",
		onStart(pokemon) {
			const name = Utils.escapeHTML(pokemon.species.name);
			const item = pokemon.set.item ? this.dex.items.get(pokemon.set.item).name : `No Item ${pokemon.m.teamCode === 'quetta' ? '(Removed by QUETTA)' : ''}`;
			const moves = pokemon.set.moves
				.map(m => `- ${this.dex.moves.get(m).name}`)
				.join('<br />');

			this.add(`|c|${pokemon.side.name}|/raw <div class="infobox"><details>
				<summary>Set for ${name}:</summary>Item: ${item}<br />Moves:<br />${moves}</details></div>`);
		},
	},
	tear: {
		name: "TEAR",
		desc: "On switch-in, lowers a random stat of the foe by 1.",
		onSwitchIn(pokemon) {
			const target = pokemon.foes()[0];
			if (!target) return;
			const stat = this.sample(['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion']);
			this.boost({ [stat]: -1 }, target, pokemon, CheatCodes);
		},
	},
	tracks: {
		name: "TRACKS",
		desc: "No moves can miss.",
		onAnyAccuracy(accuracy, target, source, move) {
			return true;
		},
	},
	victor: {
		name: "VICTOR",
		desc: "This team gains one use of V-Create across the whole team.",
		onStart(pokemon) {
			if (!pokemon.m.effects.includes('victor')) return;
			pokemon.moveSlots.push({
				id: 'vcreate' as ID,
				move: 'V-Create',
				pp: 1,
				maxpp: 1,
				target: 'normal',
				disabled: false,
				used: false,
				virtual: true,
			});
		},
		onAfterMove(source, target, move) {
			if (!source.m.effects.includes('victor') || move.id !== 'vcreate') return;
			disableCode(this, 'team', source.side);
		},
	},
	wizard: {
		name: "WIZARD",
		desc: "All Pokemon on this team gain Magic Coat, Magic Powder, and Magic Room as extra moves",
	},
	zekrom: {
		name: "ZEKROM",
		desc: "The first Pokemon sent out becomes Zekrom.",
		onStart(pokemon) {
			pokemon.formeChange('Zekrom');
			disableCode(this, 'team', pokemon.side);
		}
	},
	zigzag: {
		name: "ZIGZAG",
		desc: "If a Pokemon on this team selects a different move than the previous turn, it gains 25% damage reduction and a 20% damage boost.",
		onBeforeMove(source, target, move) {
			if (!source.lastMoveUsed) return;
			if (move.id === source.lastMoveUsed.id) {
				source.m.zigzagBuff = null;
				this.debug(`${source.side.name}'s ZIGZAG deactivated.`);
				return;
			} else {
				source.m.zigzagBuff = true;
				this.debug(`${source.side.name}'s ZIGZAG activated.`);
				return;
			}
		},
		onModifyDamage(dmg, source, target, move) {
			if (!source.m.zigzagBuff) return;
			activateCode(this, 'zigzag', source.side.name, source);
			return this.chainModify(1.2);
		},
		onSourceModifyDamage(dmg, source, target, move) {
			if (!source.m.zigzagBuff) return;
			activateCode(this, 'zigzag', source.side.name, source);
			return this.chainModify(0.75);
		},
	},
	

	// set codes. KEEP THIS ALPHABETIZED
	alt: {
		name: "ALT",
		shortDesc: "Spawns Trick Room while on the field.",
		desc: "Trick Room is permanently active while this Pokemon is on the field. It can still be replaced or suppressed.",
		effectType: 'Condition',
		onStart(pokemon) {
			// permanence implemented in move data
			this.field.addPseudoWeather('Trick Room', pokemon, CheatCodes);
		},
		onSwitchOut(pokemon) {
			this.field.removePseudoWeather('Trick Room');
		},
		onFaint(target, source, effect) {
			this.field.removePseudoWeather('Trick Room');
		},
	},
	burn: {
		name: "BURN",
		desc: "This Pokemon's attacks have a 100% chance to burn the target.",
		effectType: 'Condition',
		onAfterMove(source, target, move) {
			if (target.trySetStatus('brn', source, source.m.setCode)) {
				activateCode(this, 'burn', source.side.name, source);
			};
		},
	},
	card: {
		name: "CARD",
		desc: "This Pokemon gains a damage boost based on its usage tier.",
		onModifyDamage(dmg, source, target, move) {
			const tier = source.species.natDexTier;
			const boost: { [k: number]: string[] } = {
				1.15: ['OU', 'Uber', 'AG'],
				1.30: ['UU', 'UUBL'],
				1.45: ['RU', 'RUBL'],
				1.60: ['NFE'],
				1.75: ['LC'],
			};
			const key = Object.entries(boost).find(([, tiers]) => tiers.includes(tier));
			// fallback should never trigger, but i dont feel like crashing the battle when it does
			const multiplier = key ? Number(key[0]) : 1;
			this.debug(`CARD: ${source.name}'s damage multipler from ${tier}: ${multiplier}`);
			return this.chainModify(multiplier);
		},
	},
	chip: {
		name: "CHIP",
		shortDesc: "Moves deal an additional 1/16 max HP.",
		desc: "Attacking moves cause the target to lose an additional 1/16th of their max HP. Multi-hit moves only activate this effect once.",
		onAfterMove(source, target, move) {
			if (!target.hp || move.category === 'Status' || !source.foes().includes(target)) return;
			activateCode(this, 'chip', source.side.name, source);
			this.damage(target.maxhp / 16, target, source, this.effect);
		},
	},
	debt: {
		name: "DEBT",
		desc: "This Pokemon gains Neutralizing Gas",
	},
	eggs: {
		name: "EGGS",
		desc: "This Pokemon gains Soft-Boiled as a 5th move.",
		},
	fast: {
		name: "FAST",
		desc: "This Pokemon cannot lose a speed tie.",
		// this will not work well in non-singles formats
		onBeforeMove(source, target, move) {
			if (source.getStat('spe') === target.getStat('spe'))
				activateCode(this, 'fast', source.side.name, source);
				source.speed = source.speed + 1;
		},
	},
	fest: {
		name: "FEST",
		desc: "This Pokemon gains Celebrate as a 5th move.",
		},
	fish: {
		name: "FISH",
		desc: "This Pokemon has the Water type.",
		onStart(pokemon) {
			if (pokemon.hasType('Water')) return;
			pokemon.setType([...pokemon.getTypes(true, true), 'Water'], true);
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true, true).join('/'), '[silent]', '[from] format: Cheat Codes');
		},
	},
	gene: {
		name: "GENE",
		desc: "If this Pokemon has no Item, it gains +2 Attack and becomes confused on switch-in.",
		onStart(pokemon) {
			if (pokemon.item) return;
			activateCode(this, 'gene', pokemon.side.name, pokemon)
			this.boost({'atk': 2}, pokemon, pokemon, CheatCodes, false, true);
			pokemon.addVolatile('confusion', null, CheatCodes);
		},
	},
	go: {
		name: "GO",
		desc: "This Pokemon's attacks have +2 priority and scatter coins.",
		onModifyPriority(priority, source, target, move) {
			activateCode(this, 'go', source.side.name, source);
			return priority + 2;
		},
		onAfterMove(source, target, move) {
			this.add('-message', 'Coins were scattered everywhere!');
		},
	},
	gold: {
		name: "GOLD",
		desc: "This Pokemon gains Good as Gold.",
	},
	heal: {
		name: "HEAL",
		desc: "This Pokemon uses Heal Bell when it switches in.",
		onStart(pokemon) {
			this.actions.useMove('healbell', pokemon);
		},
	},
	lazy: {
		name: "LAZY",
		shortDesc: "Drowsy Pokemon can't switch.",
		desc: "Pokemon with the Drowsy condition can't switch while this Pokemon is on the field.",
		onFoeTrapPokemon(pokemon) {
			if (pokemon.volatiles['yawn']) pokemon.tryTrap(true);
		},
	},
	lets: {
		name: "LETS",
		desc: "This Pokemon gains Levitate.",
	},
	life: {
		name: "LIFE",
		desc: "This Pokemon heals 1/8 max HP after attacking.",
		onSourceDamagingHit(damage, source, target, move) {
			if (!target.hp) return;
			activateCode(this, 'life', target.side.name, target);
			this.heal(target.maxhp / 8, target, target, target.m.teamCode);
		},
	},
	luck: {
		name: "LUCK",
		desc: "This Pokemon gains +2 Crit ratio, and has its moves' secondary effect chances doubled.",
		onModifyCritRatio(critRatio, source, target, move) {
			return critRatio + 2;
		},
		onModifyMovePriority: 5,
		onModifyMove(move, pokemon, target) {
			if (move.secondary?.chance) {
				return move.secondary.chance = move.secondary.chance * 2;
			};
			if (move.secondaries) {
				for (const s of move.secondaries) {
					if (s.chance) s.chance = s.chance * 2;
				}
			};
		},
	},
	mega: {
		name: "MEGA",
		shortDesc: "If this Pokemon has a Mega form, it will Mega Evolve when entering the field.",
		desc: "If this Pokemon has a Mega form, it immediately Mega Evolves, without needing to hold a mega stone. Evolves into the X form if this Pokemon has an Attack-boosting nature, otherwise evolves into the Y form.",
		onStart(pokemon) {
			if (!pokemon.species.otherFormes) return;
			const megas = pokemon.species.otherFormes
				.map(f => Dex.species.get(f))
				.filter(m => m.forme.startsWith('Mega'));
			const preferMegaX = pokemon.getNature().plus === 'atk';
			const mega =
				(preferMegaX && megas.find(s => s.forme === 'Mega-X')) ||
				megas.find(s => s.forme === 'Mega-Y') ||
				megas.find(s => s.forme === 'Mega');
			if (mega) {
				activateCode(this, 'mega', pokemon.side.name, pokemon)
				pokemon.formeChange(mega.id, this.effect, true);
			};
		},
	},
	moms: {
		name: "MOMS",
		desc: "This Pokemon gains Parental Bond."
	},
	monk: {
		name: "MONK",
		desc: "This Pokemon has Gorilla Tactics",
	},
	nuke: {
		name: "NUKE",
		desc: "When this Pokemon faints, it uses Explosion.",
		onFaint(target, source, effect) {
			activateCode(this, 'nuke', source.side.name, source);
			this.actions.useMove('explosion', source);
		},
	},
	okay: {
		name: "OKAY",
		desc: "Moves used by or against this Pokemon deal neutral damage.",
		onImmunity(type, pokemon) {
			return false;
		},
		onSourceImmunity(type, pokemon) {
			return false;
		},
		onEffectiveness(effectiveness, target, type, move) {
			return 1;
		},
		onSourceEffectiveness(effectiveness, target, type, move) {
			return 1;
		},
	},
	paid: {
		name: "PAID",
		desc: "This Pokemon gains the Steel type, and Make it Rain as a 5th move.",
		onStart(pokemon) {
			if (pokemon.hasType('Steel')) return;
			pokemon.setType([...pokemon.getTypes(true, true), 'Steel'], true);
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true, true).join('/'), '[silent]', '[from] format: Cheat Codes');
		},
	},
	pika: {
		name: "PIKA",
		desc: "This Pokemon gains Volt Tackle as a 5th move.",
	},
	rise: {
		name: "RISE",
		desc: "When this Pokemon KOs another Pokemon, its highest stat is raised by 1.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
	},
	sips: {
		name: "SIPS",
		desc: "This Pokemon is immune to Water-type moves.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				activateCode(this, 'sips', target.side.name, target)
				this.add('-immune', target, '[from] code: SIPS');
				return null;
			}
		},
	},
	stab: {
		name: 'STAB',
		desc: "This Pokemon's STAB is 2.0x.",
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				activateCode(this, 'stab', source.side.name, source);
				return stab === 2 ? 2.25 : 2;
			}
		},
	},
	star: {
		name: "STAR",
		shortDesc: "Primary type Fairy. First move: Fairy type, 1.2x BP.",
		desc: "This Pokemon's primary type is replaced with Fairy. Its first move becomes Fairy type and its BP is boosted by 1.2x.",
		onStart(pokemon) {
			pokemon.setType(['Fairy', pokemon.getTypes(true, true)[1] || ''], true);
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]', '[from] format: Cheat Codes');
		},
		onModifyMove(move, pokemon, target) {
			if (move.id === pokemon.getMoveSlot(0)?.id) {
				move.type = 'Fairy';
			};
		},
		onBasePower(bp, source, target, move) {
			if (move.id === source.getMoveSlot(0)?.id) {
				return bp * 1.2;
			};
		},
	},
	trap: {
		name: "TRAP",
		desc: "Moves used by this Pokemon trap the target.",
		onAfterMove(source, target, move) {
		if (!target || target === source || target.fainted) return;
		if (target.addVolatile('trapped', source, move, 'trapper')) {
			activateCode(this, 'trap', source.side.name, source);
		}
	},
	},
	true: {
		name: "TRUE",
		desc: "This Pokemon's Normal-type moves match its primary type.",
		onModifyMove(move, pokemon, target) {
			const normalPrimary = pokemon.getTypes(undefined, true)[0];
			if (move.type === 'Normal' && normalPrimary !== 'Normal') {
				move.type = normalPrimary;
			}
		},
	},
	tune: {
		name: "TUNE",
		desc: "This Pokemon starts Perish Song on all Pokemon after landing an attack.",
		onSourceDamagingHit(damage, target, source, move) {
			activateCode(this, 'tune', target.side.name, target);
			for (const pokemon of this.getAllActive()) {
				pokemon.addVolatile('perishsong', target, CheatCodes);
				this.add('-start', pokemon, 'perish3', '[silent]');
			}
		},
	},
	warp: {
		name: "WARP",
		desc: "This Pokemon's type effectiveness is inverted when attacking.",
		onEffectivenessPriority: -100,
		onSourceEffectiveness(effectiveness, target, type, move) {
			return -effectiveness;
		},
	},
	waxy: {
		name: "WAXY",
		desc: "At the end of each turn, this Pokemon uses Wish.",
		onResidual(target, source, effect) {
			this.actions.useMove('Wish', target);
		},
	},
	what: {
		name: "WHAT",
		shortDesc: "This Pokemon skips recharge turns and uses the higher attacking stat for all moves.",
		desc: "This Pokemon skips recharge turns after attacks, and uses their highest Attack or Special Attack for all their damaging moves.",
		onSourceTryAddVolatile(status, target, source, sourceEffect) {
			if (status.id === 'mustrecharge') return false;
		},
		onModifyAtk(atk, source, target, move) {
			const spa = source.getStat('spa');
			return spa > atk ? spa : atk;
		},
		onModifySpA(spa, source, target, move) {
			const atk = source.getStat('atk');
			return atk > spa ? atk : spa;
		},
	},
	wind: {
		name: "WIND",
		desc: "On switch-in, this Pokemon sets Tailwind",
		onStart(pokemon) {
			pokemon.side.addSideCondition('Tailwind', pokemon, CheatCodes);
		}
	},
	// oh god
	x: {
		name: "X",
		shortDesc: "The first time this Pokemon switches in, it will learn three specific moves based on what the opposing Pokemon is weak to.",
		desc: "The first time this Pokemon is sent out, it will learn three specific moves, depending on what type the opposing Pokemon is weak to. " +
		"If the opposing Pokemon has more than one weakness, one will be chosen at random. BUG First Impression, Bug Buzz, and Sticky Web; DARK Knock Off, " +
		"Dark Pulse, and Taunt; DRAGON Dragon Pulse, Dragon Claw, and Dragon Tail; ELECTR Thunderbolt, Thunder Punch, and Thunder Wave; FAIRY Moonblast, " +
		"Play Rough, and Char; FIGHT Brick Break, Aura Sphere, and Detect; FIRE Flamethrower, Fire Punch, and Will-O-Wisp; FLYING Acrobatics, Air Slash, " +
		"and Tailwind; GHOST Shadow Ball, Shadow Claw, and Curse; GRASS Energy Ball, Leaf Blade, and Synthesis; GROUND Earthquake, Earth Power, and Shore Up; " +
		"ICE Ice Beam, Ice Punch, and Icy Wind; POISON Sludge Bomb, Poison Jab, and Toxic; PSYCHIC Psychic, Zen Headbutt, and Wish; ROCK Rock Slide, Power Gem, " +
		"and Stealth Rock; STEEL Iron Head, Flash Cannon, and Iron Defense; WATER Surf, Waterfall, and Aqua Ring",
		onStart(pokemon) {
			// this already ran
			if (pokemon.baseMoveSlots.length > 1) return;

			const MOVE_REPLACE: { [k: string]: string[] } = {
				bug: ['firstimpression', 'bugbuzz', 'stickyweb'],
				dark: ['knockoff', 'darkpulse', 'taunt'],
				dragon: ['dragonpulse', 'dragonclaw', 'dragontail'],
				electric: ['thunderbolt', 'thunderpunch', 'thunderwave'],
				fairy: ['moonblast', 'playrough', 'charm'],
				fighting: ['brickbreak', 'auraspehere', 'detect'],
				fire: ['flamethrower', 'firepunch', 'willowisp'],
				flying: ['acrobatics', 'airslash', 'tailwind'],
				ghost: ['shadowball', 'shadowclaw', 'curse'],
				grass: ['energyball', 'leafblade', 'synthesis'],
				ground: ['earthquake', 'earthpower', 'shoreup'],
				ice: ['icebeam', 'icepunch', 'icywind'],
				poison: ['sludgebomb', 'poisonjab', 'toxic'],
				psychic: ['psychic', 'zenheadbutt', 'wish'],
				rock: ['rockslide', 'powergem', 'stealthrock'],
				steel: ['ironhead', 'flashcannon', 'irondefense'],
				water: ['surf', 'waterfall', 'aquaring'],
			};

			if (!pokemon.foes().length) return;
			const foe = this.sample(pokemon.foes());

			const weaknesses = Object.keys(MOVE_REPLACE).filter(type => {
				const typeName = this.dex.types.get(type).name;
				return this.dex.getImmunity(typeName, foe) && this.dex.getEffectiveness(typeName, foe) > 0;
			});
			if (!weaknesses.length) return;
			const TYPE = this.sample(weaknesses);

			for (const moveid of MOVE_REPLACE[TYPE]) {
				const move = this.dex.moves.get(moveid);
				pokemon.moveSlots.push(
					{
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					}
				);
				pokemon.baseMoveSlots.push(
					{
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						disabledSource: '',
						used: false,
					}
				);
			};
			this.debug(`${pokemon.name}'s X: Added moves from the ${TYPE} type.
				(${MOVE_REPLACE[TYPE]
					.map(m => this.dex.moves.get(m).name)
					.join(', ')
				})`);
		},
	},
};
