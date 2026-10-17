// battle, code name
function announceCode(b: Battle, n: string) {
	const c = b.dex.conditions.get(n);
	b.add('-message', `${c.name}: ${c.desc}`)
}
// battle, code name, player name, pokemon name (for set codes)
function activateCode(b: Battle, n: string, p: string, s?: Pokemon) {
	const c = b.dex.conditions.get(n);
	b.debug(`${p}'s ${s ? `${s.name}'s set` : `team`} code activated: ${c.name}: ${c.shortDesc || c.desc}`);
}

export const Conditions: import("../../../sim/dex-conditions").ModdedConditionDataTable = {
	// team codes
	spooky: {
		name: "SPOOKY",
		desc: "All Pokemon take 0.75x damage from Dark and Ghost type moves. Ghost types take halved damage from these types.",
		effectType: "Condition",
		onStart(target, source, sourceEffect) {
			announceCode(this, 'spooky');
		},
		onModifyDamage(relayVar, source, target, move) {
			if (move.type === 'dark' || move.type === 'ghost') {
				activateCode(this, 'spooky', source.side.name);
				return this.chainModify(target.hasType('ghost') ? 0.5 : 0.75);
			}
		},
	},

	// set codes
	stab: {
		name: 'STAB',
		desc: 'This Pokemon\'s STAB is 2.0x',
		effectType: "Condition",
		onStart() {
			announceCode(this, 'stab');
		},
		onModifySTAB(relayVar, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				this.debug(`${source} STAB boosted to 2 by code 'stab'`)
				return 2;
			}
		},
	},
};
