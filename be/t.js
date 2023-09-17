import { XMLBuilder } from 'fast-xml-parser'
import { XMLParser } from 'fast-xml-parser'

const XMLdata = `
<car>
    <color alpha="7">purple</color>
    <type>minivan</type>
    <registration>2020-02-03</registration>
    <capacity>7</capacity>
</car>`

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: '@@',
  format: true
}
const parser = new XMLParser(options)
let result = parser.parse(XMLdata)
console.log(0, result)
// console.log(1, JSON.stringify(result, null, 4))

const builder = new XMLBuilder(options)
const output = builder.build(result)
console.log(2, output)
