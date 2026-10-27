"""Cut the cars out of the user's EP8 hook image (videos/doug-credit/src/hook-ref.png) as RGBA sprites.
Background inside each box = 2nd-order polynomial fitted on the box border (the blue is a smooth gradient),
alpha = colour distance to that background. The rest of the hook is rebuilt in code (studio/src/videos/dougCredit.tsx)."""
import cv2, numpy as np
SRC = 'videos/doug-credit/src/hook-ref.png'; OUT = 'studio/public/credit/'
im = cv2.imread(SRC).astype(np.float32)
CARS = {'car-l': (22, 728, 432, 990), 'car-r': (488, 712, 925, 995)}
GAUGES = [(120, 962, 340, 1105), (595, 962, 815, 1105)]

def fit_bg(x0, y0, x1, y1, ring=8):
    ys, xs = np.mgrid[y0:y1, x0:x1]
    border = np.zeros(xs.shape, bool); border[:ring], border[-ring:], border[:, :ring], border[:, -ring:] = True, True, True, True
    for gx0, gy0, gx1, gy1 in GAUGES:  # gauge pixels are not background
        border &= ~((xs >= gx0) & (xs < gx1) & (ys >= gy0) & (ys < gy1))
    X = lambda x, y: np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], -1)
    xn, yn = (xs - x0) / (x1 - x0), (ys - y0) / (y1 - y0)
    A = X(xn[border], yn[border]); out = np.zeros(xs.shape + (3,), np.float32)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, im[y0:y1, x0:x1, c][border], rcond=None)
        out[..., c] = X(xn, yn) @ coef
    return out

for name, (x0, y0, x1, y1) in CARS.items():
    crop = im[y0:y1, x0:x1]; bg = fit_bg(x0, y0, x1, y1)
    d = np.sqrt(((crop - bg) ** 2).sum(2))
    al = np.clip((d - 22) * 5, 0, 255)
    for gx0, gy0, gx1, gy1 in GAUGES: al[max(0, gy0 - y0):, max(0, gx0 - x0):max(0, gx1 - x0)] = 0
    al[:4], al[-4:], al[:, :4], al[:, -4:] = 0, 0, 0, 0
    al = cv2.GaussianBlur(al, (3, 3), 0)
    # un-premultiply the blue out of semi-transparent glow pixels
    a = (al / 255)[..., None]; rgb = np.where(a > 0.05, (crop - bg * (1 - a)) / np.maximum(a, 0.05), crop)
    cv2.imwrite(OUT + name + '.png', np.dstack([np.clip(rgb, 0, 255), al]).astype(np.uint8))
    print(name, x0, y0, x1 - x0, y1 - y0)
