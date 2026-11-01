# usage: sh sheet.sh out.jpg t1 t2 ... (renders stills of ep5.html and tiles them 10 per row)
out=$1;shift;node stills.mjs ep6.html "$@" 2>&1 | grep -i "error";i=0;mkdir -p _sh;rm -f _sh/*;for t in "$@";do cp still-$t.jpg _sh/$(printf %03d $i).jpg;i=$((i+1));done
ffmpeg -v error -y -framerate 1 -i _sh/%03d.jpg -vf "scale=216:384,tile=10x2:color=black" -frames:v 1 "$out"
