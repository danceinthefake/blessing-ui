// Shared fixtures for demos — SVG placeholders so nothing external is loaded.
export const shots = [
  "e85078",
  "fd709f",
  "ff3434",
  "ffa800",
  "c0e722",
  "a759ff",
  "82909a",
  "3d3e3f",
].map((c, i) => ({
  src: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#${c}"/><text x="50%" y="50%" font-size="160" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${i + 1}</text></svg>`)}`,
  alt: `shot ${i + 1}`,
  caption: `第${i + 1}話 場面写真`,
}));

export const heroines = [
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "澤村・スペンサー・英梨々" },
  { value: "utaha", label: "霞ヶ丘詩羽" },
  { value: "michiru", label: "氷堂美智留", disabled: true },
];
