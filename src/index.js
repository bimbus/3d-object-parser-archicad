import { readFileSync, writeFileSync } from 'fs'
import cheerio from 'cheerio'
import { params } from '../config/params'
import { AkeneoClient, AkeneoEntity } from '@crapougnax/api-client-akeneo'
import { tags } from '../config/tags';
import path from 'path'
import { execFile } from 'child_process'

const LP_XMLConverter = "C:\\Program Files\\GRAPHISOFT\\ARCHICAD 21\\LP_XMLConverter.exe"
const client = new AkeneoClient(params)

client.authenticate().then(() => {
  const product = client.product('SHA125A')
  product.fetch().then(() => {
    if (product.attribute('ifc')) {
      const rootPath = path.dirname(path.dirname(__filename))
      const tmpPath = rootPath + '/tmp/'
      const gsmFile = tmpPath + product.attribute('identifier') + '.gsm'
      const xmlFile = tmpPath + product.attribute('identifier') + '.xml'
      const xmlParsedFile = tmpPath + product.attribute('identifier') + '-parsed.xml'

      product.blob('ifc').then((buffer) => {
        writeFileSync(gsmFile, buffer, {'encoding': 'binary'})
        execFile(LP_XMLConverter, ['libpart2xml', gsmFile, xmlFile], function(err) {
          if (err) {
            // something
          }
          // Load XML
          const $ = cheerio.load(
            readFileSync(xmlFile, { encoding: 'utf-8' }),
            {
              decodeEntities: false,
              xmlMode: true
            }
          )

          const promises = []

          for (let tag of tags) { // Parse tags
            const node = $(`${tag.type}[Name="${tag.id}"] Value`)
            if (! node) {
              console.log(`Can't find node '${tag.id}'`)
              continue
            }
            try {
              if (! tag.from) { // parse direct attribute
                setNodeValue(node, product.attribute(tag.pim))
              } else { // get values from product associations
                const parser = product.associations(tag.from[0], tag.from[1])
                promises.push(parser)
                parser.then((items) => {
                  let attrVal = ''
                  for (let item of items) {
                    if (item.constructor.name === AkeneoEntity.name) {
                      attrVal += item.attribute(tag.pim) + ' '
                    } else {
                      console.warn(`item is not of 'AkeneoEntity' type but of '${item.constructor.name}' type `)
                    }
                  }
                  setNodeValue(node, attrVal)
                })
              }
            } catch (e) {
              console.error(e)
            }
          }

          // Save file after all concurrent parsing operations have been carried on
          Promise.all(promises, () => {
            writeFileSync(xmlParsedFile, $.xml())

            // convert from xml to gsm
            execFile(LP_XMLConverter, ['xml2libpart', xmlParsedFile, gsmFile], function(err) {
              if (err) {
                console.error(err)
                process.exit(1)
              }
              console.log(`${gsmFile} saved`)
            }) // execFile #2
          }) // promises parsing
        }) // execFile #1
      }) // blob
    } // attribute ifc
  })
})

function toCdata(value) {
  return `<![CDATA["${value}"]]>`
}

  // Put value in <Value> node
function setNodeValue(node, val) {
  node.text(toCdata(val))
  console.log(`Node '${node.parent().attr('Name')}' value has been changed to '${val}'`)
}