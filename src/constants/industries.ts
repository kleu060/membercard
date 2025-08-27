export const INDUSTRY_OPTIONS = [
  "房地產業務 (Real Estate)",
  "汽車銷售 (Automotive Sales)",
  "金融保險 (Finance & Insurance)",
  "醫療健康 (Healthcare)",
  "家居維修 (Residential Maintenance)",
  "物流倉儲 (Logistics & Warehousing)",
  "教育與輔導 (Education and Tutoring)",
  "美容護理 (Beauty & Haircare)",
  "旅遊導覽 (Tourism Services)",
  "餐飲與住宿 (Dining and Accommodation)",
  "製造業 (Manufacturing)",
  "批發與零售 (Wholesale & Retail)",
  "資訊技術 (Information Technology)",
  "媒體製作 (Media Production)",
  "行銷與內容 (Marketing & Content)",
  "娛樂產業 (Entertainment)",
  "創意設計 (Creative Design)",
  "法律與會計 (Legal & Accounting)",
  "建築工程 (Construction)",
  "農業與畜牧 (Agriculture & Livestock)",
  "其他服務業 (Other Services)"
];

export const VALID_INDUSTRY_TAGS = new Set(INDUSTRY_OPTIONS);

export function isValidIndustryTag(tag: string): boolean {
  return VALID_INDUSTRY_TAGS.has(tag);
}

export function filterValidIndustryTags(tags: string[]): string[] {
  return tags.filter(isValidIndustryTag);
}

export function getIndustryName(tag: string): string {
  // If the tag contains both Chinese and English, show only Chinese
  if (tag.includes(' (') && tag.includes(')')) {
    return tag.split(' (')[0];
  }
  return tag;
}

export function getIndustryEnglishName(tag: string): string {
  // If the tag contains both Chinese and English, show only English
  if (tag.includes(' (') && tag.includes(')')) {
    const match = tag.match(/\(([^)]+)\)/);
    return match ? match[1] : tag;
  }
  return tag;
}