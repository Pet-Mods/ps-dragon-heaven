// Note: This is the visual table of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in your mod's folder named "formats.ts"

Paste the following code into the file and add your desired information to each format
--------------------------------------------------------------------------------
import { FormatData } from '../../../sim/dex-formats';

export const Formats: FormatData[] = [
	{
		name: "[Gen GEN NUMBER] My First Solomod",
		desc: `Elevator-pitch verison of what your mod's all about.`,
		threads: [ //This shows up when using /tier on the format and is normally used for resource links
			`&bullet; <a href="URL of your resource here">Name of your resource here</a>`,
		],
		mod: 'MOD FOLDER NAME HERE',
		ruleset: [ Use names (not ids) from data/rulesets.ts and your mod's rulesets.ts files. Additionally, by putting in the name of another format, you can inherit all rules and bans of that format. ],
		banlist: [ Use names (not ids) to ban Mons, moves, etc. here. Can use 'All Pokemon' or similar to blanket ban. 
		For a Pokemon with multiple formes, putting just the name bans them all. Use the '-Base' suffix to ban only the base forme. ],
		unbanlist: [ Specific unbans if using 'All Pokemon', etc., or if unbanning from an inherited ruleset. ],
		gameType: 'doubles/triples/free-for-all' // Only include this line to choose the type of battle
		teambuilderFormat: 'Uber/National Dex', // Only include this line to have the teambuilder include Ubers/Nonstandard stuff, respectively 
		team: 'random', // Only include this line to declare a Random Battle format, which has extra steps
	},
];
--------------------------------------------------------------------------------
Then, add a line to the import statements below (which is sorted alphabetically) with the same formatting and your mod's name.
After that, find the right section within the formats list that describes your mod and add a new line with the code "...'NAME USED FOR [Formats as _____]'",
*/

// Imports
// import { Formats as DEMO                  } from '../data/mods/DEMO/formats';

export const Formats: import('../sim/dex-formats').FormatList = [
	];