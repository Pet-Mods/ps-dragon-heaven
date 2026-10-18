// battle, code name
function announceCode(b: Battle, n: string, p: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.add('-ability', p, `code: ${c.name}`);
	b.hint(`${c.name}: ${c.desc}`);
}
// battle, code name, player name, pokemon name (for set codes)
function activateCode(b: Battle, n: string, p: string, s?: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.debug(`${p}'s ${s ? `${s.name}'s set` : `team`} code activated: ${c.name}: ${c.shortDesc || c.desc}`);
}

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes. KEEP THIS ALPHABETIZED
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
		name: 'alt',
		shortDesc: "Spawns Trick Room while on the field.",
		desc: "Trick Room is permanently active while this Pokemon is on the field. It cannot be replaced or suppressed.",
		effectType: 'Condition',
		onStart(target, source, sourceEffect) {
			// permanence implemented in move data
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
