export type RecipeSizeInfo = {
  size: "Short" | "Tall" | "Grande" | "Venti";
  shots: string;
  syrup: string;
  milk?: string;
  notes?: string;
};

export type RecipeItem = {
  id: string;
  name: string;
  category: "Espresso" | "Frappuccino" | "Tea" | "Refreshers" | "Others";
  base?: string;
  sizes: RecipeSizeInfo[];
  notes?: string;
};

export const RECIPES: RecipeItem[] = [
  {
    id: "latte",
    name: "カフェ ラテ",
    category: "Espresso",
    base: "エスプレッソ + スチームミルク",
    sizes: [
      { size: "Short", shots: "1", syrup: "-", milk: "ミルク" },
      { size: "Tall", shots: "1", syrup: "-", milk: "ミルク" },
      { size: "Grande", shots: "2", syrup: "-", milk: "ミルク" },
      { size: "Venti", shots: "2", syrup: "-", milk: "ミルク" },
    ],
    notes: "ショット数はアイスも同じ（Tall=1, Grande=2, Venti=2）。",
  },
  {
    id: "cappuccino",
    name: "カプチーノ",
    category: "Espresso",
    base: "エスプレッソ + フォーム多めミルク",
    sizes: [
      { size: "Short", shots: "1", syrup: "-", milk: "フォーム多め" },
      { size: "Tall", shots: "1", syrup: "-", milk: "フォーム多め" },
      { size: "Grande", shots: "2", syrup: "-", milk: "フォーム多め" },
      { size: "Venti", shots: "2", syrup: "-", milk: "フォーム多め" },
    ],
    notes: "フォームを多めにするのがポイント。ショット数はラテと同じ。",
  },
  {
    id: "psl",
    name: "パンプキン スパイス ラテ",
    category: "Espresso",
    base: "エスプレッソ + PSLシロップ + ミルク + ホイップ",
    sizes: [
      { size: "Short", shots: "1", syrup: "1", milk: "ミルク" },
      { size: "Tall", shots: "1", syrup: "2", milk: "ミルク" },
      { size: "Grande", shots: "2", syrup: "3", milk: "ミルク" },
      { size: "Venti", shots: "2", syrup: "4", milk: "ミルク" },
    ],
    notes: "シロップはショート1ポンプ。トッピングのホイップは基本あり。",
  },
  {
    id: "java-chip-frap",
    name: "ダーク モカ チップ フラペチーノ",
    category: "Frappuccino",
    base: "フラペチーノロースト + チョコチップ + ミルク",
    sizes: [
      { size: "Short", shots: "0", syrup: "1", notes: "フラペはショート:1" },
      { size: "Tall", shots: "0", syrup: "2", notes: "チップ＋ベース" },
      { size: "Grande", shots: "0", syrup: "2", notes: "ポンプ数同じ" },
      { size: "Venti", shots: "0", syrup: "2", notes: "ポンプ数同じ" },
    ],
    notes: "ショットは基本なし。シロップはショート1 / トール2 / グランデ2 / ベンティ2。",
  },
  {
    id: "earlgrey-tea-latte",
    name: "アール グレイ ティー ラテ",
    category: "Tea",
    base: "ティーバッグ + クラシックシロップ + ミルク",
    sizes: [
      { size: "Short", shots: "-", syrup: "2", milk: "ミルク" },
      { size: "Tall", shots: "-", syrup: "3", milk: "ミルク" },
      { size: "Grande", shots: "-", syrup: "4", milk: "ミルク" },
      { size: "Venti", shots: "-", syrup: "5", milk: "ミルク" },
    ],
    notes: "ティーバッグはサイズで枚数増。クラシックはショート2から1刻みで増える。",
  },
  {
    id: "matcha-tea-latte",
    name: "抹茶 ティー ラテ",
    category: "Tea",
    base: "抹茶パウダー + クラシックシロップ + ミルク",
    sizes: [
      { size: "Short", shots: "-", syrup: "2", milk: "ミルク", notes: "抹茶パウダー2" },
      { size: "Tall", shots: "-", syrup: "3", milk: "ミルク", notes: "抹茶パウダー3" },
      { size: "Grande", shots: "-", syrup: "4", milk: "ミルク", notes: "抹茶パウダー4" },
      { size: "Venti", shots: "-", syrup: "5", milk: "ミルク", notes: "抹茶パウダー5" },
    ],
    notes: "抹茶パウダーはシロップと同じ本数で増加。",
  },
  {
    id: "chai-tea-latte",
    name: "チャイ ティー ラテ",
    category: "Tea",
    base: "チャイシロップ + ミルク",
    sizes: [
      { size: "Short", shots: "-", syrup: "2", milk: "ミルク" },
      { size: "Tall", shots: "-", syrup: "3", milk: "ミルク" },
      { size: "Grande", shots: "-", syrup: "4", milk: "ミルク" },
      { size: "Venti", shots: "-", syrup: "5", milk: "ミルク" },
    ],
    notes: "フォームあり。チャイシロップはショート2から1刻みで増える。",
  },
  {
    id: "pink-drink",
    name: "ピンク ドリンク（リフレッシャーズ）",
    category: "Refreshers",
    base: "ストロベリーベース + ココナッツミルク",
    sizes: [
      { size: "Short", shots: "-", syrup: "-", milk: "ココナッツ" },
      { size: "Tall", shots: "-", syrup: "-", milk: "ココナッツ" },
      { size: "Grande", shots: "-", syrup: "-", milk: "ココナッツ" },
      { size: "Venti", shots: "-", syrup: "-", milk: "ココナッツ" },
    ],
    notes: "水抜きの場合はベースのみで希釈なし。氷量指定に注意。",
  },
  {
    id: "vanilla-cream-frap",
    name: "バニラ クリーム フラペチーノ",
    category: "Frappuccino",
    base: "クリームベース + バニラシロップ + ミルク",
    sizes: [
      { size: "Short", shots: "0", syrup: "1", milk: "ミルク" },
      { size: "Tall", shots: "0", syrup: "2", milk: "ミルク" },
      { size: "Grande", shots: "0", syrup: "2", milk: "ミルク" },
      { size: "Venti", shots: "0", syrup: "2", milk: "ミルク" },
    ],
    notes: "バニラシロップはフラペの標準ポンプ数。ホイップは基本あり。",
  },
  {
    id: "caramel-macchiato",
    name: "キャラメル マキアート",
    category: "Espresso",
    base: "バニラシロップ + スチームミルク + ショット後がけ + キャラメルソース",
    sizes: [
      { size: "Short", shots: "1 後がけ", syrup: "1 バニラ", milk: "ミルク" },
      { size: "Tall", shots: "1 後がけ", syrup: "2 バニラ", milk: "ミルク" },
      { size: "Grande", shots: "2 後がけ", syrup: "3 バニラ", milk: "ミルク" },
      { size: "Venti", shots: "2 後がけ", syrup: "4 バニラ", milk: "ミルク" },
    ],
    notes: "ショットは後がけ。バニラはサイズごとに1ずつ増える。",
  },
  {
    id: "mocha",
    name: "カフェ モカ",
    category: "Espresso",
    base: "エスプレッソ + モカシロップ + ミルク + ホイップ",
    sizes: [
      { size: "Short", shots: "1", syrup: "2", milk: "ミルク" },
      { size: "Tall", shots: "1", syrup: "3", milk: "ミルク" },
      { size: "Grande", shots: "2", syrup: "4", milk: "ミルク" },
      { size: "Venti", shots: "2", syrup: "5", milk: "ミルク" },
    ],
    notes: "モカシロップはショート2から1刻みで増加。ホイップは基本あり。",
  },
  {
    id: "cold-brew",
    name: "コールドブリュー",
    category: "Others",
    base: "コールドブリューコンセントレート + 水",
    sizes: [
      { size: "Short", shots: "-", syrup: "-", notes: "氷 2/3ライン" },
      { size: "Tall", shots: "-", syrup: "-", notes: "氷 2/3ライン" },
      { size: "Grande", shots: "-", syrup: "-", notes: "氷 2/3ライン" },
      { size: "Venti", shots: "-", syrup: "-", notes: "氷 2/3ライン" },
    ],
    notes: "基本シロップなし。ライト/ノンアイス指定に注意。",
  },
];
