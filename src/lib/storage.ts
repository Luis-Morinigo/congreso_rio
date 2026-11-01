// localStorage puede lanzar en modo privado o con datos de sitio bloqueados.
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Sin persistencia: la página sigue funcionando para esta visita.
  }
}
