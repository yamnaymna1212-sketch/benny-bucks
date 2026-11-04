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


def mixed_co(ob):
    """Vertex positions WITH the phenotype shape keys (height, muscle...) mixed in; v.co alone is the base mesh."""
    sk = ob.data.shape_keys
    if not sk:
        return [v.co.copy() for v in ob.data.vertices]
    base = sk.reference_key.data
    co = [b.co.copy() for b in base]
    for kb in sk.key_blocks[1:]:
        if kb.value and not kb.mute:
            for i, d in enumerate(kb.data):
                co[i] += kb.value * (d.co - base[i].co)
    return co


def center(ob, group, co=None):
    co = co or mixed_co(ob)
    gi = ob.vertex_groups[group].index
    pts = [ob.matrix_world @ co[v.index] for v in ob.data.vertices if any(g.group == gi and g.weight > .5 for g in v.groups)]
    return sum(pts, pts[0] * 0) / len(pts)


def add_balaclava(body, cfg):
    """Knitted ski mask = copy of the head/neck skin pushed out a few mm, with 2 eye holes + a mouth hole.
    Keeps the body's bone weights, so it follows the head/jaw. three.js gives it the knit look (material 'balaclava')."""
    import bmesh
    from mathutils import Vector
    co = mixed_co(body)
    eyeL, eyeR = center(body, "joint-l-eye", co), center(body, "joint-r-eye", co)
    mouth, neck = center(body, "lips", co), center(body, "joint-neck", co)
    m = body.copy(); m.data = body.data.copy(); m.name = "balaclava"
    bpy.context.scene.collection.objects.link(m)
    for md in list(m.modifiers):
        if md.type == "MASK":
            m.modifiers.remove(md)
    if m.data.shape_keys:
        m.shape_key_clear()
    for v in m.data.vertices:   # bake the mixed shape (shape keys are not exported for the mask)
        v.co = co[v.index]
    bi = m.vertex_groups["body"].index
    bm = bmesh.new(); bm.from_mesh(m.data); dl = bm.verts.layers.deform.active
    er, mr, zcut = cfg.get("eye_r", .021), cfg.get("mouth_r", .019), neck.z - cfg.get("neck_drop", .06)
    kill = []
    for v in bm.verts:
        w = (m.matrix_world @ v.co)
        inbody = v[dl].get(bi, 0) > .5
        eye = min(((w - e) * Vector((1, .55, 1.5))).length for e in (eyeL, eyeR)) < er   # wider than tall
        mo = ((w - mouth) * Vector((.8, .5, 1.5))).length < mr
        if not inbody or w.z < zcut or eye or mo:
            kill.append(v)
    bmesh.ops.delete(bm, geom=kill, context="VERTS")
    # knit hangs loose: smooth away nose/ear/lip detail (keep the hole rims) before pushing it out
    bm.normal_update()
    orig = {v: (v.co.copy(), v.normal.copy()) for v in bm.verts}
    inner = [v for v in bm.verts if not v.is_boundary]
    for _ in range(cfg.get("smooth", 8)):
        bmesh.ops.smooth_vert(bm, verts=inner, factor=.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    off0 = cfg.get("offset", .005)
    for v in bm.verts:   # smoothing shrinks the skull: never let a vertex sit closer than `off` to the skin
        o, n = orig[v]; d = (v.co - o).dot(n)
        wz = (m.matrix_world @ o).z
        off = off0 * min(1, max(.15, (wz - (neck.z - .035)) / .03))   # tucked under the collar at the bottom
        if d < off:
            v.co += n * (off - d)
    bm.normal_update()
    hc = sum((v.co for v in bm.verts), Vector()) / len(bm.verts)
    out = sum(v.normal.dot(v.co - hc) for v in bm.verts)
    sg = 1 if out > 0 else -1   # MakeHuman winding may point the normals inward
    if sg < 0:
        bmesh.ops.reverse_faces(bm, faces=bm.faces)
    print("BALACLAVA normal sign", sg)
    bm.to_mesh(m.data); bm.free()
    mat = bpy.data.materials.new("balaclava"); mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*cfg.get("rgb", (.035, .035, .04)), 1); bsdf.inputs["Roughness"].default_value = .95
    m.data.materials.clear(); m.data.materials.append(mat)
    m.data.polygons.foreach_set("use_smooth", [True] * len(m.data.polygons))
    from mathutils import Vector as V
    bb = [m.matrix_world @ V(c) for c in m.bound_box]
    print("BALACLAVA verts", len(m.data.vertices), "parent", m.parent and m.parent.name, "z", round(min(b.z for b in bb), 3), round(max(b.z for b in bb), 3), "eyes", [round(x, 3) for x in eyeL], "neck", round(neck.z, 3), "hide", m.hide_render, m.hide_get())


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
    # extra shape targets (e.g. belly, round face): [{"target": "stomach-pregnant-incr", "value": .5}]
    info["targets"] = c.get("targets", [])
    st = HumanService.get_default_deserialization_settings()
    st.update({"override_rig": "default", "override_skin_model": "ENHANCED", "subdiv_levels": 0})
    basemesh = HumanService.deserialize_from_dict(info, st)
    # texture overrides, e.g. Mike's T-shirt with the MakeHuman logo painted out
    if "balaclava" in c:
        add_balaclava(basemesh, c["balaclava"])
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
