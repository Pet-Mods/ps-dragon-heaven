import { validateCodes } from './scripts';

export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	cheatcodes: {
		name: "Cheat Codes",
		effectType: 'ValidatorRule',
		desc: "Prevents duplicated moves, abilities, and species.",
		onValidateTeam(team) {
			return validateCodes(team, this.dex);
		},
	},
};
