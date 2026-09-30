/** Straight quotes → typographic ones, so data files can stay easy to type. */
export function typeset(text = '') {
  return text
    .replace(/(\w)'(\w)/g, '$1’$2') // don't, they're
    .replace(/'(\d0s)/g, '’$1') // '90s
    .replace(/(^|[\s(“])'/g, '$1‘')
    .replace(/'/g, '’')
    .replace(/(^|[\s(])"/g, '$1“')
    .replace(/"/g, '”')
}
