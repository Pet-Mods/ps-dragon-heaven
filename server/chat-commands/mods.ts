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
import { CodeInfo, getCodes } from "../../data/mods/gen9cheatcodes/scripts";

export const commands: Chat.ChatCommands = {

	// Cheat Codes
	cheatcodes(target, room, user, connection, cmd) {
		const [action, term] = target.split(' ').map(t => t.trim());
		// check against all syntaxes
		if (
			!action ||
			!['v', 'view', 'd', 'dt', 'details', 's', 'search'].includes(action) ||
			(!['v', 'view'].includes(action) && !term) ||
			(['v', 'view'].includes(action) && (term && !['team', 'pokemon', 'set', 'move', 'all'].includes(term))) ||
			(['s', 'search'].includes(action) && !(term.trim().length === 1 && /^[a-zA-Z]+$/.test(term)))
		) return this.errorReply(`'${term}' is not a valid parameter for 'cheatcodes ${action}'`);

		if (!this.runBroadcast()) return;

		switch (action) {
			case 'd':
			case 'dt':
			case 'details':
				const id = toID(term);
				if (!CodeInfo[id]) {
					throw new Chat.ErrorMessage(`${term.toUpperCase()} is not a valid cheat code.`);
				}
			
				const code = CodeInfo[id];
				let buf = `<span class="white"><u>${code.type === 'team' ? 'Team' : 'Set'} code:</u> <b>${code.name}</b></span><br />`;
				buf += `<p>${code.desc}</p>`;
				if (code.banlist) {
					buf += `<details><summary>Code Banlist</summary>The following Pokemon cannot use this code:<br>- ${code.banlist.map(p => Dex.species.get(p).name).join('<br>- ')}</details>`;
				}
				if (code.effectDetails) {
					buf += `<details><summary>Details</summary>${code.effectDetails}</details>`;
				}
				this.sendReplyBox(buf);
				break;
			case 's':
			case 'search':
				const key = term.toLowerCase();
				const matches =
					[...getCodes('all')]
					.sort()
					.filter(c => c.includes(key))
					.map(c => `<button name="send" value="/cheatcodes details ${c}" style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer; background: transparent; color: currentColor; -webkit-appearance: none;">${CodeInfo[c].name}</button>`)
					.join(', ');
				this.sendReplyBox(`Codes matching <b>${key.toUpperCase()}</b>:<br>${matches}`);
				break;
			case 'v':
			case 'view':
				let searchTerm = term || 'all';
				if (searchTerm === 'pokemon') searchTerm = 'team';
				if (searchTerm === 'move') searchTerm = 'set';

				let codes: string[] = [];
				if (searchTerm === 'all' || searchTerm === 'set') codes.push(...getCodes('set').sort());
				if (searchTerm === 'all' || searchTerm === 'team') codes.push(...getCodes('team').sort());

				this.sendReplyBox(
					`<b>All ${term ? `${searchTerm} ` : ''}codes:</b><br>` +
					[...codes]
						.map(c => `<button name="send" value="/cheatcodes details ${c}" style="display: inline; padding: 0; border: 0; font: inherit; cursor: pointer; background: transparent; color: currentColor; -webkit-appearance: none;">${CodeInfo[c].name}</button>`)
						.join(', ')
				);
				break;
		}
	},
	cheatcodeshelp() {
		this.sendReplyBox(
			`/cheatcodes details [code] - Shows you the information about a Cheat Code.<br/>` +
			`/cheatcodes search [key] - Shows all Cheat Codes containing the letter key.<br/>` +
			`/cheatcodes view [team/set] - Shows all possible Cheat Codes, including only the team or set, if specified.<br/>` +
			`!cheatcodes [details/search/view] [term]: Shows everyone that information. Requires: + % * @ ~`
		)
	},
};
