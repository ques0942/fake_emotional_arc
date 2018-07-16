import {splitText, Analyzer} from "./lib"
import * as fs from "fs"

const main = async () => {
    const sample = fs.readFileSync("assets/sample.txt")
    const lines = splitText(sample.toString())
    const analyzer = new Analyzer()
    await analyzer.init({dicPath: "./assets/dict/"})
    for (let line of lines){
        console.log(line)
        console.log(analyzer.analyzeString(line))
    }
}

main()