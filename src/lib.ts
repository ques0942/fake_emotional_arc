import * as kuromoji from "kuromoji"
import * as analyze from "negaposi-analyzer-ja"

export function splitText(text: String): string[]{
    return text
        .split("\n")
        .map(line => {return line.trim()})
        .filter(line => {return line != ""})
}

export class Analyzer {
    tokenizer = null
    init = async (options) => {
        if (this.tokenizer != null){
            return
        }
        return new Promise(resolve => {
            kuromoji.builder(options).build((err, tokenizer) => {
                this.tokenizer = tokenizer
                resolve()
            })
        })
    }
    analyzeString = (line:string) => {
        const tokens = this.tokenizer.tokenize(line)
        return analyze(tokens)
    }
}