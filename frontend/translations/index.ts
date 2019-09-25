const defaultLanguage = "en"

type Translation = {
  [key: string]: string | { [key2: string]: string }[]
}

const getTranslator = <T extends Translation>(dicts: { [lang: string]: T }) => (
  lng: string,
) => (key: keyof T, variables?: { [key: string]: any }) => {
  const translation: T[keyof T] =
    (dicts[lng] || {})[key] || (dicts[defaultLanguage] || {})[key]

  if (!translation) {
    return key
  }

  return Array.isArray(translation)
    ? translation.map(t => substitute<T>(t, variables))
    : substitute<T>(translation, variables)
}

const substitute = <T>(
  translation: T[keyof T],
  variables?: { [key: string]: any },
): any => {
  if (typeof translation === "object") {
    return Object.keys(translation).reduce(
      (obj, key: string) => ({
        ...obj,
        // FIXME: type
        // @ts-ignore
        [key]: substitute(translation[key], variables),
      }),
      {},
    )
  }

  if (typeof translation !== "string") {
    console.warn(
      `WARNING: translation only supports strings or objects - got ${translation} of type ${typeof translation}`,
    )

    return translation
  }

  const groups = translation.match(/{{(.*?)}}/gm)

  if (!groups) {
    return translation
  }

  if (!variables) {
    console.warn(
      `WARNING: no variables present for translation string "${translation}"`,
    )
    return translation
  }

  let ret: string = translation
  ;(groups || []).forEach((g: string) => {
    const key = g.slice(2, g.length - 2)
    const variable = (variables || {})[key]

    if (!variable) {
      console.warn(
        `WARNING: no variable present for translation string "${translation}" and key "${key}"`,
      )
    } else {
      const replaceRegExp = new RegExp(`{{${key}}}`, "g")
      ret = ret.replace(replaceRegExp, `${variable}`)
    }
  })

  return ret
}

export default getTranslator
