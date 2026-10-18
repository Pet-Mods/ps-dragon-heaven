import { announceCode, activateCode, clearCode } from "./scripts";

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes. KEEP THIS ALPHABETIZED
	four: {
		name: "FOUR",
		desc: "The opponent's team is trimmed to 4 Pokemon. Does not break their code.",
		// hardcoded in scripts.ts
	},
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

	// set codes. KEEP THIS ALPHABETIZED
	alt: {
		name: "ALT",
		shortDesc: "Spawns Trick Room while on the field.",
		desc: "Trick Room is permanently active while this Pokemon is on the field. It cannot be replaced or suppressed.",
		effectType: 'Condition',
		onStart(pokemon, source, sourceEffect) {
			// permanence implemented in move data
			announceCode(this, pokemon.m.setCode, pokemon);
			this.field.addPseudoWeather('Trick Room', source, this.dex.formats.get('gen9cheatcodes'));
		},
		onEnd(target) {
			this.field.removePseudoWeather('Trick Room');
		},
	},
	stab: {
		name: 'STAB',
		desc: "This Pokemon's STAB is 2.0x",
		effectType: "Condition",
		onStart(pokemon) {
			announceCode(this, 'stab', pokemon);
		},
		onModifySTAB(relayVar, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				activateCode(this, 'stab', source.side.name, source);
				return 2;
			}
		},
	},
};
