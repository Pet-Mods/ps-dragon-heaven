import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen 9] Mix and Mega: Limited Supply Random Battle",
		mod: 'gen9mnmlimitedsupply',
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod', 'Terastal Clause'],
		team: 'randomMnMLS',
		desc: 'A Mix and Mega-based Random Battle made by the Pet Mods community.',
		onBegin() {
			this.add(`raw|<div class='broadcast-green'><b>Make sure to check out the <a href="https://docs.google.com/spreadsheets/d/1OS3D5qEMS3peHS2XwIM61AVxw7fktgU_bCWHwsW00Ow/" target="_blank">spreadsheet</a> for all the mons and items, and use \`/mnm pokemon @ item\` to find their stats!</b></div>`);
			this.add(`raw|Welcome to Mix and Mega: Limited Supply!`);
			this.add(`raw|This is a Gen 9 Mix and Mega based Random battles format.<br>You can find our thread and metagame resources <a href="https://www.smogon.com/forums/threads/3778874" target="_blank">here</a>.<br>Be sure to swing by the <a href="https://play.pokemonshowdown.com/petmods" target="_blank">Pet Mods room</a> to discuss the metagame and participate in roomtours!`);
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			const originalSpecies = this.dex.species.get((pokemon.species as any).originalSpecies);
			if (originalSpecies.exists) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, originalSpecies.requiredItems?.[0] || originalSpecies.requiredItem || originalSpecies.requiredMove, '[silent]');
				const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.join('/') !== pokemon.species.types.join('/')) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]', '[from] format: Mix and Mega Limited Supply');
				}
			}
		},
		onSwitchOut(pokemon) {
			const originalSpecies = this.dex.species.get((pokemon.species as any).originalSpecies);
			if (originalSpecies.exists && pokemon.m.originalSpecies !== originalSpecies.baseSpecies) {
				this.add('-end', pokemon, originalSpecies.requiredItems?.[0] || originalSpecies.requiredItem || originalSpecies.requiredMove, '[silent]');
			}
		},
	},
];
