import * as XLSX from "xlsx"
import { saveAs } from "file-saver"


export function exportToExcel(data,fileName){

const worksheet = XLSX.utils.json_to_sheet(data)

const workbook = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(workbook,worksheet,"Report")

const excelBuffer = XLSX.write(workbook,{
bookType:"xlsx",
type:"array"
})

const blob = new Blob([excelBuffer],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
})

saveAs(blob,`${fileName}.xlsx`)

}



export function exportToCSV(data,fileName){

const worksheet = XLSX.utils.json_to_sheet(data)

const csv = XLSX.utils.sheet_to_csv(worksheet)

const blob = new Blob([csv],{
type:"text/csv;charset=utf-8;"
})

saveAs(blob,`${fileName}.csv`)

}