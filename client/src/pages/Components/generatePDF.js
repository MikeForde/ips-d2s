import jsPDF from 'jspdf';

const formatDate = (dateString) => {
    if (!dateString) return "";
    const [datePart, timePart] = dateString.split("T");
    const time = timePart.split(".")[0];
    return `${datePart} ${time}`;
};

export const generatePDF = (ips) =>  {
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;

    let yOffset = margin;

    doc.text(`Patient Report ${ips.patient.given} ${ips.patient.name}`, margin, yOffset);
    yOffset += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(`Name: ${ips.patient.name}`, margin, yOffset);
    yOffset += 10;

    doc.text(`Given Name: ${ips.patient.given}`, margin, yOffset);
    yOffset += 10;

    const details = [
      `DOB: ${ips.patient.dob.split("T")[0]}`,
      `Gender: ${ips.patient.gender}`,
      `Country: ${ips.patient.nation}`,
      `Practitioner: ${ips.patient.practitioner}`,
      `Organization: ${ips.patient.organization}`
    ];

    details.forEach(detail => {
      if (yOffset + 10 > pageHeight) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(detail, margin, yOffset, { maxWidth: pageWidth });
      yOffset += 10;
    });

    doc.setFont('helvetica', 'bold');
    doc.text("Medications", margin, yOffset);
    yOffset += 10;
    doc.setFont('helvetica', 'normal');

    ips.medication.forEach((med, index) => {
      if (yOffset > pageHeight) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}. ${med.name} - Date: ${formatDate(med.date)} - Dosage: ${med.dosage}`, margin, yOffset, { maxWidth: pageWidth });
      yOffset += 10;
    });

    if (yOffset > pageHeight) {
      doc.addPage();
      yOffset = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text("Allergies", margin, yOffset);
    yOffset += 10;
    doc.setFont('helvetica', 'normal');

    ips.allergies.forEach((allergy, index) => {
      if (yOffset > pageHeight) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}. ${allergy.name} - Criticality: ${allergy.criticality} - Date: ${allergy.date.split("T")[0]}`, margin, yOffset, { maxWidth: pageWidth });
      yOffset += 10;
    });

    if (yOffset > pageHeight) {
      doc.addPage();
      yOffset = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text("Conditions", margin, yOffset);
    yOffset += 10;
    doc.setFont('helvetica', 'normal');

    ips.conditions.forEach((condition, index) => {
      if (yOffset > pageHeight) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}. ${condition.name} - Date: ${formatDate(condition.date)}`, margin, yOffset, { maxWidth: pageWidth });
      yOffset += 10;
    });

    if (yOffset > pageHeight) {
      doc.addPage();
      yOffset = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text("Observations", margin, yOffset);
    yOffset += 10;
    doc.setFont('helvetica', 'normal');

    ips.observations.forEach((observation, index) => {
      if (yOffset > pageHeight) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}. ${observation.name} - Date: ${formatDate(observation.date)} - Value: ${observation.value}`, margin, yOffset, { maxWidth: pageWidth });
      yOffset += 10;
    });

    if (yOffset > pageHeight) {
      doc.addPage();
      yOffset = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text("Immunizations", margin, yOffset);
    yOffset += 10;
    doc.setFont('helvetica', 'normal');

    ips.immunizations.forEach((immunization, index) => {
      if (yOffset > pageHeight) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}. ${immunization.name} - Date: ${immunization.date.split("T")[0]} - System: ${immunization.system}`, margin, yOffset, { maxWidth: pageWidth });
      yOffset += 10;
    });

    const patientName = `${ips.patient.given}_${ips.patient.name}`.replace(/\s+/g, '_');
    const filename = `Patient_${patientName}_Report.pdf`;

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);

    const newWindow = window.open(url);

    setTimeout(() => {
        newWindow.document.title = filename;
        const downloadLink = newWindow.document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        newWindow.document.body.appendChild(downloadLink);

        setTimeout(() => {
            downloadLink.parentNode.removeChild(downloadLink);
        }, 1000);
    }, 500);
};
