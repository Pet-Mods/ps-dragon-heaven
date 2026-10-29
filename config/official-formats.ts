// Official formats from Smogon
// Keep seperate from formats.ts

export const Formats: import('../sim/dex-formats').FormatList = [
	{
		section: "PS! Misc",
		column: 4,
	},
	{
		name: "[Gen 9] National Dex AG",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672423/">National Dex AG</a>`,
		],

		mod: 'gen9',
		ruleset: ['Standard AG', 'NatDex Mod'],
	},
	{
		name: "[Gen 9] Triples",
		mod: 'gen9',
		gameType: 'triples',
		searchShow: false,
		ruleset: ['Standard Doubles', 'Evasion Abilities Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Darkrai', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Indeedee', 'Indeedee-F', 'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Terapagos', 'Urshifu', 'Urshifu-Rapid-Strike',
			'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Bright Powder', 'King\'s Rock', 'Razor Fang',
		],
	},
	{
		// another CG but its doubles, really could be in either spot
		name: "[Gen 9] Doubles Custom Game",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		battle: {trunc: Math.trunc},
		debug: true,
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 9] Bad 'n Boosted",
		desc: `Base stats of 70 and lower get doubled.`,
		mod: 'gen9',
		threads: [
		'&bullet; <a href="https://discord.gg/vYdSwRreNd">Discord</a>'
		],
		ruleset: ['Standard','Bad \'n Boosted Mod','Sleep Moves Clause','!Sleep Clause Mod'],
		banlist: ['AG', 'Moody', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects', 'Eviolite', 'Huge Power', 'Pure Power', 'Espathra', 'Cyclizar', 'Polteageist', 'Shadow Tag', 'Pawmot'],
	},
	{
		name: "[Gen 9] Monoletter",
		mod: "gen9",
		desc: `A National Dex OU mod where you can only use teams consisting of the same starting letter.`,
		threads: [
		`&bullet; <a href="https://www.smogon.com/forums/threads/monoletter.3777036/#post-10852356">Smogon Thread</a>`,
		'&bullet; <a href="https://www.smogon.com/forums/threads/monoletter.3777036/post-10852399">Sample Teams</a>',
		'&bullet; <a href="https://discord.gg/YqZ67cjbk9">Discord</a>'
		],
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Same Letter Clause'],
		banlist: ['ND Uber', 'ND AG', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock', 'Quick Claw', 'Razor Fang', 'Assist', 'Baton Pass', 'Last Respects', 'Shed Tail', 'Light Clay'],
		unbanlist: ['Yveltal','Walking Wake','Ursaluna-Bloodmoon','Ogerpon-Hearthflame','Urshifu-Single-Strike','Naganadel'],
	},
		{
		name: "[Gen 3] Orre Colosseum",
		mod: 'gen3colosseum',
		gameType: 'doubles',
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Max Team Size = 6', 'VGC Timer',
			'Nickname Clause', 'Endless Battle Clause', 'Cancel Mod', 'Picked Team Size = 4', 'Exact HP Mod', 'Item Clause = 1', 'Open Team Sheets',
		],
		banlist: ['Soul Dew', 'Deoxys-Defense', 'Deoxys-Attack', 'Deoxys-Speed', 'Restricted Legendary', 'Mythical'],
		unbanlist: ['Latios', 'Latias', 'Wobbuffet', 'Wynaut'],
		bestOfDefault: true,
		onBegin() {
			this.add('rule', 'Self-KO Clause: If your last Pok\u00e9mon faints to a self-KO move or effect, you will lose the battle');
		},
	},
	{
		section: "Custom Game",
		column: 4,
	},
	{
		name: "[Gen 9] Custom Game",
		mod: 'gen9',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 8] Custom Game",
		mod: 'gen8',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 7] Custom Game",
		mod: 'gen7',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 6] Custom Game",
		mod: 'gen6',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 5] Custom Game",
		mod: 'gen5',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 4] Custom Game",
		mod: 'gen4',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 3] Custom Game",
		mod: 'gen3',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Desync Clause Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 2] Custom Game",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		name: "[Gen 1] Custom Game",
		mod: 'gen1',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
];
