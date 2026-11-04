const PX=MX+.4,PZ=MZ-6.6,BKX=-20,BKZ=18.3,MBX=BKX+.35,MBZ=BKZ-1.85;
const tYours=Wd('yours'),tPut=Wd('put'),tBank=Wd('bank'),tLeg=Wd('legally'),tTheirs=Wd('theirs'),tMeet=Wd('meet'),tBack=Wd('backyard');
const KEYS=[   // [t, camera, look-at, fov]. Camera looks +z: SCREEN RIGHT = -x. Everything key stays whole in frame.
 [0,        [PX-.48,1.95,PZ-2.75],[PX-.48,.7,PZ+.2],56],            // backyard: pit (screen left) + Mike (screen right), back of the house behind
 [tYours-.1,[PX-.48,1.94,PZ-2.68],[PX-.48,.71,PZ+.2],55],             // slow push-in
 [tPut-.28, [PX-.48,1.93,PZ-2.64],[PX-.48,.72,PZ+.2],55],
 [tPut+.12, [BKX+1.25,1.85,BKZ-4.7],[BKX+.15,1.9,BKZ+1.8],54],      // WHIP over the roof to the BANK, Mike 3/4 from behind
 [tTheirs-.3,[BKX+1.15,1.85,BKZ-4.4],[BKX+.12,1.9,BKZ+1.8],52],     // push in while the cash flies in and the doors slam
 [tMeet-.15,[BKX+1.1,1.85,BKZ-4.3],[BKX+.12,1.9,BKZ+1.8],52],
 [tMeet+.02,[MBX+.95,1.75,MBZ-.6],[MBX,1.6,MBZ],44],                // orbit around Mike, always looking at him
 [tMeet+.18,[MBX+.8,1.7,MBZ+1.0],[MBX,1.58,MBZ],40],
 [tMeet+.34,[MBX-.7,1.66,MBZ+1.2],[MBX,1.56,MBZ],38],               // the shock close-up, he turns to us
 [tMeet+1.2,[MBX-.65,1.64,MBZ+1.1],[MBX,1.56,MBZ],36],
 [64.9,     [MBX-.6,1.64,MBZ+1.1],[MBX,1.56,MBZ],36],               // (story keys come in stage 2)
];
