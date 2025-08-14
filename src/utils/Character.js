import lunar from "@/assets/images/luna.svg";
import creater from "@/assets/images/creator.svg";
import gaia from "@/assets/images/guia.svg";
import nevula from "@/assets/images/nevula.svg";
import volcano from "@/assets/images/volcano.svg";

export const characterTheme = {
  NEUTRAL: {
    name: "루나",
    bg: "linear-gradient(135deg, #f3e8ff, #f1c0f8ff)",
    img: lunar,
  },
  CONSERVATIVE: {
    name: "크레이터",
    bg: "linear-gradient(135deg, #f0d8b8ff, #f2ac7aff)",
    img: creater,
  },
  STABLE: {
    name: "가이아",
    bg: "linear-gradient(135deg, #b8caf0ff, #2940d9ba)",
    img: gaia,
  },
  AGGRESSIVE: {
    name: "네뷸라",
    bg: "linear-gradient(135deg, #af73a484, #423842c5)",
    img: nevula,
  },
  GROWTH: {
    name: "볼케이노",
    bg: "linear-gradient(135deg, #f350508b, #ff0000a1)",
    img: volcano,
  },
};

export function getInvestTheme(investType) {
  const key = String(investType).toUpperCase();
  return characterTheme[key];
}
