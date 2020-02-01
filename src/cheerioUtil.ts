import axios from 'axios';
import * as cheerio from 'cheerio';

const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/

export async function getDocument(url: string) {
  const { data } = await axios.get(url);
    return cheerio.load(data);
}

/**
 * Returns a tuple containing a filename and bytes
 */
export async function getBuffer(url: string): Promise<[string | undefined, ArrayBuffer]> {
  const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000
  });
  const contentDisposition: string = res.headers['content-disposition'] || ''
  const [, filename] = contentDisposition.match(filenameRegex) || []

  return [filename, res.data]
}
