import '../../../sim/dex-species';

declare module '../../../sim/dex-species' {
	interface Species {
		hasMons?: Boolean | null;
		mons?: [any, string[], string[]?][] | null;
	}
};

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
};
