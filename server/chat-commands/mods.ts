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
	teamcodes: 'cheatcodes',
	setcodes: 'cheatcodes',
	cheatcodes(target, room, user, connection, cmd) {
		const team = cmd.includes('team') || target === 'team';
		if (cmd === 'codes' && !['all', 'team', 'set'].includes(target)) return this.parse('/help codes');
		if (!this.runBroadcast()) return;
		if (target === 'all') {
			this.sendReplyBox(
				[...TEAM_CODES, ...SET_CODES]
				.sort()
				.join(', ')
				.toUpperCase()
			);
		} else {
		this.sendReplyBox((team ? TEAM_CODES : SET_CODES).join(', ').toUpperCase());
		};
	},
	codeshelp: [
		`/cheatcodes all - Shows all possible codes in [Gen 9] CH34T C0D3Z.`,
		`/setcodes - Shows all set codes in [Gen 9] CH34T C0D3Z.`,
		`/teamcodes - Shows all team codes in [Gen 9] CH34T C0D3Z.`,
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
	],
};
