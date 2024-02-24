const cyrillicToLatinMap = {
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'д': 'd',
  'е': 'e',
  'ё': 'e',
  'ж': 'zh',
  'з': 'z',
  'и': 'i',
  'й': 'y',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'h',
  'ц': 'ts',
  'ч': 'ch',
  'ш': 'sh',
  'щ': 'sch',
  'ъ': '',
  'ы': 'y',
  'ь': '',
  'э': 'e',
  'ю': 'yu',
  'я': 'ya',
  ' ': '-',
} as const

type CyrillicLetter = keyof typeof cyrillicToLatinMap
function isCyrillicLetter(letter: string): letter is CyrillicLetter {
  return letter in cyrillicToLatinMap
}

export function toTransliterated(str: string) {
  return str
    .trim()
    .toLowerCase()
    .split('')
    .map(l => isCyrillicLetter(l) ? cyrillicToLatinMap[l] : l)
    .join('')
}

export function toUrlFriendly(str: string) {
  return encodeURI(toTransliterated(str))
}
