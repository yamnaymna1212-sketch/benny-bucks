# Builds the Inside Money cast with MPFB 2 (MakeHuman, CC0) and exports one GLB per character.
# Every character differs in face/body/skin/hair/clothes (cast.json). Rig = MPFB "default" = same bone
# names as render-kit/dl/models/guy/guy.glb (spine01, upperarm01L, ...), so the existing pose() code works.
# Run (Mac):  blender -b --python videos/inside-money/characters/make_cast.py -- [name ...]
# Output: render-kit/dl/models/cast/<name>.glb + characters/preview/<name>.png (front view check)
# Needs: MPFB extension + asset packs installed (see characters/README.md).
import bpy, sys, os, json, math

from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.assetservice import AssetService

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "render-kit", "dl", "models", "cast"))
PREV = os.path.join(HERE, "preview")
CAST = json.load(open(os.path.join(HERE, "cast.json")))


def find(subdir, name):
    """Asset whose folder name is exactly `name`."""
    lst = AssetService.list_mhmat_assets(subdir) if subdir == "skins" else AssetService.list_mhclo_assets(subdir)
    for p in lst:
        if os.path.basename(os.path.dirname(str(p))) == name:
            return str(p)
    raise SystemExit(f"asset not found: {subdir}/{name}")


def preview(name, height):
    sc = bpy.context.scene
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    sc.collection.objects.link(cam)
    cam.data.lens = 60
    cam.location = (0, -5.2, height * 0.55)
    cam.rotation_euler = (math.radians(90), 0, 0)
    sc.camera = cam
    for e, (x, z) in [(3, (-2, 3)), (1.5, (2.5, 2))]:
        L = bpy.data.objects.new("key", bpy.data.lights.new("key", "SUN"))
        L.data.energy = e
        L.rotation_euler = (math.radians(55), 0, math.radians(-25 if x < 0 else 30))
        sc.collection.objects.link(L)
    w = bpy.data.worlds.new("w"); w.color = (0.35, 0.37, 0.4); sc.world = w
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.resolution_x, sc.render.resolution_y = 480, 720
    os.makedirs(PREV, exist_ok=True)
    sc.render.filepath = os.path.join(PREV, f"{name}.png")
    bpy.ops.render.render(write_still=True)


def build(name, c):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    AssetService.update_all_asset_lists()
    info = HumanService._create_default_human_info_dict()
    ph = info["phenotype"]
    for k, v in c["body"].items():
        if k == "race":
            ph["race"].update(v)
        else:
            ph[k] = v
    for part in ("eyes", "eyebrows", "eyelashes", "teeth", "tongue", "hair"):
        if part in c:
            info[part] = find(part, c[part])
    info["skin_mhmat"] = find("skins", c["skin"])
    info["skin_material_type"] = "ENHANCED"
    info["eyes_material_type"] = "MAKESKIN"
    info["clothes"] = [find("clothes", q) for q in c["clothes"]]
    info["alternative_materials"] = {}
    info["rig"] = "default"
    st = HumanService.get_default_deserialization_settings()
    st.update({"override_rig": "default", "override_skin_model": "ENHANCED", "subdiv_levels": 0})
    basemesh = HumanService.deserialize_from_dict(info, st)
    # texture overrides, e.g. Mike's T-shirt with the MakeHuman logo painted out
    for key, rel in c.get("tex_override", {}).items():
        for img in bpy.data.images:
            if key in (img.filepath or "") or key in img.name:
                img.filepath = os.path.join(HERE, rel)
                img.reload()
    h = max((o.matrix_world @ v.co).z for o in [basemesh] for v in o.data.vertices)
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, f"{name}.glb")
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_yup=True, export_apply=True,
                              export_skins=True, export_animations=False, export_morph=False,
                              export_image_format="JPEG", export_jpeg_quality=88)
    print("EXPORTED", out, os.path.getsize(out) // 1024, "KB", "height_m", round(h, 2))
    preview(name, h)


argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
for n in (argv or list(CAST)):
    build(n, CAST[n])
