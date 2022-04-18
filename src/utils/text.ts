export function getTextSize(text: string, defaultLength: number, defaultSize: number): number {
  return text.length < defaultLength ? defaultSize : Math.floor(defaultSize * (defaultLength / text.length))
}
