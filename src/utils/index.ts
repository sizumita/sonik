export const filePathToPath = (filePath: string) => {
  filePath = filePath
    .replace(/\.tsx$/g, '')
    .replace(/^\/?index/, '/') // `/index`
    .replace(/\/index/, '') // `/about/index`
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')
  return /^\//.test(filePath) ? filePath : '/' + filePath
}

export const sortObject = <T>(obj: Record<string, T>) => {
  const sortedEntries = Object.entries(obj).sort((a, b) => {
    if (a[0] > b[0]) {
      return -1
    }
    if (a[0] < b[0]) {
      return 1
    }
    return 0
  })

  const sortedObject: Record<string, T> = {}
  for (const [key, value] of sortedEntries) {
    sortedObject[key] = value
  }

  return sortedObject
}

/*
  /app/routes/_error.tsx
  /app/routes/_404.tsx
  => {
    '/app/routes': {
      '/app/routes/_error.tsx': file,
      '/app/routes/_404.tsx': file
    }
    ...
  }
 */
export const groupByDirectory = <T = unknown>(files: Record<string, T>) => {
  const organizedFiles = {} as Record<string, Record<string, T>>

  for (const [path, content] of Object.entries(files)) {
    const pathParts = path.split('/')
    const fileName = pathParts.pop()
    const directory = pathParts.join('/')

    if (!organizedFiles[directory]) {
      organizedFiles[directory] = {}
    }

    if (fileName) {
      organizedFiles[directory][fileName] = content
    }
  }

  return organizedFiles
}

/*
  /app/routes/_layout.tsx
  /app/routes/blog/_layout.tsx
  => {
    '/app/routes': ['/app/routes/_layout.tsx']
    '/app/routes/blog': ['/app/routes/blog/_layout.tsx', '/app/routes/_layout.tsx']
  }
 */
export const listByDirectory = <T = unknown>(files: Record<string, T>) => {
  const organizedFiles = {} as Record<string, string[]>

  for (const path of Object.keys(files)) {
    const pathParts = path.split('/')
    pathParts.pop() // extract file
    const directory = pathParts.join('/')

    if (!organizedFiles[directory]) {
      organizedFiles[directory] = []
    }
    if (!organizedFiles[directory].includes(path)) {
      organizedFiles[directory].push(path)
    }
  }

  const directories = Object.keys(organizedFiles).sort((a, b) => a.length - b.length)
  for (const dir of directories) {
    for (const subDir of directories) {
      if (subDir.startsWith(dir) && subDir !== dir) {
        const uniqueFiles = new Set([...organizedFiles[dir], ...organizedFiles[subDir]])
        organizedFiles[subDir] = [...uniqueFiles]
      }
    }
  }

  return organizedFiles
}
