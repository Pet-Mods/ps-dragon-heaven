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
import { CodeDetails } from "../../data/mods/gen9cheatcodes/scripts";

// cheatcodes
const CodeInfo: { [code: string]: CodeDetails } = require('../../data/mods/gen9cheatcodes/codes-info.json');
const getCodes = (type: CodeDetails['type']) =>
	Object.keys(CodeInfo).filter(id => CodeInfo[id].type === type).sort();

export const commands: Chat.ChatCommands = {

	// Cheat Codes
	cheatcodes(target, room, user, connection, cmd) {
		if (target && !['team', 'pokemon', 'set', 'move'].includes(target)) return this.parse('/help cheatcodes');
		if (target === 'pokemon') target = 'team';
		if (target === 'move') target = 'set';

		if (!this.runBroadcast()) return;

		const setCodes = getCodes('set').map(id => `<button name="send" value="/cheatcode ${id}" style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer; background: transparent; color: currentColor; -webkit-appearance: none;">${CodeInfo[id].name}</button>`);
		const teamCodes = getCodes('team').map(id => `<button name="send" value="/cheatcode ${id}" style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer; background: transparent; color: currentColor; -webkit-appearance: none;">${CodeInfo[id].name}</button>`);

		if (!target) {
			this.sendReplyBox(
				[...getCodes('set'), ...getCodes('team')]
					.sort()
					.map(id => `<button name="send" value="/cheatcode ${id}" style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer; background: transparent; color: currentColor; -webkit-appearance: none;">${CodeInfo[id].name}</button>`)
					.join(', ')
			);
		} else {
			this.sendReplyBox((target === 'team' ? teamCodes : setCodes).join(', '));
		}
	},
	cheatcodeshelp: [
		`/cheatcodes [team/set] - Shows all possible codes, including only the team or set, if specified, in [Gen 9] CH34T C0D3Z.`,
		`/cheatcode [code] - Shows you the information about a Cheat Code in [Gen 9] CH34T C0D3Z.`,
		`!cheatcode [code] - Shows everyone that information. Requires: + % @ # ~`,
	],
	cheatcode(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help cheatcode');

		const id = toID(target);
		if (!CodeInfo[id]) {
			throw new Chat.ErrorMessage(`${target.toUpperCase()} is not a valid cheat code.`);
		}

		if (!this.runBroadcast()) return;

		const code = CodeInfo[id];
		let buf = `<span class="white"><u>${code.type === 'team' ? 'Team' : 'Set'} code:</u> <b>${code.name}</b></span><br />`;
		buf += `<p>${code.desc}</p>`;
		if (code.banlist) {
			buf += `<details><summary>Code Banlist</summary>The following Pokemon cannot use this code:<br>- ${code.banlist.map(p => Dex.species.get(p).name).join('<br>- ')}</details>`;
		}
		if (code.effectDetails) {
			buf += `<details><summary>Effect Details</summary>${code.effectDetails}</details>`;
		}
		this.sendReplyBox(buf);
	},
	cheatcodehelp: [
		`/cheatcode [code] - Shows you the information about a Cheat Code in [Gen 9] CH34T C0D3Z.`,
		`!cheatcode [code] - Shows everyone that information. Requires: + % @ # ~`,
		`/cheatcodes [team/set] - Shows all possible codes, including only the team or set, if specified, in [Gen 9] CH34T C0D3Z.`,
	],
};
