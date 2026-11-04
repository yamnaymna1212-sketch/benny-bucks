const PX=MX+.4,PZ=MZ-6.6,CUT=PZ-.45,PB=PZ+.3,PW=1.7,PFL=-.75,BKX=-20,BKZ=18.3,MBX=BKX+1.05,MBZ=BKZ-1.7;   // hole: x PX±.85, z CUT..PB, floor y PFL; the ground in front of CUT is cut away (cross-section)
const tYours=Wd('yours'),tPut=Wd('put'),tBank=Wd('bank'),tLeg=Wd('legally'),tTheirs=Wd('theirs'),tMeet=Wd('meet'),tBack=Wd('backyard');
const KEYS=[   // [t, camera, look-at, fov]. Camera looks +z: SCREEN RIGHT = -x. Hook rhythm (user 2026-11-04): WIDE context -> ZOOM -> TIGHT glowing zoom.
 [0,        [PX-.35,1.3,CUT-5.3],[PX-.35,.38,CUT+2],56],               // WIDE: back of the house + lawn + the ground cut open: Mike digs, money drops in
 [tBack-.05,[PX-.35,1.25,CUT-5.0],[PX-.35,.33,CUT+2],56],
 [tYours-.4,[PX-.3,.75,CUT-3.6],[PX-.3,-.1,CUT+.6],50],            // ZOOM: hole + money + Mike
 [tYours+.05,[PX-.2,.55,CUT-3.2],[PX-.15,-.2,CUT+.5],48],
 [tPut-.22, [PX,.05,CUT-2.05],[PX,-.5,CUT+.4],40],                   // TIGHT: the glowing money (rest goes dark)
 [tPut-.05, [PX,.03,CUT-1.95],[PX,-.5,CUT+.4],40],
 [tPut+.2,  [BKX+.45,2.15,BKZ-7.4],[BKX+.35,2.0,BKZ+1.5],52],         // WIDE: the BANK, Mike + his money on a pallet
 [tBank+.2, [BKX+.45,2.1,BKZ-7.1],[BKX+.35,1.95,BKZ+1.5],52],
 [tLeg+.05, [BKX+.25,2.15,BKZ-5.6],[BKX+.15,2.2,BKZ+1.5],48],          // ZOOM: the money goes in, doors slam
 [tTheirs-.12,[BKX+.1,1.62,BKZ-2.55],[BKX,1.55,BKZ+1.5],42],         // TIGHT: THEIRS on the shut doors, glowing
 [tMeet-.12,[BKX+.1,1.62,BKZ-2.45],[BKX,1.55,BKZ+1.5],42],
 [tMeet+.08,[MBX+.95,1.75,MBZ-.6],[MBX,1.6,MBZ],44],                  // orbit to Mike's shocked face
 [tMeet+.24,[MBX+.8,1.7,MBZ+1.0],[MBX,1.58,MBZ],40],
 [tMeet+.4, [MBX-.7,1.66,MBZ+1.2],[MBX,1.56,MBZ],38],
 [tMeet+1.2,[MBX-.65,1.64,MBZ+1.1],[MBX,1.56,MBZ],36],
 [64.9,     [MBX-.6,1.64,MBZ+1.1],[MBX,1.56,MBZ],36],                 // (story keys come in stage 2)
];
