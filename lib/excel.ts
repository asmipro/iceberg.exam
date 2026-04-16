import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export async function exportSubmissionsToExcel(submissions: any[], role: string, level: string = "Barcha", selectedDate?: string) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Natijalar')

  // Theme Colors (Indigo/Slate)
  const colors = {
    primary: '4F46E5', // Indigo-600
    headerBg: '0F172A', // Slate-900
    headerText: 'FFFFFF',
    border: 'E2E8F0', // Slate-200
  }

  // Define Columns
  worksheet.columns = [
    { header: 'Test Nomi', key: 'testTitle', width: 25 },
    { header: 'Ism', key: 'firstName', width: 20 },
    { header: 'Familiya', key: 'lastName', width: 20 },
    { header: 'Rol', key: 'role', width: 15 },
    { header: 'Etap / Mutaxassislik', key: 'level', width: 20 },
    { header: 'Sana', key: 'date', width: 25 },
    { header: 'Ball / Max', key: 'score', width: 15 },
    { header: 'Foiz', key: 'percentage', width: 12 },
    { header: 'Batafsil Javoblar', key: 'details', width: 65 },
  ]

  // Add Data Rows
  submissions.forEach(sub => {
    const percentage = sub.totalQuestions > 0 ? Math.round((sub.score / sub.totalQuestions) * 100) : 0
    
    // Format detailed answers
    const detailedAnswers = Array.isArray(sub.answers) ? sub.answers.map((ans: any, idx: number) => {
      // Prioritize snapshot data, fallback to lookup
      const question = sub.test?.questions?.find((q: any) => q.id === ans.questionId)
      const qText = ans.questionText || question?.text || `Savol [ID: ${ans.questionId?.slice(-6)}] (Ma'lumot topilmadi)`
      const cAnswer = ans.correctAnswer || question?.correctAnswer || "Mavjud emas"
      
      const userAnswer = ans.answer !== undefined && ans.answer !== null ? ans.answer : "(Javob berilmagan)"
      const isCorrect = ans.isCorrect
      
      let status = ""
      if (isCorrect === true) status = "✅ (To'g'ri)"
      else if (isCorrect === false) status = `❌ (Xato) [Aslida: ${cAnswer}]`
      else status = "(Ochiq savol - Tekshirilmaydi)"
      
      return `${idx + 1}. ${qText}\n   ↳ Javob: ${userAnswer} ${status}`
    }).join('\n\n') : ""

    worksheet.addRow({
      testTitle: sub.test?.title || "Noma'lum",
      firstName: sub.firstName,
      lastName: sub.lastName,
      role: sub.role === 'STUDENT' ? 'Talaba' : 'O\'qituvchi',
      level: sub.level,
      date: new Date(sub.createdAt).toLocaleString('uz-UZ'),
      score: `${sub.score} / ${sub.totalQuestions}`,
      percentage: `${percentage}%`,
      details: detailedAnswers,
    })
  })

  // Style Header Row
  const headerRow = worksheet.getRow(1)
  headerRow.height = 30
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colors.headerBg }
    }
    cell.font = {
      name: 'Outfit',
      color: { argb: colors.headerText },
      bold: true,
      size: 11
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin', color: { argb: colors.primary } },
      bottom: { style: 'thick', color: { argb: colors.primary } }
    }
  })

  // Style Data Rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Row height will be determined by content (wrapText is enabled)
      row.eachCell((cell, colNumber) => {
        // Only the 9th column (Details) should be left-aligned
        const isDetailsColumn = colNumber === 9
        cell.alignment = { 
          vertical: 'top', 
          horizontal: isDetailsColumn ? 'left' : 'center', 
          wrapText: true 
        }
        cell.border = {
          bottom: { style: 'thin', color: { argb: colors.border } }
        }
        if (cell.value && typeof cell.value === 'string' && cell.value.includes('%')) {
          const val = parseInt(cell.value)
          cell.font = {
            bold: true,
            color: { argb: val >= 80 ? '10B981' : val >= 50 ? 'F59E0B' : 'EF4444' }
          }
        }
      })
    }
  })

  // Generate and Save using native anchor method for better browser compatibility
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  
  const safeRole = role.replace(/[^a-z0-9]/gi, '_')
  const safeLevel = level.replace(/[^a-z0-9]/gi, '_')
  const dateStr = selectedDate || new Date().toISOString().split('T')[0]
  const fileName = `Natijalar_${safeRole}_${safeLevel}_${dateStr}.xlsx`

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  
  // Cleanup
  link.parentNode?.removeChild(link)
  window.URL.revokeObjectURL(url)
}
