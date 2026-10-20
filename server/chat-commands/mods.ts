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
	teamcodes: 'codes',
	setcodes: 'codes',
	codes(target, room, user, connection, cmd) {
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
		`/codes all - Shows all possible codes in [Gen 9] CH34T C0D3Z.`,
		`/setcodes - Shows all set codes in [Gen 9] CH34T C0D3Z.`,
		`/teamcodes - Shows all team codes in [Gen 9] CH34T C0D3Z.`,
	]
};
