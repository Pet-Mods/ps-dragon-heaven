import {Dex} from '../../../sim/dex';
export const Scripts: {[k: string]: ModdedBattleScriptsData} = {
	gen: 9,
	teambuilderConfig: {
		excludeStandardTiers: true,		// for micrometas to only show fakemons / custom tiers
		customTiers: [''], 				// only to specify the order of custom tiers
	},	
	
	init() {
	
	},
};