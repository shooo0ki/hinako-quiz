export type QuizQuestion = {
  id: string;
  prompt: string;
  answer: string;
  detail?: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "hot-short-psl",
    prompt: "ホット ショート PSL ポンプ数は？",
    answer: "トール基準 -1ポンプで合計1ポンプ",
    detail: "PSLなどシロップ系はショートで1ポンプ、トールで2ポンプ。",
  },
  {
    id: "ice-grande-latte",
    prompt: "アイス グランデ ラテ ショット数は？",
    answer: "2ショット",
    detail: "アイスはショット数がトールと同じ（ショート:1 / トール:2 / グランデ:2 / ベンティ:3）。",
  },
  {
    id: "frap-syrup-tall",
    prompt: "トール フラペチーノ シロップポンプ数は？",
    answer: "2ポンプ",
    detail: "フラペはショート:1 / トール:2 / グランデ:2 / ベンティ:2。",
  },
  {
    id: "light-ice-tea",
    prompt: "アイス ティー系でライトアイス指定。氷の目盛りは？",
    answer: "1/2ライン",
    detail: "トール以上は2/3がデフォ、ライトは1/2、ノンは0。",
  },
  {
    id: "half-sweet-custom",
    prompt: "Half Sweet指定。シロップポンプはどうする？",
    answer: "デフォポンプの半分に減らす",
    detail: "1ポンプのときは0.5ポンプで作る。",
  },
  {
    id: "milk-change",
    prompt: "オーツミルク変更。フォームは？",
    answer: "フォームが必要ならオーツで作り直す",
    detail: "スタンダードミルクは牛乳→指定ミルクに変更。",
  },
  {
    id: "refresher-barista",
    prompt: "リフレッシャーズで水抜き・追加なしの場合の希釈は？",
    answer: "リフレッシャーベースのみ（ストレート）",
    detail: "ウォーター/レモネード追加なしならベースのみ。",
  },
  {
    id: "extra-shot-psl",
    prompt: "トール PSLにエスプレッソショット追加。フォームは？",
    answer: "追加ショットをフォームの上にかける",
    detail: "ショット追加時は仕上げでフォーム上に注ぐ。",
  },
];
