import { validateCodes } from './scripts';

export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	ccv: {
		name: "CCV",
		effectType: 'ValidatorRule',
		desc: "Prevents duplication and usage of banned codes for Pokemon.",
		onValidateTeam(team) {
			return validateCodes(team, this.dex);
		},
	},
};
