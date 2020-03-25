import ejs from 'ejs'
import fs from 'fs'
import path from 'path'

export default {
    compile(tempfile, context) {
        var filePath = process.env.NODE_ENV === 'production' ? process.cwd() + `/templates/${tempfile}` : path.resolve(__dirname, '../../') + `/templates/${tempfile}`
        var template = fs.readFileSync(filePath, 'utf8')
        return ejs.render(template, context)
    }
}
