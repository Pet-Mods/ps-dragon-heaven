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
		const team = cmd.includes('team');
		if (cmd === 'codes') return this.parse('/help codes');
		if (!this.runBroadcast()) return;
		this.sendReplyBox((team ? TEAM_CODES : SET_CODES).join(', ').toUpperCase());
	},
};
