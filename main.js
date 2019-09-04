const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {exec} = require('child_process');
const fs = require('fs');
app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', (req, res) => {
    build(req.body, res);
});

generate_script = (data) => {
    let first_template = 'builder.CreateFile("docx");\n' +
        'const Document = Api.GetDocument();\n';
    first_template += 'const data = ' + JSON.stringify(data) + ';\n';
    first_template += 'let paragraph = Document.GetElement(0);\n' +
        'FullName_style = Document.CreateStyle("FullName");\n' +
        'FullName_style.GetTextPr().SetFontSize(28);\n' +
        'FullName_style.GetTextPr().SetBold(true);\n' +
        'paragraph.SetStyle(FullName_style);\n' +
        'paragraph.SetSpacingLine(1.15 * 240, "auto");\n' +
        'paragraph.AddText(data.userData.fillName);' +
        '// Country and city\n' +
        'const CountryCity_style = Document.CreateStyle("CountryCity");\n' +
        'CountryCity_style.GetTextPr().SetFontSize(20);\n' +
        'CountryCity_style.GetTextPr().SetCaps(true);\n' +
        'CountryCity_style.GetTextPr().SetBold(true);\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText(data.userData.country + \', \' + data.userData.city);\n' +
        'paragraph.SetStyle(CountryCity_style);\n' +
        'paragraph.SetSpacingAfter(0);\n' +
        'Document.Push(paragraph);// phone number\n' +
        'const PhoneNumber_style = Document.CreateStyle("PhoneNumber");\n' +
        'PhoneNumber_style.GetTextPr().SetFontSize(20);\n' +
        'PhoneNumber_style.GetParaPr().SetSpacingAfter(0);\n' +
        'PhoneNumber_style.GetTextPr().SetBold(true);\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText(data.userData.phoneNumber);\n' +
        'paragraph.SetStyle(PhoneNumber_style);\n' +
        'Document.Push(paragraph);\n' +
        '// email\n' +
        'const Email_style = Document.CreateStyle("Email");\n' +
        'Email_style.GetTextPr().SetFontSize(18);\n' +
        'Email_style.GetParaPr().SetSpacingAfter(0);\n' +
        'Email_style.GetTextPr().SetBold(true);\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText(data.userData.email);\n' +
        'paragraph.SetStyle(Email_style);\n' +
        'Document.Push(paragraph);\n' +
        '// SectionHeader style\n' +
        'const SectionHeader = Document.CreateStyle("SectionHeader");\n' +
        'SectionHeader.GetTextPr().SetBold(true);\n' +
        'SectionHeader.GetTextPr().SetColor(247, 93, 93, false);\n' +
        'SectionHeader.GetTextPr().SetFontSize(28);\n' +
        'SectionHeader.GetParaPr().SetSpacingBefore(1.33 * 240);\n' +
        'SectionHeader.GetParaPr().SetSpacingLine(1 * 240, "auto");\n' +
        '// add header Profile:\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText("Profile:")\n' +
        'paragraph.SetStyle(SectionHeader);\n' +
        'Document.Push(paragraph);\n' +
        '// add profile text:\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText(data.userData.profile)\n' +
        'Document.Push(paragraph);\n' +
        '// add header Education:\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText("Education:")\n' +
        'paragraph.SetStyle(SectionHeader);\n' +
        'Document.Push(paragraph);\n' +
        '// add education year:\n' +
        'const EducationYear_style = Document.CreateStyle("EducationYear");\n' +
        'EducationYear_style.GetTextPr().SetColor(102, 102, 102);\n' +
        'EducationYear_style.GetTextPr().SetFontSize(18);\n' +
        'EducationYear_style.GetParaPr().SetSpacingAfter(0);\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.SetStyle(EducationYear_style);\n' +
        'paragraph.AddText(data.userData.education.year)\n' +
        'Document.Push(paragraph);\n' +
        '// add education university:\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'run = Api.CreateRun();\n' +
        'run.AddText(data.userData.education.university)\n' +
        'run.AddText(\', \')\n' +
        'run.AddText(data.userData.education.location)\n' +
        'run.SetBold(true);\n' +
        'paragraph.AddElement(run);\n' +
        'run = Api.CreateRun();\n' +
        'run.AddText(\' – \' + data.userData.education.degree)\n' +
        'paragraph.AddElement(run);\n' +
        'Document.Push(paragraph);\n' +
        '// add header Skills:\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'paragraph.AddText("Skills:")\n' +
        'paragraph.SetStyle(SectionHeader);\n' +
        'Document.Push(paragraph);\n' +
        '// add skills text:\n' +
        'paragraph = Api.CreateParagraph();\n' +
        'const skills = data.userData.skills.map(x => \' \' + x).toString();\n' +
        'paragraph.AddText(skills)\n' +
        'Document.Push(paragraph);\n';
    return first_template;
};

build = (data, res) => {
    const filename = Math.random().toString(36).substring(7) + '.docx';
    let script = generate_script(data);
    script += 'builder.SaveFile("docx", "' + __dirname + '/public/' + filename + '");\n' + 'builder.CloseFile();';
    fs.writeFile('public/' + filename + 'js', script, () => {
        exec('documentbuilder ' + 'public/' + filename + 'js', () => { res.send({'filename': filename }); });
    });
};

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));


