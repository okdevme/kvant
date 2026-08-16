export function getSection(path: string | undefined) {
  if (!path)
    return 'kvant'
  const [dir] = path.split('/', 1)
  return dir ?? 'kvant'
}
