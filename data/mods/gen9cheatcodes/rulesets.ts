import { validateCodes } from './scripts';

export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	cheatcodesrecursion: {
		name: "Cheat Codes Recursion",
		effectType: 'ValidatorRule',
		desc: "Prevents duplicated moves, abilities, and species.",
		onValidateTeam(team) {
			return validateCodes(team, this.dex);
		},
	},
};
