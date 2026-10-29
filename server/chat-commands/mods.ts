/**
 * Pet Mod commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands relating to Pet Mods.
 * Keep the list alphabetized, based on
 * the mod that the command is for.
 *
 * @license MIT
 */
import { TEAM_CODES, SET_CODES } from "../../data/mods/gen9cheatcodes/scripts";

export const commands: Chat.ChatCommands = {

	// Cheat Codes
	cheatcodes(target, room, user, connection, cmd) {
		if (target && !['team', 'pokemon', 'set', 'move'].includes(target)) return this.parse('/help cheatcodes');
		if (target === 'pokemon') target = 'team';
		if (target === 'move') target = 'set';

		if (!this.runBroadcast()) return;

		const setCodes = SET_CODES.map(c => `<button name="send" value="/cheatcode ${c}"\
			style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer;\
			background: transparent; color: currentColor; -webkit-appearance: none;">${c.toUpperCase()}</i></button>`);
		const teamCodes = TEAM_CODES.map(c => `<button name="send" value="/cheatcode ${c}"\
			style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer;\
			background: transparent; color: currentColor; -webkit-appearance: none;">${c.toUpperCase()}</i></button>`);

		if (!target) {
			this.sendReplyBox(
				[...setCodes, ...teamCodes]
				.sort()
				.join(', ')
			);
		} else {
			this.sendReplyBox((target === 'team' ? teamCodes : setCodes).join(', '));
		};
	},
	cheatcodeshelp: [
		`/cheatcodes [team/set] - Shows all possible codes, including only the team or set, if specified, in [Gen 9] CH34T C0D3Z.`,
		`/cheatcode [code] - Shows you the information about a Cheat Code in [Gen 9] CH34T C0D3Z.`,
		`!cheatcode [code] - Shows everyone that information. Requires: + % @ # ~`,
	],
	cheatcode(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help cheatcode');

		const codeExists = TEAM_CODES.includes(target) || SET_CODES.includes(target);
		if (!codeExists) throw new Chat.ErrorMessage(`${target.toUpperCase()} is not a valid cheat code.`);

		if (!this.runBroadcast()) return;

		const code = Dex.mod('gen9cheatcodes').conditions.get(target);
		this.sendReplyBox(`<span class="white"><u>${TEAM_CODES.includes(toID(target)) ? `Team` : `Set`} code:</u> <b>${code.name}</b></span><br/><p>${code.desc}</p>`);
	},
	cheatcodehelp: [
		`/cheatcode [code] - Shows you the information about a Cheat Code in [Gen 9] CH34T C0D3Z.`,
		`!cheatcode [code] - Shows everyone that information. Requires: + % @ # ~`,
		`/cheatcodes [team/set] - Shows all possible codes, including only the team or set, if specified, in [Gen 9] CH34T C0D3Z.`,
	],
};
