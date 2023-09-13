import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
export function blobToString(blob: any): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

export async function parseStringAsXML<T = any>(str: string): Promise<T> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    // 忽略 xml
    ignorePiTags: true,
    ignoreDeclaration: true,
  });
  let jObj = parser.parse(str);
  // console.log(jObj);

  return jObj;
}

export const formatDateTime = (
  time: Date | string,
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  const r = dayjs(time).format(format);
  return r;
};

// Fri, 08 Sep 2023 00:00:00 GMT
export const formatDate = (date: string) => {
  const timestamp = Number(date) * 1;
  const str = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
  return str;
};
