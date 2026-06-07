import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen 9] Mix 'n Mega Limited Supply Random Battle",
		desc: `Mix N Mega recieves Random Battle! Play a Random Battle format where each Pokemon can hold only one transformation item.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3778874/">Smogon Thread</a>`,
		],
		mod: 'mixandmega',
		team: 'random',
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod', 'Mega Data Mod'],
	},
];
