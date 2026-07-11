// red -> amber -> lime, interpolated across rating 0-10.
export function ratingColor(rating: number): string {
  const stops: [number, [number, number, number]][] = [
    [0, [255, 90, 90]],
    [5, [255, 184, 77]],
    [10, [212, 255, 63]],
  ];
  const [lo, hi] = rating <= 5 ? [stops[0], stops[1]] : [stops[1], stops[2]];
  const t = (rating - lo[0]) / (hi[0] - lo[0] || 1);
  const rgb = lo[1].map((c, i) => Math.round(c + (hi[1][i] - c) * t));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}
