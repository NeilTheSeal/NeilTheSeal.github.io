#include <cmath>
#include <cstdint>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#define KEEPALIVE EMSCRIPTEN_KEEPALIVE
#else
#define KEEPALIVE
#endif

// Palette LUT parameters
static constexpr int PALETTE_SIZE = 1024; // power-of-two-ish for cheap scaling
static uint32_t g_palette[PALETTE_SIZE];
static bool g_palette_built = false;

// Build a polynomial palette LUT matching the JS mapping, packed as RGBA in little-endian.
// Byte order in memory will be [R,G,BA] when viewed as bytes; we pack as 0xAABBGGRR and rely on LE.
static inline void build_palette(uint32_t* palette) {
    for (int i = 0; i < PALETTE_SIZE; ++i) {
        // norm = 1 - iters/maxIter analogue, here i maps linearly [0..SIZE-1]
        double norm = 1.0 - (double)i / (double)(PALETTE_SIZE - 1);
        if (norm > 0.95) norm = 1.0; // match original behavior
        double t = 1.0 - norm;
        double c2 = norm * norm;
        double c3 = c2 * norm;
        double R = norm * 255.0;
        double G = 9.0 * t * c3 * 255.0;
        double B = 15.0 * t * t * c2 * 255.0;

        uint8_t r = (uint8_t)(R < 0 ? 0 : (R > 255 ? 255 : R));
        uint8_t g = (uint8_t)(G < 0 ? 0 : (G > 255 ? 255 : G));
        uint8_t b = (uint8_t)(B < 0 ? 0 : (B > 255 ? 255 : B));
        palette[i] = (0xFFu << 24) | ((uint32_t)b << 16) | ((uint32_t)g << 8) | (uint32_t)r;
    }
}

extern "C" KEEPALIVE void render(
    uint8_t *out,
    int W,
    int H,
    double xMin,
    double xMax,
    double yMin,
    double yMax,
    int maxIter
) {
    if (!out || W <= 0 || H <= 0 || maxIter <= 0) return;

    const double dx = (xMax - xMin) / (double)W;
    const double dy = (yMax - yMin) / (double)H;

    // Build global palette once
    if (!g_palette_built) {
        build_palette(g_palette);
        g_palette_built = true;
    }
    const double idxScale = (double)(PALETTE_SIZE - 1) / (double)maxIter;

    // Write as 32-bit pixels for fewer memory ops.
    for (int py = 0; py < H; ++py) {
        const double cy = yMin + (double)py * dy;
        const double cy2 = cy * cy;

    // Row pointer as 32-bit RGBA
    uint32_t* __restrict__ p = reinterpret_cast<uint32_t*>(out + ((size_t)py * (size_t)W << 2));

        double cx = xMin;
    for (int px = 0; px < W; ++px, cx += dx) {
            int iters = 0;

            // Cardioid and period-2 bulb tests (quick interior checks)
            const double xMinusQuarter = cx - 0.25;
            const double q = xMinusQuarter * xMinusQuarter + cy2;
            if (q * (q + xMinusQuarter) <= 0.25 * cy2 ||
                (cx + 1.0) * (cx + 1.0) + cy2 <= 0.0625) {
                iters = maxIter;
            } else {
                // Unrolled 2 iterations per loop to reduce branch/check overhead
                double x = 0.0, y = 0.0;
                double xx = 0.0, yy = 0.0;
                double r2 = 0.0;
                while (iters < maxIter) {
                    // Iteration 1
                    xx = x * x;
                    yy = y * y;
                    r2 = xx + yy;
                    if (r2 > 4.0) { ++iters; break; }
                    double xy = x * y;
                    x = xx - yy + cx;
                    y = 2.0 * xy + cy;
                    ++iters;
                    if (iters >= maxIter) break;

                    // Iteration 2
                    xx = x * x;
                    yy = y * y;
                    r2 = xx + yy;
                    if (r2 > 4.0) { ++iters; break; }
                    xy = x * y;
                    x = xx - yy + cx;
                    y = 2.0 * xy + cy;
                    ++iters;
                }
            }

            // Palette lookup: map iters -> index in [0..PALETTE_SIZE-1]
            // Higher iters -> darker (norm smaller), matching original formula.
            int idx = (int)(iters * idxScale);
            if (idx < 0) idx = 0; else if (idx >= PALETTE_SIZE) idx = PALETTE_SIZE - 1;
            *p++ = g_palette[idx];
        }
    }
}
