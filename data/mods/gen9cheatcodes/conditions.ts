import { announceCode, activateCode } from "./scripts";

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes. KEEP THIS ALPHABETIZED
	aaaaaa: {},
	ablaze: {},
	apples: {},
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
		// hardcoded in scripts.ts
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
		effectType: "Condition",
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
		desc: "Trick Room is permanently active while this Pokemon is on the field. It cannot be replaced or suppressed.",
		effectType: 'Condition',
		onStart(pokemon, source, sourceEffect) {
			// permanence implemented in move data
			this.field.addPseudoWeather('Trick Room', source, this.dex.formats.get('gen9cheatcodes'));
		},
		onEnd(target) {
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
			activateCode(this, 'chip', source.side.name, source);
			target.damage(target.maxhp / 16, source, this.dex.conditions.get('chip'));
		},
	},
	debt: {
		name: "DEBT",
		desc: "This Pokemon gains Neutralizing Gas",
	},
	eggs: {
		name: "EGGS",
		desc: "This Pokemon gains Soft-Boiled as a 5th move.",
		// this is in scripts.ts
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
		// this is in scripts.ts
	},
	fish: {},
	gitgud: {},
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
	gold: {},
	heal: {},
	lazy: {},
	lets: {},
	life: {},
	luck: {},
	mega: {},
	monk: {
		name: "MONK",
		desc: "This Pokemon has Gorilla Tactics",
		// ability in scripts.ts
	},
	nuke: {},
	okay: {},
	paid: {
		name: "PAID",
		desc: "This Pokemon gains Steel type, and Make it Rain as a 5th move.",
		// move is in scripts.ts
		onStart(pokemon) {
			pokemon.addType('Steel');
		},
	},
	pika: {
		name: "PIKA",
		desc: "This Pokemon gains Volt Tackle as a 5th move.",
		// this is in scripts.ts
	},
	rise: {},
	sips: {},
	stab: {
		name: 'STAB',
		desc: "This Pokemon's STAB is 2.0x",
		effectType: "Condition",
		onModifySTAB(relayVar, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				activateCode(this, 'stab', source.side.name, source);
				return 2;
			}
		},
	},
	true: {},
	warp: {},
	what: {},
	x: {},
};
