# Inside Money cast (MakeHuman / MPFB 2, CC0)
Every character is different (face, skin, body, height, hair, clothes). Defined in `cast.json`, built by `make_cast.py`,
exported to `render-kit/dl/models/cast/<name>.glb` (git-ignored) + a front preview in `preview/`.

## Setup on a new Mac (once, ~1 GB)
1. `brew install --cask blender` (5.2.x)
2. MPFB 2 extension from extensions.blender.org (`add-on-mpfb-v2.0.18.zip`), install:
   `blender -b -c extension install-file -r user_default -e add-on-mpfb-v2.0.18.zip`
3. CC0 asset packs from static.makehumancommunity.org/assets/assetpacks.html (zips in `~/benny-bucks-assets/makehuman/`):
   makehuman_system_assets, suits01, shirts01, pants01, shoes01, hair01, skins01, skins02, glasses01, hats01.
   Install them with `AssetService.fix_and_extract_asset_pack_zip(zip, LocationService.get_user_data())` in a Blender script.
   Only CC0 packs: the CC-BY packs (shirts02/03, hair02) need credits.

## Build
`blender -b --python videos/inside-money/characters/make_cast.py -- [name ...]` (~10 s per character; no `--factory-startup`, it disables the extension)

## Known gotchas (fixed, keep the fixes)
- Rig = MPFB "default": same bone names as the old guy.glb. three.js strips the dots: `upperarm01.R` -> `upperarm01R`.
- Arm down from A-pose: upperarm `[0.12, 0, ±0.72]` (z sign flips L/R). 1.15 puts the arms behind the back.
- Finger curl axis = x (`fc=[1,0,0]`); finger1 = thumb.
- Eyes must be `MAKESKIN` (PROCEDURAL_EYES exports as glowing white eyes).
- Some clothes (toigo suit) ship a grey BUMP map in the normal slot -> zero normals -> NaN black blocks through bloom/DOF. The loader drops normal maps named `*bump*`.
- Mike's T-shirt: MakeHuman logo painted out in `textures/mike_tee_nologo.png` (`tex_override` in cast.json).
