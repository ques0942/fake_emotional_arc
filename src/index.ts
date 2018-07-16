import {splitText, Analyzer} from "./lib"
import * as kuromoji from "kuromoji"
import analyze from "negaposi-analyzer-ja"
import {Chart, ChartConfiguration, ChartData, ChartDataSets} from "chart.js"

const textAnalyzer: Analyzer = new Analyzer()

const analyzeTarget = async () => {
    const targetElem = document.getElementById("target") as HTMLTextAreaElement
    const text = targetElem.value
    const lines = splitText(text)
    targetElem.value = lines.join("\n")
    resize(targetElem)
    await textAnalyzer.init({dicPath: "../assets/dict/"})
    const results = document.getElementById("results") as HTMLTableElement
    results.innerHTML = `
<table id="results">
    <tr>
        <th>行数</th>
        <th>評価値</th>
        <th>テキスト</th>
    </tr>
</table>
`
    const points = []
    let currentValue = 0
    let idx = 0
    for (let line of lines){
        points.push(currentValue)
        const value = textAnalyzer.analyzeString(line)
        currentValue += value
        const row = document.createElement("tr") as HTMLTableRowElement
        const rowNum = document.createElement("td") as HTMLTableDataCellElement
        rowNum.innerText = idx.toString()
        row.appendChild(rowNum)
        const analyzeValue = document.createElement("td") as HTMLTableDataCellElement
        analyzeValue.innerText = value.toString()
        row.appendChild(analyzeValue)
        const text = document.createElement("td") as HTMLTableDataCellElement
        text.innerText = line
        row.appendChild(text)
        results.appendChild(row)
        idx += 1
    }
    console.log(points)
    const ctx = (
        document.getElementById("chart") as HTMLCanvasElement
    ).getContext('2d');
    const conf: ChartConfiguration = {
        type: "bar",
        data: {
            labels: Array.from(points.keys()).map(i => (i+1).toString()),
            datasets: [{
                label: "解析結果",
                data: points
            }]
        },
        options: {
            responsive: false,
            elements: {
                point: {
                    pointStyle: "circle"
                }
            }
        }
    }
    const chart = new Chart(ctx, conf)
}

const resize = (elem: HTMLTextAreaElement) => {
    const text = elem.value
    const lines = text.split("\n")
    elem.rows = lines.length
    elem.cols = Math.max(...lines.map(line => line.length)) * 1.5
}

const main = async () => {
    const response = await fetch("../assets/sample.txt")
    const text = await response.text()
    const textarea = document.getElementById("target") as HTMLTextAreaElement
    textarea.value = text
    resize(textarea)
    const button = document.getElementById("analyzeButton")
    button.onclick = analyzeTarget
}

main()
