import { activateCode, disableCode, CheatCodes } from "./scripts";
import { Utils } from '../../../lib';

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes. KEEP THIS ALPHABETIZED
	aaaaaa: {
		name: "AAAAAA",
		onModifyMove(move, pokemon, target) {
			activateCode(this, 'aaaaaa', pokemon.side.name);
			if (move.flags['sound']) move.willCrit = true;
		},
	},
	ablaze: {
		name: 'ABLAZE',
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
	},
	aurora: {
		name: "AURORA",
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
		onResidual(target, source, effect) {
			const move = this.dex.moves.get(this.sample(['Attack Order', 'Heal Order']));
			activateCode(this, 'bees', source.side.name);
			this.actions.useMove(move, move.id === 'attackorder' ? target.foes()[0] : target);
		},
	},
	block: {
		name: "BLOCK",
		onFoeTryMove(source, target, move) {
			if (target.isAlly(source) || !move.selfSwitch) return;
			activateCode(this, 'block', target.side.name);
			this.add('cant', target, 'code: BLOCK', move, `[of] ${target}`);
			return false;
		},
	},
	bootie: {
		name: "BOOTIE",
		// hardcoded in each hazard
	},
	bounty: {
		name: "BOUNTY",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
	},
	bugsy: {
		name: "BUGSY",
	},
	coffee: {
		name: "COFFEE",
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
		onModifyMove(move, pokemon, target) {
			if (move.type === 'Dragon') move.ignoreImmunity = { 'Fairy': true };
		},
	},
	enby: {
		name: "ENBY",
		onModifyDamage(dmg, source, target, move) {
			if (source.gender === 'N') return this.chainModify(1.5);
		},
	},
	espeon: {
		name: "ESPEON",
		onStart(pokemon) {
			if (pokemon.hasType('Psychic')) return;
			pokemon.setType([...pokemon.getTypes(true, true), 'Psychic'], true);
			this.add('-start', pokemon, 'typechange', [...pokemon.getTypes(true, true), 'Psychic'].join('/'), '[silent]', '[from] format: Cheat Codes');
		}
	},
	exequy: {
		name: "EXEQUY",
	},
	fluffy: {
		name: "FLUFFY",
	},
	four: {
		name: "FOUR",
	},
	gitgud: {
		name: "GITGUD",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') return;
			// copy of getBestStat but rotated for worst
			let statName: StatIDExceptHP = 'atk';
			let worstStat = 0;
			const stats: StatIDExceptHP[] = ['atk', 'def', 'spa', 'spd', 'spe'];
			for (const i of stats) {
				if (source.getStat(i, false, true) < worstStat) {
					statName = i;
					worstStat = source.getStat(i, false, true);
				}
			}
			this.boost({ [worstStat]: length }, source);
			this.heal(target.maxhp / 8, target, target, source.m.teamCode);
		},
	},
	gofish: {
		name: "GOFISH",
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
		onStart(pokemon) {
			pokemon.addVolatile('substitute');
		},
	},
	iron: {
		name: "IRON",
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
		onModifyMove(move, pokemon, target) {
			if (!move.terrain || !move.weather) return;
			activateCode(this, 'lmfao', pokemon.side.name);
			move.selfSwitch = true;
		},
	},
	martyr: {},
	neuter: {
		name: "NEUTER",
	},
	noclip: {
		name: "NOCLIP",
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
		onModifyDamage(dmg, source, target, move) {
			if (!source.m.prideBoost) return;
			activateCode(this, 'pride', source.side.name);
			return this.chainModify(source.m.prideBoost);
		},
	},
	quetta: {
		name: "QUETTA",
		// implemented in the scripts
	},
	return: {
		name: "RETURN",
		onStart(pokemon) {
			if (pokemon.side.pokemonLeft > 3) return;
			activateCode(this, 'return', pokemon.side.name);
			this.actions.useMove('revivalblessing', pokemon);
			disableCode(this, 'team', pokemon.side);
		},
	},
	rubber: {
		name: "RUBBER",
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
	},
	sleuth: {},
	spikes: {
		name: "SPIKES",
		onStart(pokemon) {
			activateCode(this, 'spikes', pokemon.side.name);
			pokemon.side.foe.addSideCondition('spikes', pokemon, CheatCodes);
			disableCode(this, 'team', pokemon.side);
		}
	},
	spooky: {
		name: "SPOOKY",
		onSourceModifyDamage(relayVar, source, target, move) {
			if (move.type === 'Dark' || move.type === 'Ghost') {
				activateCode(this, 'spooky', target.side.name);
				return this.chainModify(target.hasType('Ghost') ? 0.5 : 0.75);
			}
		},
	},
	survey: {
		name: "SURVEY",
		onStart(pokemon) {
			const name = Utils.escapeHTML(pokemon.species.name);
			const item = pokemon.set.item ? this.dex.items.get(pokemon.set.item).name : `No Item ${pokemon.m.teamCode === 'quetta' ? '(Removed by QUETTA)' : ''}`;
			const moves = pokemon.set.moves
				.map(m => `- ${this.dex.moves.get(m).name}`)
				.join('<br />');

			this.add(`|html|<div class="infobox"><details><summary>Set for ${name}:</summary>Item: ${item}<br />Moves:<br />${moves}</details></div>`);
		},
	},
	tear: {
		name: "TEAR",
		onSwitchIn(pokemon) {
			const target = pokemon.foes()[0];
			if (!target) return;
			const stat = this.sample(['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion']);
			this.boost({ [stat]: -1 }, target, pokemon, CheatCodes);
		},
	},
	tracks: {
		name: "TRACKS",
		onAnyAccuracy(accuracy, target, source, move) {
			return true;
		},
	},
	victor: {
		name: "VICTOR",
		onStart(pokemon) {
			if (!pokemon.volatiles['victor']) return;
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
			if (move.id !== 'vcreate') return;
			disableCode(this, 'team', source.side);
			source.removeVolatile('victor');
		},
	},
	wizard: {
		name: "WIZARD",
	},
	zekrom: {
		name: "ZEKROM",
		onStart(pokemon) {
			pokemon.formeChange('Zekrom', CheatCodes, true);
			disableCode(this, 'team', pokemon.side);
		}
	},
	zigzag: {
		name: "ZIGZAG",
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
		effectType: 'Condition',
		onAfterMove(source, target, move) {
			if (target.trySetStatus('brn', source, source.m.setCode)) {
				activateCode(this, 'burn', source.side.name, source);
			};
		},
	},
	card: {
		name: "CARD",
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
		onAfterMove(source, target, move) {
			if (!target.hp || move.category === 'Status' || target.isAlly(source)) return;
			activateCode(this, 'chip', source.side.name, source);
			this.damage(target.maxhp / 16, target, source, this.effect);
		},
	},
	debt: {
		name: "DEBT",
	},
	eggs: {
		name: "EGGS",
		},
	fast: {
		name: "FAST",
		// this will not work well in non-singles formats
		onBeforeMove(source, target, move) {
			if (source.getStat('spe') === target.getStat('spe'))
				activateCode(this, 'fast', source.side.name, source);
				source.speed = source.speed + 1;
		},
	},
	fest: {
		name: "FEST",
		},
	fish: {
		name: "FISH",
		onStart(pokemon) {
			if (pokemon.hasType('Water')) return;
			pokemon.setType([...pokemon.getTypes(true, true), 'Water'], true);
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true, true).join('/'), '[silent]', '[from] format: Cheat Codes');
		},
	},
	gene: {
		name: "GENE",
		onStart(pokemon) {
			if (pokemon.item) return;
			activateCode(this, 'gene', pokemon.side.name, pokemon)
			this.boost({'atk': 2}, pokemon, pokemon, CheatCodes, false, true);
			pokemon.addVolatile('confusion', null, CheatCodes);
		},
	},
	go: {
		name: "GO",
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
	},
	heal: {
		name: "HEAL",
		onStart(pokemon) {
			this.actions.useMove('healbell', pokemon);
		},
	},
	lazy: {
		name: "LAZY",
		onFoeTrapPokemon(pokemon) {
			if (pokemon.volatiles['yawn']) pokemon.tryTrap(true);
		},
	},
	lets: {
		name: "LETS",
	},
	life: {
		name: "LIFE",
		onDamagingHit(damage, source, target, move) {
			if (!target.hp) return;
			activateCode(this, 'life', target.side.name, target);
			this.heal(target.maxhp / 8, target, target, target.m.teamCode);
		},
	},
	luck: {
		name: "LUCK",
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
	},
	monk: {
		name: "MONK",
	},
	nuke: {
		name: "NUKE",
		onFaint(target, source, effect) {
			activateCode(this, 'nuke', source.side.name, source);
			this.actions.useMove('explosion', source);
		},
	},
	okay: {
		name: "OKAY",
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
		onStart(pokemon) {
			if (pokemon.hasType('Steel')) return;
			pokemon.setType([...pokemon.getTypes(true, true), 'Steel'], true);
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true, true).join('/'), '[silent]', '[from] format: Cheat Codes');
		},
	},
	pika: {
		name: "PIKA",
	},
	rise: {
		name: "RISE",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
	},
	sips: {
		name: "SIPS",
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
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				activateCode(this, 'stab', source.side.name, source);
				return stab === 2 ? 2.25 : 2;
			}
		},
	},
	star: {
		name: "STAR",
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
		onAfterMove(source, target, move) {
		if (!target || target === source || target.fainted) return;
		if (target.addVolatile('trapped', source, move, 'trapper')) {
			activateCode(this, 'trap', source.side.name, source);
		}
	},
	},
	true: {
		name: "TRUE",
		onModifyMove(move, pokemon, target) {
			const normalPrimary = pokemon.getTypes(undefined, true)[0];
			if (move.type === 'Normal' && normalPrimary !== 'Normal') {
				move.type = normalPrimary;
			}
		},
	},
	tune: {
		name: "TUNE",
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
		onEffectivenessPriority: -100,
		onSourceEffectiveness(effectiveness, target, type, move) {
			return -effectiveness;
		},
	},
	waxy: {
		name: "WAXY",
		onResidual(target, source, effect) {
			this.actions.useMove('Wish', target);
		},
	},
	what: {
		name: "WHAT",
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
		onStart(pokemon) {
			pokemon.side.addSideCondition('Tailwind', pokemon, CheatCodes);
		}
	},
	// oh god
	x: {
		name: "X",
		onStart(pokemon) {
			// this already ran
			if (pokemon.baseMoveSlots.length > 1) return;

			const MOVE_REPLACE: { [k: string]: string[] } = {
				bug: ['firstimpression', 'bugbuzz', 'stickyweb'],
				dark: ['knockoff', 'darkpulse', 'taunt'],
				dragon: ['dragonclaw', 'dragonpulse', 'dragontail'],
				electric: ['thunderpunch', 'thunderbolt', 'thunderwave'],
				fairy: ['playrough', 'moonblast', 'charm'],
				fighting: ['brickbreak', 'aurasphere', 'detect'],
				fire: ['firepunch', 'flamethrower', 'willowisp'],
				flying: ['acrobatics', 'airslash', 'tailwind'],
				ghost: ['shadowclaw', 'shadowball', 'curse'],
				grass: ['leafblade', 'energyball', 'synthesis'],
				ground: ['earthquake', 'earthpower', 'shoreup'],
				ice: ['icepunch', 'icebeam', 'icywind'],
				poison: ['poisonjab', 'sludgebomb', 'toxic'],
				psychic: ['zenheadbutt', 'psychic', 'wish'],
				rock: ['rockslide', 'powergem', 'stealthrock'],
				steel: ['ironhead', 'flashcannon', 'irondefense'],
				water: ['waterfall', 'surf', 'aquaring'],
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
		// this is absolutely not neccessary i just hate it not matching
		onModifyMove(move, pokemon, target) {
			if (move.id === 'wish') return 'Psychic';
		},
	},
};
