import { activateCode, cheatCodes } from "./scripts";

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes. KEEP THIS ALPHABETIZED
	aaaaaa: {},
	ablaze: {},
	apples: {
		name: "APPLES",
		desc: "An Appletun is added to the team.",
		},
	aurora: {},
	absent: {},
	block: {},
	bootie: {},
	bounty: {},
	coffee: {},
	crash: {},
	drake: {},
	enby: {},
	espeon: {},
	exequy: {},
	fluffy: {},
	four: {
		name: "FOUR",
		desc: "The opponent's team is trimmed to 4 Pokemon. Does not break their code.",
		},
	i: {},
	iron: {},
	lmfao: {},
	neuter: {},
	noclip: {},
	pride: {},
	quetta: {},
	return: {},
	rubber: {},
	screen: {},
	shower: {},
	sleuth: {},
	spikes: {},
	spooky: {
		name: "SPOOKY",
		shortDesc: "Ghost and Dark moves: 0.75x power, 0.5x if Ghost type",
		desc: "All Pokemon take 0.75x damage from Dark and Ghost type moves. Ghost types take halved damage from these types",
		onSourceModifyDamage(relayVar, source, target, move) {
			if (move.type === 'Dark' || move.type === 'Ghost') {
				activateCode(this, 'spooky', target.side.name);
				return this.chainModify(target.hasType('Ghost') ? 0.5 : 0.75);
			}
		},
	},
	survey: {},
	tear: {},
	victor: {},
	wizard: {},
	zekrom: {},
	zigzag: {},
	

	// set codes. KEEP THIS ALPHABETIZED
	alt: {
		name: "ALT",
		shortDesc: "Spawns Trick Room while on the field.",
		desc: "Trick Room is permanently active while this Pokemon is on the field. It can still be replaced or suppressed.",
		effectType: 'Condition',
		onStart(pokemon) {
			// permanence implemented in move data
			this.field.addPseudoWeather('Trick Room', pokemon, cheatCodes);
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
			activateCode(this, 'burn', source.side.name, source);
			target.trySetStatus('brn', source, source.m.setCode);
		},
	},
	chip: {
		name: "CHIP",
		shortDesc: "Moves deal an additional 1/16 max HP.",
		desc: "Attacking moves cause the target to lose an additional 1/16th of their max HP. Multi-hit moves only activate this effect once.",
		onAfterMove(source, target, move) {
			if (target.hp) {
				activateCode(this, 'chip', source.side.name, source);
				this.damage(target.maxhp / 16, target, source, this.effect);
			};
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
				activateCode(this, 'fast', source.side.name, source)
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
			// this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]', '[from] format: Cheat Codes');
		},
	},
	gene: {
		name: "GENE",
		desc: "If this Pokemon has no Item, it gains +2 Attack and becomes confused on switch-in.",
		onStart(pokemon) {
			if (!pokemon.item) {
				activateCode(this, 'gene', pokemon.side.name, pokemon)
				this.boost({'atk': 2}, pokemon, pokemon, cheatCodes, false, true);
			}
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
		onAnyTrapPokemon(pokemon) {
			if (pokemon.volatiles['drowsy']) return true;
		},
	},
	lets: {
		name: "LETS",
		desc: "This Pokemon gains Levitate.",
	},
	life: {
		name: "LIFE",
		desc: "This Pokemon heals 1/8 max HP after attacking.",
		onDamagingHit(damage, source, target, move) {
			if (source.hp) {
				activateCode(this, 'life', source.side.name, source);
				this.heal(source.maxhp / 8, source, source, cheatCodes);
			};
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
			if (pokemon.species.otherFormes) {
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
		desc: "This Pokemon gains Steel type, and Make it Rain as a 5th move.",
		onStart(pokemon) {
			pokemon.addType('Steel');
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
			if (effect && effect.effectType === 'Move') {
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
		desc: "This Pokemon's STAB is 2.0x",
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
			pokemon.setType(['Fairy', pokemon.getTypes(true, true)[1], 'Water'], true);
			// this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]', '[from] format: Cheat Codes');
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
			if (target.tryTrap(true)) {
				activateCode(this, 'trap', source.side.name, source);
			}
		},
	},
	true: {
		name: "TRUE",
		desc: "This Pokemon's Normal-type moves match its primary type.",
		onModifyMove(move, pokemon, target) {
			if (move.type === 'Normal' && pokemon.getTypes(undefined, true)[0] !== 'Normal') {
				move.type = pokemon.getTypes(undefined, true)[0];
			}
		},
	},
	tune: {
		name: "TUNE",
		desc: "This Pokemon starts Perish Song on all Pokemon after landing an attack.",
		onDamagingHit(damage, target, source, move) {
			for (const pokemon of this.getAllActive()) {
				pokemon.addVolatile('perishsong', source, cheatCodes);
			}
		},
	},
	warp: {
		name: "WARP",
		desc: "This Pokemon's type effectiveness is inverted when attacking.",
		onEffectivenessPriority: -100,
		onEffectiveness(effectiveness, target, type, move) {
			return 1 / effectiveness;
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
		onTryAddVolatile(status, target, source, sourceEffect) {
			if (status.id === 'mustrecharge') return false;
		},
		onModifyAtk(relayVar, source, target, move) {
			if (source.getStat('spa') > source.getStat('atk')) {
				return source.getStat('spa');
			}
		},
		onModifySpA(relayVar, source, target, move) {
			if (source.getStat('spa') < source.getStat('atk')) {
				return source.getStat('atk');
			}
		},
	},
	wind: {
		name: "WIND",
		desc: "On switch-in, this Pokemon sets Tailwind",
		onStart(pokemon) {
			pokemon.side.addSideCondition('Tailwind', pokemon, cheatCodes);
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
			this.debug(`${pokemon.name}'s X: Added moves from the ${TYPE} type. (${MOVE_REPLACE[TYPE].join(', ')})`);
		},
	},
};
