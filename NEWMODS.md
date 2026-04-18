Creating a mod
========================================================================

You'll need [config\formats.ts](./config/formats.ts), and [data\mods\.placeholder](./data/mods/.placeholder).

Adding your tier
------------------------------------------------------------------------
Your format rules are stored in `/data/mods/`(your mod)`/formats.ts`.

Copy [data\mods\.placeholder](./data/mods/.placeholder), and rename it with the name of your mod (alphanumerical, no capitals.)

Then, in `config/formats.ts`, copy the following:

`import { Formats as  `(your mod )` } from '../data/mods/`(your mod)`/formats';`
- side note: align the end bracket to match the others. The title of your mod folder shouldn't be longer than 15 characters.

Fill out any additional files with any info you may need. You can use [Scoopapa's mod generator](https://scoopapa.github.io/PS-Spreadsheet-to-JS/) for basic information. You can find templates of how each element should be organized in each file.

When you're done, delete files you are not using (i.e. if you dont have any custom Abilities, delete `abilities.ts`).