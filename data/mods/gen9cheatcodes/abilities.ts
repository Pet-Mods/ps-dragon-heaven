export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	neutralizinggas: {
		inherit: true,
		// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			// Remove setter's innates before the ability starts
			if (pokemon.m.innates && !pokemon.hasItem('Ability Shield')) {
				for (const innates of pokemon.m.innates) {
					if (this.dex.abilities.get(innates).flags['cantsuppress'] || innates === 'neutralizinggas') continue;
					pokemon.removeVolatile('ability:' + innates);
				}
			}
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.m.innates) {
					for (const innates of target.m.innates) {
						if (this.dex.abilities.get(innates).flags['cantsuppress']) continue;
						target.removeVolatile('ability:' + innates);
					}
				}
			}
		},
		onEnd(source) {
			if (source.transformed) return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon !== source && pokemon.hasAbility('Neutralizing Gas')) {
					return;
				}
			}
			this.add('-end', source, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== source) {
					if (pokemon.getAbility().flags['cantsuppress']) continue; // does not interact with e.g Ice Face, Zen Mode
					if (pokemon.hasItem('abilityshield')) continue; // don't restart abilities that weren't suppressed

					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
					if (pokemon.ability === "gluttony") {
						pokemon.abilityState.gluttony = false;
					}
					if (pokemon.m.innates) {
						for (const innates of pokemon.m.innates) {
							// permanent abilities
							if (pokemon.volatiles['ability:' + innates]) continue;
							if (innates === "gluttony") pokemon.abilityState.gluttony = false;
							pokemon.addVolatile('ability:' + innates, pokemon);
						}
					}
				}
			}
		},
	},
};
