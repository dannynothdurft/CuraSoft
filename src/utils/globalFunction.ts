import axios from 'axios'

interface GetDataProps {
  tab?: string
  limit?: number
  page?: number
}

/**
 * Diese Funktion ruft Daten von einer API ab, basierend auf dem aktuell
 * ausgewählten Tab, einer optionalen Seitennummer und einer optionalen
 * Limitierung der zurückgegebenen Elemente.
 *
 * Die Funktion ist so konzipiert, dass sie standardmäßig alle verfügbaren
 * Daten abruft (Tab = 'all', Limit = 10 und Seite = 1), falls keine spezifischen
 * Parameter übergeben werden. Sie verwendet axios für die HTTP-Anfrage.
 *
 * @param tab - (Optional) Der Name des aktuellen Tabs, der die Kategorie der Daten
 *              bestimmt, die abgefragt werden sollen. Standardwert ist 'all'.
 * @param limit - (Optional) Die maximale Anzahl von Elementen, die pro Seite
 *                zurückgegeben werden sollen. Standardwert ist 10.
 * @param page - (Optional) Die aktuelle Seite der Daten, die abgefragt werden soll.
 *               Standardwert ist 1.
 * @returns Ein Promise, das bei Erfolg die Daten der API als Objekt zurückgibt.
 *          Die Struktur des zurückgegebenen Objekts hängt von der API-Antwort ab,
 *          enthält aber typischerweise die abgerufenen Daten und zusätzliche
 *          Informationen wie die Gesamtanzahl der Einträge.
 * @throws Gibt einen Fehler in der Konsole aus, falls die API-Abfrage fehlschlägt.
 *
 * Beispiel:
 * ```
 * getData({ tab: 'log' })
 *   .then(res => {
 *     console.log(res)
 *   })
 *   .catch(error => {
 *     console.error(error)
 *   });
 * ```
 */
export async function getData({ tab = 'all', limit = 10, page = 1 }: GetDataProps) {
  try {
    const response = await axios.get(
      'https://test.cura-go.de/web/v3/go.vital/protocol?filter=all&page=1',
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN}`
        },
        params: {
          limit: limit,
          filter: tab,
          page: page
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Es gab ein Problem mit dem Abrufvorgang:', error)
  }
}
